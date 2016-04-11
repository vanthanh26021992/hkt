define([
  'jquery',
  'Class',
  'i18n',
  'service/service',
  'ui/UIPopup',
  'view/BannerView',
  'view/NavigationView',
  'view/WorkspaceView',
  'module/Module',
  'ui/UIPopup',
], function($, Class, i18n, service,UIPopup, BannerView, NavigationView, WorkspaceView, module,UIPopup) {
  console.h1 = function(msg) {
    console.log(msg) ;
    console.log('============================================================') ;
  };
  
  console.h2 = function(msg) {
    console.log(msg) ;
    console.log('------------------------------------------------------------') ;
  };
  
  console.cells = function(cells, width) {
    var row = '' ;
    for(var i = 0; i < cells.length; i++) {
      row += console.fillCellWidth(cells[i], width[i]) ;
    }
    console.log(row) ;
  };
  
  console.fillCellWidth = function(msg, width) {
    if(msg.length > width) return msg.substring(0,width - 3) + '...' ;
    for(var i = msg.length; i < width; i++) {
      msg += ' ' ;
    }
    return msg ;
  };
  
  var appConfig = service.Server.syncGETResource("../do/getClientContext", "json") ;
  if(appConfig == null) {
    window.location = ROOT_CONTEXT + "/login.html" ;
    return ;
  }
  i18n.selectLanguage = appConfig.webuiConfig.language ;
  
//  var testModule = {
//		    "name": "test",
//		    "permission": null,
//
//		    "screens": [
//		      {
//		        "name": "TreeTable",
//		        "label": null,
//		        "permission": null
//		      },
//		    ]
//		  };
//
//		  
//		  appConfig.webuiConfig.modules.push(testModule);
  
  var app = {
    initialize: function() {
      this.moduleManager = new module.ModuleManager(appConfig) ;
      
      this.config =  appConfig ;
      this.view = {
        BannerView:      new BannerView(),
        WorkspaceView:   new WorkspaceView({moduleManager: this.moduleManager}),
        NavigationView:  new NavigationView({moduleManager: this.moduleManager})
      };
      this.render() ;
    },

    render: function() {
      UIPopup.accountConfig=appConfig.account;
      this.view.BannerView.render() ;
      this.view.NavigationView.render() ;
      this.view.WorkspaceView.render() ;
    },
    
    reload: function() {
      window.location = ROOT_CONTEXT + "/index.html" ;
    }
  } ;
  
  return app ;
});
