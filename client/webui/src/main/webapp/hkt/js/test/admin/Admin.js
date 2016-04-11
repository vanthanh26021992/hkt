define([
  'jquery',
  'service/service',
  'test/Test',
  'test/Site',
  'test/Assert'
], function($, service, test, Site, Assert) {
  
  var CleanDB = new test.UnitTask({
    name: "CleanDB Monitors",
    description: "CleanDB Monitors",
    units: [
      function() { }
    ]
  }); 
  
  var GotoMonitorsScreen = new test.UnitTask({
    name: "GotoMonitorsScreen",
    description: "Go to Monitors Screen",
    units: [
      function() { Site.Navigation.clickMenuItem("Admin", "Monitors") ; }
    ]
  });
  
  var GotoJVMMonitorScreen = new test.UnitTask({
    name: "GotoJVMMonitorScreen",
    description: "Go to JVMMonitor Screen",
    units: [
      function() { Site.Workspace.toolbarWith("Dashboard").clickButton("More JVM Monitor") ; },
      function() {
        Site.Workspace.collapsibleBlock("Memory Info").clickButton("More") ;
      },
      function() {
        Site.Workspace.toolbarWith("Memory").clickButton("Back") ;
      },
      function() {
        Site.Workspace.collapsibleBlock("Thread Info").clickButton("More") ;
      },
      function() { Site.Workspace.toolbarWith("Dashboard").clickButton("Back") ; },
      function() { Site.Workspace.toolbarWith("Dashboard").clickButton("Dashboard") ; },
    ]
  });
  
  var GotoRestMonitorScreen = new test.UnitTask({
    name: "GotoRestMonitorScreen",
    description: "Go to Rest Monitor Screen",
    units: [
      function() { Site.Workspace.toolbarWith("Dashboard").clickButton("More RestMonitor") ; },
      function() {
        var table = Site.Workspace.tableWithHeader("Module") ;
        var row   = table.tableRowWithText("hr") ;
        row.clickButton("Method Calls") ;
      },
      function() {
        Site.Workspace.toolbarWith("Call Monitor").clickButton("Back") ;
      },
      function() { Site.Workspace.toolbarWith("Dashboard").clickButton("Dashboard") ; },
    ]
  });
  
  var admin = {
    module: 'admin',
    
    CleanDB: CleanDB,
    
    createScenario: function(name) {
      var Scenario = new test.UnitTask({
        name: "AdminScenario " + name,
        description: "Create Scenario",
        units: [
          function() { }
        ]
      }); 
      return Scenario ;
    },
    
    Service: {
      api: [ ]
    },
    
    UI: {
      Monitors: test.Suite.extend({
        name: 'Monitors',
        description: "Monitors Information" ,
        unitTasks: [ 
          GotoMonitorsScreen, GotoJVMMonitorScreen, GotoRestMonitorScreen
        ],
      }),
    }
  };
  return admin ;
});
