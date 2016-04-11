define([
  'jquery',
  'service/service',
  'test/Test',
  'test/Site',
  'test/Assert',
  'i18n',
], function($, service, test, Site, Assert, i18n) {
  var res = i18n.getResource('module/account/account');
  var CleanDB = new test.UnitTask({
    name: "CleanAccountModule",
    description: "Drop all the data in the account module",
    units: [
      function() { 
        service.AccountService.cleanAccountDB() ;
      }
    ]
  }); 
  
  
  var AccountApiCRUD = new test.UnitTask({
    name: "AccountApiCRUD",
    description: "create/get/update/delete an account",
    units: [
      function() { 
        var loginId = 'hkttest' ;
        var account = { 
          loginId: loginId, password: loginId, 
          type: "ORGANIZATION" ,
          email: loginId + "@localhost" 
        } ;
        service.AccountService.saveAccount(account) ;
        account = service.AccountService.getAccountByLoginId(loginId).data ;
        Assert.assertEquals(loginId, account.loginId) ;
        
        res = service.AccountService.deleteAccountByLoginId(loginId) ;
        Assert.assertTrue(res.data) ;
        
        res = service.AccountService.getAccountByLoginId(loginId) ;
        Assert.assertNull(res.data) ;
        
        for(var i = 0; i < 100; i++) {
          account.loginId = loginId + i ;
          account.type = "USER" ;
          account.email = account.loginId + "@localhost" ;
          service.AccountService.saveAccount(account) ;
        }
      }
    ]
  });
  
  var GroupApiCRUD = new test.UnitTask({
    name: "GroupApiCRUD",
    description: "create/get/update/delete an account group",
    units: [
      function() { 
        var rootName = 'hkttest' ;
        var hktGroup = {name: rootName, description: "group to test service api call" } ;
        hktGroup = service.AccountService.createGroup(null, hktGroup).data ;
        Assert.assertEquals(rootName, hktGroup.name) ;
        
        var hktHrGroup = {name: "hr", description: "HKT hr group" } ;
        hktHrGroup = service.AccountService.createGroup(hktGroup.path, hktHrGroup).data ;
        Assert.assertEquals("hr", hktHrGroup.name) ;
        Assert.assertEquals(rootName + "/hr", hktHrGroup.path) ;
        
        var membership = service.AccountService.createMembership("admin", rootName, "ADMIN").data ;
        Assert.assertEquals("admin", membership.loginId) ;
        Assert.assertEquals("ADMIN", membership.capability) ;
        
        membership = service.AccountService.createMembership("user", rootName, "WRITE").data ;
        Assert.assertEquals("WRITE", membership.capability) ;
        
        //Update membership
        membership = service.AccountService.createMembership("user", rootName, "READ").data ;
        Assert.assertEquals("READ", membership.capability) ;
        
        membership = service.AccountService.deleteMembership("user", rootName).data ;
        Assert.assertEquals("READ", membership.capability) ;
        
        var gdetail = service.AccountService.getGroupDetailByPath(rootName).data ;
        Assert.assertEquals(1, gdetail.children.length) ;
        Assert.assertEquals(1, gdetail.memberships.length) ;
        
      }
    ]
  });
  
  var GoToAccountAccountsScreen = new test.UnitTask({
    name: "GoToAccountAccountsScreen",
    description: "Click on account and then Users in the navigation",
    units: [
      function() { Site.Navigation.clickMenuItem("Account", "Accounts") ; } ,
    ]
  });
  
  var AccountCRUDTaskLoginId = 'hkttest123' ;
  var AccountCRUDTask = new test.UnitTask({
    name: "AccountCRUDTask",
    description: "create/update/delete an account",
    units: [
      //Create Account
      function() { Site.Workspace.tableToolbar('Login ID').clickButton("New"); } ,
      function() {
        var form = Site.PopupPanel.formWithText("Login Id:") ;
        form.selectVal("type", "ORGANIZATION");
        form.inputVal("loginId", AccountCRUDTaskLoginId);
        form.inputVal("password", AccountCRUDTaskLoginId);
        form.inputVal("email", AccountCRUDTaskLoginId + "@hkt.com");
      },
      function() {
        Site.PopupPanel.formWithText("Login Id:").clickButton("Save And Exit");
      },
      
      //EDIT
      function() {//filter to show the account
        var controlGroup = Site.Workspace.tableToolbar("Login ID") ;
        controlGroup.inputVal('beanFilterField', AccountCRUDTaskLoginId) ;
      },
      
      function() {//click edit on the account
        var table = Site.Workspace.tableWithHeader("Login ID") ;
        var row   = table.tableRowWithText(AccountCRUDTaskLoginId) ;
        row.clickLink(AccountCRUDTaskLoginId) ;
      },
      function() {//update information in the form
        var accountBlock = Site.Workspace.collapsibleBlock("Account") ;
        accountBlock.toolbarWith("Edit").clickButton("Edit");
        var form = accountBlock.formWithText("Login Id:") ;
        form.inputVal("email", AccountCRUDTaskLoginId + "update@hkt.com");
      },
      function() {//save the form
        Site.Workspace.toolbarWith("Save").clickButton("Save");
      },
      //Delete
      function() {//filter to show the account
        var controlGroup = Site.Workspace.tableToolbar("Login ID") ;
        controlGroup.inputVal('beanFilterField', AccountCRUDTaskLoginId) ;
      },
      function() {
        var table = Site.Workspace.tableWithHeader("Login ID") ;
        var row   = table.tableRowWithText(AccountCRUDTaskLoginId) ;
        row.clickButton("Delete") ;
      },
    ]
  });
  
  var GoToAccountGroupsScreen = new test.UnitTask({
    name: "GoToAccountGroupsScreen",
    description: "Click on account and then Groups in the navigation",
    units: [
      function() { Site.Navigation.clickMenuItem("Account", "Groups") ; } ,
    ]
  });
  
  var CRUDTestAccountGroupTask = new test.UnitTask({
    name: "CRUDTestAccountGroupTask",
    description: "Create test group, edit test group, add membership, delete test group",
    units: [
      function() { Site.Workspace.toolbarWith('Root Group').clickButton("Add Child Group"); } ,
      function() {
        var form = Site.PopupPanel.formWithText("Path:") ;
        form.inputVal("name", "test");
        form.inputVal("description", "create a test group");
      },
      function() {
        Site.PopupPanel.formWithText("Path:").clickButton("Save");
      },
      //Edit test group
      function() { 
        Site.Workspace.clickButton("test"); 
      } ,
      function() { 
        Site.Workspace.toolbarWith('Root Group').clickButton("Edit Group"); 
      } ,
      function() {
        var form = Site.PopupPanel.formWithText("Path:") ;
        form.inputVal("description", "create a test group(update)");
      },
      function() {
        Site.PopupPanel.formWithText("Path:").clickButton("Save");
      }
      
      //Delete test group
      
      //Test membership.??
    ]
  });
  
  var account = {
    module: 'account',
    
    CleanDB: CleanDB,
    
    createScenario: function(name) {
      var Scenario = new test.UnitTask({
        name: "AccountScenario " + name,
        description: "Create a minimum set of data for the account module",
        units: [
          function() { 
            var jsonRes = 'scenario/' + name + '/account.json' ;
            var data = service.Server.syncGETResource(jsonRes, 'json') ;
            if(data != null) {
              service.AccountService.createScenario(data) ;
            }
          }
        ]
      }); 
      return Scenario ;
    },
    
    Service: {
      api: [ AccountApiCRUD, GroupApiCRUD ]
    },
    
    UI: {
      Account: test.Suite.extend({
        name: 'Account',
        description: "create/update/delete/find account" ,
        unitTasks: [ 
          GoToAccountAccountsScreen, AccountCRUDTask
        ],
      }), 
      
      Group: test.Suite.extend({
        name: 'Group',
        description: "create/update/delete/find account group" ,
        unitTasks: [ 
          GoToAccountGroupsScreen, CRUDTestAccountGroupTask
        ],
      }),
    }
  };
  
  return account ;
});
