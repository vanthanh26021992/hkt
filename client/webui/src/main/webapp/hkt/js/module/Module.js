define([
  'jquery',
  'underscore', 
  'backbone',
  'module/my/MyDashboard'
], function($, _, Backbone, MyDashboard) {
  /**
   *@type module.UIScreen
   */
  var UIScreen = Backbone.View.extend({
    el: $("#workspace"),
    
    /** @memberOf module.UIScreen */
    initialize: function (options) { 
      throw new Error("Need to override..........") ;
    },

    /** @memberOf module.UIScreen */
    activate: function() {
      throw new Error("Need to override..........") ;
    },
    
    /** @memberOf module.UIScreen */
    deactivate: function() {
      throw new Error("Need to override..........") ;
    }
  });

  /**
   *@type module.Screen 
   *@constructor
   */
  var Screen = function(moduleConfig, config) {
    this.config = config ;

    /** @memberOf module.Screen */
    this.render = function() {
      this.currentView.render() ;
    };
    
    /** @memberOf module.Screen */
    this.activate = function() { 
      this.View.activate() ;
    };
    
    /** @memberOf module.Screen */
    this.deactivate = function() {
      this.View.deactivate() ;
      $(this.View.el).unbind() ;
    };

    var screen = this ;
    require(['module/' + moduleConfig.name + '/' + config.name], function(View) { 
      screen.View = new View({config: config}) ;
    }) ;
  } ;

  /**
   *@type module.Module 
   */
  var Module = function(config) {
    this.screens = null ;
    
    /** @type module.Screen  */
    this.activeSubmodule = null ;
    this.config = config ;      

    /** @memberOf module.Module */
    this.activate = function(screenName) {
      var selScreen = this.getScreen(screenName) ;
      this.activeSubmodule = selScreen ;
      this.activeSubmodule.activate() ;
    } ;

    /** @memberOf module.Module */
    this.deactivate = function() {
      if(this.activeSubmodule != null) {
        this.activeSubmodule.deactivate() ;
      }
    };
    
    /**
     *@memberOf module.Module 
     *@return   module.Screen 
     **/
    this.getScreen = function(screenName) {
      for(var i = 0; i < this.screens.length; i++) {
        /** @type module.Screen */
        var selScreen = this.screens[i] ;
        if(screenName == selScreen.config.name) {
          return selScreen;
        }
      }
      return null ;
    } ;
    
    this.screens = [] ;
    for(var i = 0; i < config.screens.length; i++) {
      this.screens[i] = new Screen(config, config.screens[i]) ;
    } ;
  };
  
  /**@type module.ModuleManager*/
  var ModuleManager = function(config) {
    this.myDashboard = new MyDashboard() ;
    this.modules = [] ;
    
    /**
     * @memberOf module.ModuleManager
     */
    this.addModule = function(moduleConfig) {
      try {
        var module = new Module(moduleConfig) ;
        this.modules[i] = module ;
      } catch(ex) {
        console.log("Cannot load module " + moduleConfig.name) ;
        console.log(ex.stack) ;
      }
    };
    
    /**
     * @memberOf module.ModuleManager
     * @param name {string}
     * @return { module.Module } 
     */
    this.getModule = function(name) {
      for(var i = 0; i < this.modules.length; i++) {
        /**@type module.Module */
        var module = this.modules[i] ;
        if(module.config.name == name) return module ;
      }
      return null ;
    };
    
    /**@memberOf module.ModuleManager */
    this.getModules = function() { return this.modules ; };
    
    /**@memberOf view.WorkspaceView */
    this.activate = function(moduleName, screenName) {
      var selModule = this.getModule(moduleName) ;
      if(this.activeModule != null) {
        this.activeModule.deactivate() ;
      }
      this.activeModule = selModule ;
      this.activeModule.activate(screenName) ;
    };
    
    /**@memberOf view.WorkspaceView */
    this.activateMy = function() {
      if(this.activeModule != null) {
        this.activeModule.deactivate() ;
      }
      this.activeModule = this.myDashboard ;
      this.activeModule.activate() ;
    };
    
    var uiconfig = config.webuiConfig ;
    for(var i = 0; i < uiconfig.modules.length; i++) {
      var uiModuleConfig = uiconfig.modules[i]; 
      this.addModule(uiModuleConfig) ;
    };
  };
  
  var module = {
    Screen:        Screen,
    UIScreen:      UIScreen,
    Module:        Module,
    ModuleManager: ModuleManager 
  } ;
  return module ;
});
