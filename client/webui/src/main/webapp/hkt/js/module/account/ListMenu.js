define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!module/account/ListMenu.jtpl'
], function($, _, Backbone, ListMenu) {
	
  var ListMenu1 = Backbone.View.extend({
    el: $("#workspace"),

    initialize: function () {
      _.bindAll(this, 'render') ;
    },

    _template: _.template(ListMenu),
  
    render: function() {
      var params = { } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
    },
    
  
    activate: function() {
      this.render() ;
    },
    
   
    deactivate: function() {
    }
  });
  
  return ListMenu1 ;
});