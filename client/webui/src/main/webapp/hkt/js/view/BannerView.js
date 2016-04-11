define([
  'jquery',
  'underscore', 
  'backbone',
  'i18n',
  'service/service',
  'text!view/BannerView.jtpl'
], function($, _, Backbone, i18n, service, BannerViewTmpl) {
  var Banner = Backbone.Model.extend({
    initialize: function (options) {
      this.view = options.view ;
      this.bind("change", function() { this.view.render() ;} );
    }
  });

  var BannerView = Backbone.View.extend({
    el: $("#BannerView"),
    
    initialize: function () {
      this.model = new Banner({view: this}) ;
      _.bindAll(this, 'render', 'onSelectLanguage') ;
    },
    
    _template: _.template(BannerViewTmpl),
    
    render: function() {
      var params = { 
        languages: i18n.availableLanguages,
        selectLanguage: i18n.selectLanguage
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
    },
    
    events: {
      'change select.onSelectLanguage': 'onSelectLanguage'
    },
    
    onSelectLanguage: function(evt) {
      var language = $(evt.target, ".onSelectLanguage").find(":selected").attr("value") ;
      var params = {
        name: 'language', value: language
      };
      service.Server.syncGET("../../do/updateClientContext", params);
      app.reload() ;
    }
  });
  
  return BannerView ;
});