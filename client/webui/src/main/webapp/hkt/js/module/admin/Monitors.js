define([
  'jquery', 
  'underscore', 
  'backbone',
  'ui/UIBreadcumbs',
  'module/Module',
  'module/admin/monitor/MonitorDashboard'
], function($, _, Backbone, UIBreadcumbs, module, MonitorDashBoard) {
  
  var UIMonitors = module.UIScreen.extend({
    initialize: function (options) {
    },
    
    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      var view = new MonitorDashBoard();
      view.init(this.viewStack) ;
      this.viewStack.push(view) ;
      console.log("Monitors activate") ;
    },
    
    deactivate: function() { }
    
  });
  
  return UIMonitors ;
});
