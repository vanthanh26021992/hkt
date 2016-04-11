define([
  'ui/UITable',
  'ui/UIBean',
  'ui/UICollapsible',
  'ui/UIText',
], function(UITable, UIBean, UICollapsible, UIText) {
  
  var UIMemoryMonitor = UIBean.extend({
    label: 'Memory Info',
    config: {
      beans : {
        memory : {
          label: 'Memory Info',
          fields: [
            { label : 'Init', field: 'init' },
            { label : 'Committed', field: 'committed' },
            { label : 'Max', field: 'max' },
            { label : 'Use', field: 'use' },
          ],
          edit: {
            disable: true,
            actions: [
              {
                action:'more', label: "More", icon: "grid",
                onClick: function(thisInfo) {
                  var memDetail = new UIMemoryMonitorDetail() ;
                  memDetail.init(thisInfo, thisInfo.jvmInfo) ;
                  thisInfo.viewStack.push(memDetail) ;
                }
              }
            ]
          }
        }
      }
    },
    
    init: function (viewStack, jvmInfo) {
      this.viewStack = viewStack ;
      this.jvmInfo = jvmInfo ;
      this.bind('memory', jvmInfo.memoryInfo) ;
      
      var memoryConfig = this.getBeanConfig('memory') ;
      memoryConfig.disableEditAction(false) ;
      this.getBeanState('memory').editMode = true ;
      
      return this ;
    },
    
    initViewOnly: function (memoryInfo) {
      this.bind('memory', memoryInfo) ;
      this.getBeanState('memory').readOnly = true ;
      return this ;
    },
    
    back: function(){
      this.viewStack.back() ;
    }
  });
  
  var UIMemoryMonitorList = UITable.extend({
    label: 'Memory Detail',
    config: {
      toolbar: {
        dflt: {
          actions: []
        }
      },
      bean: {
        fields: [
          { label : 'Name', field : 'name', toggled : true, filterable : true},
          { label : 'Pool Names', field : 'poolNames', toggled : true, filterable : true},
          { label : 'Collection Count', field : 'collectionCount', toggled : true, filterable : true},
          { label : 'Collection Time', field : 'collectionTime', toggled : true, filterable : true}
        ],
        actions: []
      }
    },
    
    init: function (garbageCollectorInfo) {
      this.setBeans(garbageCollectorInfo) ;
      return this ;
    }
  });
  
  var UIMemoryMonitorDetail = UICollapsible.extend({
    label: "Memory", 
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
    
    init: function(UIParent, jvmInfo) {
      this.UIParent = UIParent ;
      this.clear() ;
      this.add(new UIMemoryMonitor().initViewOnly(jvmInfo.memoryInfo)) ;
      this.add(new UIMemoryMonitorList().init(jvmInfo.garbageCollectorInfo)) ;
    }
  });
  
  var UIThreadMonitor = UIBean.extend({
    label: 'Thread Info',
    config: {
      beans : {
        threadInfo : {
          label: 'Thread Info',
          fields: [
            { label : 'Thread Started Count', field: 'threadStartedCount'},
            { label : 'Thread Peak Count', field: 'threadPeakCount'},
            { label : 'Thread Count', field: 'threadCount'},
            { label : 'Thread Deamon Count', field: 'threadDeamonCount'}
          ],
          edit: {
            disable: true ,
            actions: [
              {
                action:'more', label: "More", icon: "grid",
                onClick: function(thisInfo) {
                  var threadDetail = new UIThreadMonitorDetail() ;
                  threadDetail.init(thisInfo, thisInfo.jvmInfo) ;
                  thisInfo.viewStack.push(threadDetail) ;
                }
              }
            ]
          }
        }
      }
    },
    
    init: function (viewStack, jvmInfo) {
      this.viewStack = viewStack ;
      this.jvmInfo = jvmInfo ;
      this.bind('threadInfo', jvmInfo.threadInfo) ;
      
      var threadConfig = this.getBeanConfig('threadInfo') ;
      threadConfig.disableEditAction(false) ;
      this.getBeanState('threadInfo').editMode = true ;
      
      return this ;
    },
    
    initViewOnly: function (threadInfo) {
      this.bind('threadInfo', threadInfo) ;
      this.getBeanState('threadInfo').readOnly = true ;
      return this ;
    },
    
    back: function(){
      this.viewStack.back() ;
    }
    
  });
  
  var UIThreadMonitorList = UITable.extend({
    label: 'Threads',
    config: {
      toolbar: {
        dflt: {
          actions: []
        }
      },
      bean: {
        fields: [
          { label : 'Id', field : 'threadId', toggled : true, filterable : true },
          { label : 'Name', field : 'threadName', toggled : true, filterable : true },
          { label : 'Thread Block Count', field : 'threadBlockCount', toggled : true, filterable : true },
          { label : 'Thread Block Time', field : 'threadBlockTime', toggled : true, filterable : true },
          { label : 'Thread Waited Count', field : 'threadWaitedTime', toggled : true, filterable : true },
          { label : 'Thread State', field : 'threadState', toggled : true, filterable : true },
          { label : 'Thread CPU Time', field : 'threadCPUTime', toggled : true, filterable : true },
          { label : 'Thread User Time', field : 'threadUserTime', toggled : true, filterable : true },
        ],
        actions: [
          {
            icon: "grid", label: "Stacktrace",
            onClick: function(thisUI, row) {
              var thread = thisUI.getItemOnCurrentPage(row) ;
              var uiText = new UIText() ;
              uiText.label = 'Thread Stacktrace' ;
              uiText.setText(thread.threadStackTrace) ;
              thisUI.viewStack.push(uiText) ;
            }
          }
        ]
      }
    },
    
    init: function (viewStack, threadInfos) {
      this.viewStack = viewStack ;
      this.setBeans(threadInfos) ;
      return this ;
    }
  });
  
  var UIThreadMonitorDetail = UICollapsible.extend({
    label: "Threads Detail", 
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
    
    init: function(UIParent, jvmInfo) {
      this.UIParent = UIParent ;
      this.clear() ;
      this.add(new UIThreadMonitor().initViewOnly(jvmInfo.threadInfo)) ;
      this.add(new UIThreadMonitorList().init(UIParent.viewStack, jvmInfo.threadInfo.threadInfos)) ;
    }
  });
  
  var JVMInfo = UICollapsible.extend({
    label: "JVM Monitor",
    config: {
      actions: [
        {
          action: 'back', label: 'Back',
          onClick: function (thisUI) {
            if (thisUI.back) {
              thisUI.back() ;
            }
          }
        },
      ]
    },
    
    init: function(viewStack, jvmInfo) {
      this.viewStack = viewStack ;
      this.jvmInfo = jvmInfo ;
      this.add( new UIMemoryMonitor().init(viewStack, jvmInfo)) ;
      this.add( new UIThreadMonitor().init(viewStack, jvmInfo)) ;
      return this ;
    },
    
    back: function () {
      this.viewStack.back() ;
    }
  });
  
  return JVMInfo;
});
