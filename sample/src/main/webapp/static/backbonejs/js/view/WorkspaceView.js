define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!view/WorkspaceTemplate.jtpl'
], function($, _, Backbone, WorkspaceTemplate) {
  Person = Backbone.Model.extend({
    id:   null,
    name: null,
    time: null
  });

  Persons = Backbone.Collection.extend({
    model: Person,
    
    initialize: function(options) {
      this.bind("add", options.view.render);
    }
  });

  WorkspaceView = Backbone.View.extend({
    el: $("#workspace"),

    initialize: function () {
      _.bindAll(this, 'render') ;
      this.persons = new Persons({ view: this });
      this.persons.add([
         new Person({id: 1, name: "Person 1", time: 1234}),
         new Person({id: 2, name: "Person 2", time: 1234}),
         new Person({id: 3, name: "Person 3", time: 1234}),
       ]) ;
    },

    _template: _.template(WorkspaceTemplate),
      
    render: function() {
      var params = { persons: this.persons} ;
      var compiledTmpl = _.template(WorkspaceTemplate) ;
      $(this.el).html(this._template(params));
    }
  });
  
  return WorkspaceView ;
});