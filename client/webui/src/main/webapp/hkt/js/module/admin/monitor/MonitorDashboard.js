define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'module/admin/monitor/JVMMonitor',
  'module/admin/monitor/RestMonitor',
  'text!module/admin/monitor/MonitorDashboard.jtpl',
], function($, _, Backbone, service, JVMMonitor, RestMonitor, MonitorDashboardTmpl) {
  /**@type module.admin.monitor.MonitorDashBoard */
  var MonitorDashboard = Backbone.View.extend({
    label: 'Dashboard', 
    
    initialize: function () {
      _.bindAll(this, 'render', 'onShowServerCallMonitor') ;
    },

    _template: _.template(MonitorDashboardTmpl),
  
    render: function() {
      var params = { summaries: this.summaries} ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
    },
    
    events: {
      'click a.onShowServerCallMonitor': 'onShowServerCallMonitor'
    },
    
    /**@memberOf module.admin.monitor.MonitorDashBoard */
    onShowServerCallMonitor: function(evt) {
      var monitor = $(evt.target).closest('a').attr('monitor') ;
      console.log('monitor = ' + monitor) ;
      var monitorData =  service.ServerService.getMonitorData(monitor).data ;
      if('RestMonitor' == monitor) {
        var UIRestMonitor = new RestMonitor.UIRestMonitor() ;
        UIRestMonitor.init(this, monitorData) ;
        this.viewStack.push(UIRestMonitor) ;
        
      } else if('JVM Monitor' == monitor) {
        this.viewStack.push(new JVMMonitor().init(this.viewStack, monitorData)) ;
      }
    },
    
    init: function(viewStack) {
      this.viewStack = viewStack ;
      this.summaries = service.ServerService.getMonitorSummaries().data ;
      console.log(JSON.stringify(this.summaries)) ;
      return this ;
    },
    
    back: function () {
      this.viewStack.back() ;
    }
  });
  
  return MonitorDashboard ;
});