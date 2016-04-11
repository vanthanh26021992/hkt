define([
  'jquery',
  'service/service',
  'test/Test',
  'test/Site',
  'test/Assert'
], function($, service, test, Site, Assert) {

  var CleanDB = new test.UnitTask({
    name: "CleanCoreModule",
    description: "Drop all the data in the account module",
    units: [
      function() { 
      }
    ]
  }); 
  
  var ApiCRUD = new test.UnitTask({
    name: "ApiApiCRUD",
    description: "create/get/update/delete an account",
    units: [
      function() { 
        var restMonitor = service.ServerService.getRestMonitor() ;
        Assert.assertNotNull(restMonitor) ;
      }
    ]
  });
  
  var core = {
    module: 'core',
    
    CleanDB: CleanDB,
    
    createScenario: function(name) {
      var Scenario = new test.UnitTask({
        name: "CoreScenario " + name,
        description: "Create a minimum set of data for the  module",
        units: [
          function() { }
        ]
      }); 
      return Scenario ;
    },
    
    Service: {
      api: [ ApiCRUD ]
    },
    
    UI: {
      RestMonitor: test.Suite.extend({
        name: 'RestMonitor',
        description: "check the rest monitor information" ,
        unitTasks: [ 
        ],
      })
    }
  };
  
  return core ;
});
