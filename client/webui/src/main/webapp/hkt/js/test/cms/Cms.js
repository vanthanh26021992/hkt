define([
    'jquery', 'service/service', 'test/Test', 'test/Site', 'test/Assert',
], function($, service, test, Site, Assert, data) {

  var CleanDB = new test.UnitTask({
    name: "CleanCMSModule",
    description: "Drop all the data in the cms module",
    units: [
      function() { 
        service.CMSService.cleanData();
      }
    ]
  });

  var NodeCRUD = new test.UnitTask({
    name : "NodeCRUD",
    description : "Node CRUD",
    units : [
        function() {
          console.log("--- NodeCRUD: Start ---");
          var node = {
            name : "node name", path : "node/parent", mimeType : "Type"
          };
          node = service.CMSService.createNode(null, node, null).data;
          Assert.assertEquals("node name", node.name);
          service.CMSService.deleteNode(node);
          res = service.CMSService.getNodebyPath("node/parent");
          Assert.assertNull(res.data);
          console.log("--- NodeCRUD: Finish ---");
        },
    ]
  });

  var NodeApiCRUDTask = new test.UnitTask({
    name : "NodeApiCRUDTask",
    description : "test call create/get/update/delete an node",
    units : [
      function() {
        console.log("--- NodeApiCRUDTask: Start ---");
        
        var node = { name : "parent", mimeType : "sys", path : "parent" };
        node = service.CMSService.createNode(null, node, null).data;
        Assert.assertEquals("parent", node.name);
        
        var hktNode = { name : "hkt", path : "parent/hkt", mimeType : "sys/child" };
        hktNode = service.CMSService.createNode(node.path, hktNode, null).data;
        Assert.assertEquals("hkt", hktNode.name);
        Assert.assertEquals("parent/hkt", hktNode.path);
       
        service.CMSService.deleteNode(node);
        res = service.CMSService.getNodebyPath("parent");
        service.CMSService.deleteNode(node);
        res = service.CMSService.getNodebyPath("parent/hkt");
        Assert.assertNull(res.data);
        console.log("--- NodeApiCRUDTask: Finish ---");
      }
    ]
  });
  
  var GoToCMSExlorerScreen = new test.UnitTask({
    name: "GoToCMSExlorerScreen",
    description: "Click on cms",
    units: [
      function() { Site.Navigation.clickMenuItem("CMS ", "Explorer") ; } ,
    ]
  });
  
  var CRUDTestNodeTask = new test.UnitTask({
    name: "CRUDTestNodeTask",
    description: "Create test node, edit test node, delete test node",
    units: [
//    New
      function() {  Site.Workspace.toolbarWith('Root').clickButton("Add Node"); } ,
      function() {
        var form = Site.Workspace.formWithText("Path:") ;
        form.inputVal("name", "Test");
        form.inputVal("mimeType", "Mime type test");
      },
      function() {
        Site.Workspace.toolbarWith('Node').clickButton("Save");
      },
      function() { 
        Site.Workspace.clickButton("Test"); 
      } ,
      function() {  Site.Workspace.toolbarWith('Root').clickButton("Add Node"); } ,
      function() {
        var form = Site.Workspace.formWithText("Path:") ;
        form.inputVal("name", "Test 1");
        form.inputVal("mimeType", "Mime type test");
      },
      function() {
        Site.Workspace.toolbarWith('Node').clickButton("Save");
      },
//    Edit
      function() {  Site.Workspace.toolbarWith('Root').clickButton("Edit node"); } ,
      function() {
        var form = Site.Workspace.formWithText("Path:") ;
        form.inputVal("mimeType", "Mime type test edit");
      },
      function() {
        Site.Workspace.toolbarWith('Node').clickButton("Save");
      },
      function() {  Site.Workspace.toolbarWith('Root').clickButton("Edit node"); } ,
      function() {
        Site.Workspace.toolbarWith('Node').clickButton("Back");
      },
//    Delete
    ]
  });
  

  var cms = {
      module: 'cms',
      
      CleanDB: CleanDB,
      
      createScenario: function(name) {
        var Scenario = new test.UnitTask({
          name: "CMSScenario " + name,
          description: "Create a minimum set of data for the  module",
          units: [
            function() { 
              var availableTemplates = service.Server.syncGET("templates/config.json", {}) ;
              for(var i = 0; i < availableTemplates.length; i++) {
                var tmplDesc = availableTemplates[i] ;
                var template = service.Server.syncGET("templates/" + tmplDesc.path, {}) ;
                template.template = JSON.stringify(template.template) ;
                service.CMSService.addTemplate(template) ;
              }
              
              var jsonRes = 'scenario/' + name + '/cms.json' ;
              var data = service.Server.syncGETResource(jsonRes, 'json') ;
              if(data != null) {
                service.CMSService.createScenario(data) ;
              } else {
                console.log("No data for " + jsonRes) ;
              }
            }
          ]
        }); 
        return Scenario ;
      },
      
      Service: {
        api: [ NodeCRUD, NodeApiCRUDTask ]
      },
      
      UI: {
        Explorer: test.Suite.extend({
          name: 'Explorer',
          description: "create/update/delete/find node" ,
          unitTasks: [ 
            GoToCMSExlorerScreen,CRUDTestNodeTask
          ],
        }),
      }
    };
  return cms;

  return cms;
});
