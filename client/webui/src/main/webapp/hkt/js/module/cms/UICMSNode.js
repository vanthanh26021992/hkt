define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'ui/Validator',
  'text!module/cms/UICMSNode.jtpl',
  'css!module/cms/UICMSNode.css'
], function($, _, Backbone, service, Validator, UINodeTmpl) {
  /**
   *@type module.cms.UICMSNode 
   */
  var UICMSNode = Backbone.View.extend({
    label: "UICMSNode",
    
    initialize: function (options) {
      var template = service.CMSService.getTemplate(options.mimeType).data ;
      var templateUI = JSON.parse(template.template) ;
      this.config = options ; 
      this.config.tabs = templateUI.tabs ;
      this.bind(this.config.nodeDetail) ;
      _.bindAll(this, 'render', 'onSelectTab', 'onToggleMode', 'onToggleSection', 
                'onBack', 'onSave') ;
    },
    
    /**@memberOf module.cms.UICMSNode */
    bind: function(nodeDetail) {
      var firstTabConfig = this.config.tabs[0] ;
      this.nodeState = { node: nodeDetail, state: { tabs: {} } } ;
      this.nodeState.state.tabs[firstTabConfig.name] = {
        select: true 
      };
    },
    
    _template: _.template(UINodeTmpl),
    
    render: function() {
      var params = {
        config: this.config,
        nodeState: this.nodeState
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create");
    },
    
    events: {
      'click a.onSelectTab': 'onSelectTab',
      'click a.onToggleMode': 'onToggleMode',
      
      'click a.onToggleSection': 'onToggleSection',
      'click a.onBack': 'onBack',
      'click a.onSave': 'onSave'
    },
    
    onSelectTab: function(evt) {
      var tabName = $(evt.target).closest('a').attr('tab') ;
      var tabStates = this.nodeState.state.tabs ;
      for(var i = 0; i < this.config.tabs.length; i++) {
        var tab = this.config.tabs[i] ;
        if(tabName == tab.name) {
          if(tabStates[tabName] == null) tabStates[tabName] = {} ;
          tabStates[tabName].select = true ;
        } else {
          if(tabStates[tab.name] != null) tabStates[tab.name].select = false ;
        }
      }
      this.render() ;
    },
    
    onToggleMode: function(evt) {
      if(this.nodeState.state.edit) {
        this.nodeState.state.edit = false ;
      } else {
        this.nodeState.state.edit = true ;
      }
      this.render() ;
    },
    
    onToggleSection: function(evt) {
      var tabName = $(evt.target).closest(".UICMSNodeTabBody").attr("tab") ;
      var sectionName = $(evt.target).closest(".UICMSNodeSection").attr("section") ;
      var tabState = this.nodeState.state.tabs[tabName];
      if(tabState.sections == null) tabState.sections = {} ;
      if(tabState.sections[sectionName] == null) tabState.sections[sectionName] = {} ; 
      tabState.sections[sectionName].collapsed = !tabState.sections[sectionName].collapsed ;
      this.render() ;
    },
    
    onBack: function(evt) {
      this.config.back() ;
    },
    
    onSave: function(evt) {
      console.log('onSave....................') ;
    }
    
  });
  
  return UICMSNode ;
});