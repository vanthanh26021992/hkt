define([
  'ui/UIBean',
  'ui/UITable',
  'ui/UICollapsible',
], function(UIBean, UITable, UICollapsible) {
  
  var UICallMonitor = UIBean.extend({
    label: 'Module Info',
    config: {
      beans : {
        moduleInfo : {
          label: 'Module Info',
          fields: [
            { label: "Module", field: "module" },
            { label: "Request", field: "requestCount" },
            { label: "Error", field: "errorCount" },
            { label: "Avg Exec Time", field: "avgExecTime" },
            { label: "Avg Exec Time", field: "maxExecTime" },
          ],
        }
      }
    },
    initViewOnly: function (moduleMonitor) {
      this.bind('moduleInfo', moduleMonitor) ;
      this.getBeanState('moduleInfo').readOnly = true ;
      return this ;
    }
  });
  
  var UICallMethodList = UITable.extend({
    label: 'Methods Info',
    config: {
      toolbar: {
        dflt: {
          actions: []
        }
      },
      bean: {
        fields: [
          { label : 'Method', field : 'method', toggled : true, filterable : true },
          { label : 'Request', field : 'requestCount', toggled : true },
          { label : 'Error', field : 'errorCount', toggled : true },
          { label : 'Avg Exec Time(ms)', field : 'avgExecTime', toggled : true },
          { label : 'Max Exec Time(ms)', field : 'maxExecTime', toggled : true }
        ],
      }
    },
    
    init: function (calls) {
      this.setBeans(calls) ;
      return this ;
    }
  });
  
  var UICallMonitorDetail = UICollapsible.extend({
    label: "Call Monitor", 
    config: {
      actions: [
        {
          action: 'back', label: 'Back',
          onClick: function (thisUI) {
            if (thisUI.UIParent.back) {
              thisUI.UIParent.back() ;
            }
          }
        },
      ]
    },
    
    init: function(UIParent, moduleMonitor) {
      this.clear() ;
      this.UIParent = UIParent ;
      this.add(new UICallMonitor().initViewOnly(moduleMonitor)) ;
      this.add(new UICallMethodList().init(moduleMonitor.calls)) ;
    }
  });
  
  var UIRestModuleMonitor = UIBean.extend({
    label: 'Rest API Monitor',
    config: {
      beans : {
        monitorData : {
          label: 'Rest API Monitor',
          fields: [
            { label: "Total Call", field: "totalCall" },
            { label: "Total Error", field: "totalError" },
            { label: "Avg Exec Time", field: "avgExecTime" },
            { label: "Avg Exec Time", field: "maxExecTime" },
          ],
        }
      }
    },
    initViewOnly: function (monitorData) {
      this.bind('monitorData', monitorData) ;
      this.getBeanState('monitorData').readOnly = true ;
      return this ;
    }
  });
  
  var UIRestModuleMonitorList = UITable.extend({
    label: 'Rest Module Monitor',
    config: {
      toolbar: {
        dflt: {
          actions: []
        }
      },
      bean: {
        fields: [
          { label : 'Module', field : 'module', toggled : true, filterable : true },
          { label : 'Request', field : 'requestCount', toggled : true },
          { label : 'Error', field : 'errorCount', toggled : true },
          { label : 'Avg Exec Time', field : 'avgExecTime', toggled : true },
          { label : 'Max Exec Time', field : 'maxExecTime', toggled : true },
        ],
        actions: [
          {
            icon: "grid", label: "Method Calls",
            onClick: function(thisUI, row) {
              var moduleMonitor = thisUI.getItemOnCurrentPage(row) ;
              thisUI.UICallMonitorDetail.init(thisUI, moduleMonitor) ;
              thisUI.viewStack.push(thisUI.UICallMonitorDetail) ;
            }
          }
        ]
      }
    },
    
    back: function () {
      this.viewStack.back() ;
    },
    
    init: function (UIParent, modules) {
      this.UICallMonitorDetail = new UICallMonitorDetail() ;
      this.UIParent = UIParent ;
      this.viewStack = UIParent.viewStack ;
      this.setBeans(modules) ;
      return this ;
    }
  });
  
  var UIRestMonitor = UICollapsible.extend({
    label: "Rest Monitor",
    config: {
      actions: [
        {
          action: 'back', label: 'Back',
          onClick: function (thisUI) {
            thisUI.UIParent.back() ;
          }
        },
      ]
    },
    
    init: function (UIParent, monitorData) {
      this.clear() ;
      this.UIParent = UIParent ;
      this.add(new UIRestModuleMonitor().initViewOnly(monitorData)) ;
      this.add(new UIRestModuleMonitorList().init(UIParent, monitorData.modules)) ;
    }
  });
  
  var RestMonitor = {
    UIRestMonitor : UIRestMonitor
  };
  return RestMonitor ;
});
