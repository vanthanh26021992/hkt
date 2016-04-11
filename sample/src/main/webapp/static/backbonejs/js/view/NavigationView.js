define([
  'jquery', 
  'underscore', 
  'backbone'
], function($, _, Backbone) {
  Navigation = Backbone.Model.extend({
  });

  NavigationView = Backbone.View.extend({
    el: $("#navspace"),
    model: new Navigation(),
    
    _template: _.template(
        "<ul>" +
        "  <li class='clickable onUpdateBanner'>Update Banner</li>" +
        "  <li class='clickable onAddPerson'>Add Person</li>" +
        "</ul>"
    ),
    
    events: {
      'click li.onUpdateBanner': 'onUpdateBanner',
      'click li.onAddPerson': 'onAddPerson'
    },
    
    onUpdateBanner : function() {
      app.view.BannerView.model.set({ banner: "Hello Banner At " + new Date() }) ;
    },
    
    onAddPerson : function() {
      app.view.WorkspaceView.persons.add([
        new Person({id: Math.floor(Math.random()* 1000), name: "Person From Navigation", time: 123588})
      ]) ;
      console.log("onAddPerson") ;
    },

    render: function() {
      var params = { } ;
      $(this.el).html(this._template(params));
    },
    
    initialize: function () {
      _.bindAll(this, 'render', 'onUpdateBanner') ;
      this.render() ;
    },
  });
  
  return NavigationView ;
}) ;