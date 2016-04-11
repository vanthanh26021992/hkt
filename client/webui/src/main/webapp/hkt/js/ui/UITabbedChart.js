define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!ui/UITabbedChart.jtpl'
], function($, _, Backbone, UITabbedPaneTmpl) {
  /**@type ui.UITabbedPane */
  var UITabbedPane = Backbone.View.extend({

    initialize: function () {
    	this.tableId = this.randomId() ;
      _.bindAll(this, 'render', 'onSelectTab','onDfltToolbarAction') ;
        
    },

    setSelectedTab: function(name, uicomponent) {
      this.toolbarConfig=uicomponent.config.toolbar.dflt;
      var tabConfig = this._getTabConfig(name) ;
      this.state = {
        tabConfig: tabConfig,
        uicomponent: uicomponent
      },
      this.UIContainer = uicomponent;
    },
    randomId: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ ) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      },
    
    _template: _.template(UITabbedPaneTmpl),
    
    render: function(dataView) {
      if(dataView==null){
    	  dataView = [];
      }
      if(this.state == null) {
        var tabConfig = this.config.tabs[0] ;
        tabConfig.onSelect(this, tabConfig) ;
      }
      var params = { 
        config: this.config,
        dataView: dataView,
        state: this.state,
        tableId: this.tableId,
        toolbarConfig: this.toolbarConfig,
        valueTime: this.valueTime,
      	nameObject: this.nameObject,
      	typeTime: this.typeTime
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      var chartSection  = $(this.el).find('.ChartSection') ;
      chartSection.css('display', 'block') ;
      if(this.UIContainer!=null){
    	  this.UIContainer.setElement(this.$('.UIContainer')).render();
      }
    },
    
    events: {
      'click a.onSelectTab': 'onSelectTab','click  a.onDfltToolbarAction': 'onDfltToolbarAction'
    },
    
    elv: function() {
		return $(this.el).find('.UIContainer') ;
	},
    
    onSelectTab: function(evt) {
      var tabName = $(evt.target).closest("a").attr('tab') ;
      var tabConfig = this._getTabConfig(tabName) ;
      tabConfig.onSelect(this, tabConfig) ;
      this.render() ;
    },
    
    onDfltToolbarAction: function(evt) {
        var actionIdx = parseInt($(evt.target).closest('a').attr('action')) ;
        var actions = this.toolbarConfig.actions ;
        actions[actionIdx].onClick(this) ;
      },
    
    _getTabConfig: function(name) {
      for(var i = 0; i < this.config.tabs.length; i++) {
        var tab = this.config.tabs[i] ;
        if(name == tab.name) return tab ;
      }
      return null ;
    }
  });
  
  return UITabbedPane ;
});