define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'ui/UIPopup',
], function($, _, Backbone,service,UIPopup) {

  /**@type view.WorkspaceView */
  WorkspaceView = Backbone.View.extend({
    el: $("#workspace"),
    /**@type module.ModuleManager */
    moduleManager: null ,
    /**@type module.Module */
    activeModule: null, 
  
    initialize: function (options) {
      this.moduleManager = options.moduleManager;
      _.bindAll(this, 'render') ;
      this.render() ;
    },

    render: function() {
      if(this.activeModule != null) {
        this.activeModule.render() ;
      }
    },
    
    /**@memberOf view.WorkspaceView */
    
    activateMenu: function(moduleId) {
        var array = moduleId.split('/') ;
        var moduleName = array[0] ;
        var submoduleName = array[1] ;
        if(UIPopup.getPermission(submoduleName,"read")){
      	  this.moduleManager.activate(moduleName, submoduleName) ;
        }
       
      },
    
    activateModule: function(moduleId) {
      var array = moduleId.split('/') ;
      var moduleName = array[0] ;
      var submoduleName = array[1] ;
      if(UIPopup.getPermission(submoduleName,"read")){
    	  this.moduleManager.activate(moduleName, submoduleName) ;
      }
     
    },
    
    /**@memberOf view.WorkspaceView */
    activateMy: function() {
      this.moduleManager.activateMy() ;
    }
  });
  
  return WorkspaceView ;
});
