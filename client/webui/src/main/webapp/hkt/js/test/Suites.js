define([
  'jquery',
  'test/Test',
  'test/account/Account',
  'test/admin/Admin',
  'test/cms/Cms',
  'test/core/Core',
], function($, test, account,admin, cms, core) {
  
  /**@type test.Suites */
  var Suites = {
    modules: {
      account: account ,
      admin: admin,
      cms: cms,
      core: core,
    },
    
    cleanDB: function(config) {
      var unitTasks = [] ;
      for(var key in this.modules) {
        unitTasks.push(this.modules[key].CleanDB) ;
      }
      var CleanDBSuite = test.Suite.extend({
        name: 'CleanDBSuites',
        description: "CleanDB For All Modules" ,
        unitTasks: unitTasks
      });
      new CleanDBSuite().execute(config) ;
    },
    
    getScenarioSuite: function(scenario) {
      var unitTasks = [] ;
      for(var key in this.modules) {
        unitTasks.push(this.modules[key].createScenario(scenario)) ;
      }
      
      var ScenarioSuite = test.Suite.extend({
        name: 'Scenario ' + scenario,
        description: "Populate " + scenario + " data!!!" ,
        unitTasks: unitTasks
      });
      return new ScenarioSuite() ;
    },
    
    getServiceAPISuite: function(module) {
      var unitTasks = [] ;
      for(var i = 0; i < this.modules[module].Service.api.length; i++) {
        unitTasks.push(this.modules[module].Service.api[i]) ;
      }
      var Suite = test.Suite.extend({
        name: 'Service API ' + module,
        description: "Run API test for " + module + "!!!" ,
        unitTasks: unitTasks
      });
      return new Suite() ;
    },
    
    getUISuite: function(moduleName, suiteName) {
      var module = this.modules[moduleName] ;
      if(suiteName == undefined || suiteName == 'all') {
        var unitTasks = [] ;
        for(var key in module.UI) {
          var SubSuite = module.UI[key] ;
          var subSuite = new SubSuite() ;
          for(var i = 0; i < subSuite.unitTasks.length; i++) {
            unitTasks.push(subSuite.unitTasks[i]) ;
          }
        }
        var Suite = test.Suite.extend({
          name:  moduleName + ' > All',
          description: "Run UI test for " + moduleName + "!!!" ,
          unitTasks: unitTasks
        });
        return new Suite() ;
      } else {
        var Suite = this.modules[moduleName].UI[suiteName] ;
        var suiteInstance = new Suite() ;
        suiteInstance.name = moduleName + '> ' + suiteName ;
        return suiteInstance ;
      }
    },
    
    /**@memberOf test.Suites */
    animateAll: function(timeout) {
      if(timeout == undefined) timeout = 1000 ;
      var suiteToRun = [] ;
      for(var key in this.modules) {
        var uiSuite = this.getUISuite(key, 'all') ;
        suiteToRun.push(uiSuite) ;
      }
      
      var instance = this ;
      var currentIdx = 0 ;
      var doExecute = function() {
        if(currentIdx == suiteToRun.length) return ;
        
        var uiSuite = suiteToRun[currentIdx] ;
        if(uiSuite.status == null) {
          instance.cleanDB() ;
          instance.getScenarioSuite('default').execute();
          console.log("animate " + uiSuite.name) ;
          uiSuite.animate(timeout) ;
        } else if(uiSuite.status == 'FINISH') {
          currentIdx++ ;
          doExecute() ;
          return ;
        }
        setTimeout(doExecute, timeout);
      };
      doExecute() ;
    }
  };
  return Suites ;
});
