define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!module/my/MyDashboard.jtpl'
], function($, _, Backbone, MyDashboardTmpl) {
  /**@type module.my.MyDashBoard */
  var MyDashboard = Backbone.View.extend({
    el: $("#workspace"),

    initialize: function () {
      _.bindAll(this, 'render') ;
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