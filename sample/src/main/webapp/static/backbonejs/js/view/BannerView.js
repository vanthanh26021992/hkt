define([
  'jquery', 
  'underscore', 
  'backbone',
], function($, _, Backbone) {
  var Banner = Backbone.Model.extend({
    initialize: function (options) {
      this.view = options.view ;
      this.bind("change", function() { this.view.render() ;} );
    }
  });

  var BannerView = Backbone.View.extend({
    el: $("#banner"),

    _template: _.template(
      "<%=banner%>"
    ),
    
    render: function() {
      var params = { banner: this.model.get("banner") } ;
      $(this.el).html(this._template(params));
    },
    
    initialize: function () {
      this.model = new Banner({view: this, banner: "Hello Banner"}) ;
      this.render() ;
    },
  });
  return BannerView ;
});

