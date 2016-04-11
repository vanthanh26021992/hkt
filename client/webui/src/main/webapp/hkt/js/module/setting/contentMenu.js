define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!module/setting/contentMenu.jtpl'
], function($, _, Backbone, MyDashboardTmpl, i18n) {
  /**@type module.my.MyDashBoard */
  var MyDashboard = Backbone.View.extend({
    el: $("#workspace"),
    model: null,
    moduleManager: null ,

    initialize: function (options) {
      _.bindAll(this, 'render') ;
      this.moduleManager = options.moduleManager ;
    },

    _template: _.template(MyDashboardTmpl),
  
    render: function() {
    	var params = { } ;
        $(this.el).html(this._template(params));
        $(this.el).trigger("create") ;
    },
    
    /**@type module.my.MyDashBoard */
    activate: function() {
      this.render() ;
    },
    
    /**@type module.my.MyDashBoard */
    deactivate: function() {
    }
  });
  
  return MyDashboard ;
});