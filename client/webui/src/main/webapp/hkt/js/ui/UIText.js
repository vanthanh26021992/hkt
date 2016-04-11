define([
  'jquery', 
  'underscore', 
  'backbone'
], function($, _, Backbone) {
  /**
   *@type widget.UIText 
   */
  var UIText = Backbone.View.extend({

    initialize: function (options) {
      _.bindAll(this, 'render') ;
    },
    
    setText: function(text) { this.text = text ; },
    
    _template: _.template('<pre><%=text%></pre>'),
    
    render: function() {
      var params = { text: this.text } ;
      $(this.el).html(this._template(params));
    },
    
    events: {
      'click a.onAction': 'onAction'
    },
    
    onAction: function(evt) {
    }
  });
  
  return UIText ;
});