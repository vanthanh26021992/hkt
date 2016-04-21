define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!module/setting/Interface.jtpl'
], function($, _, Backbone, InterfaceTemplate) {
  var Interface = Backbone.View.extend({
    el: $("#workspace"),

    initialize: function () {
      _.bindAll(this, 'render') ;
      this.render();
    },
    _template: _.template(InterfaceTemplate),
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
  
  return Interface ;
});