define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!ui/UIBreadcumbs.jtpl',
  'text!ui/UIBreadcumbsHide.jtpl'
], function($, _, Backbone, UIBreadcumbsTmpl, UIBreadcumbsTmplHide) {
  var UIBreadcumbs = Backbone.View.extend({
    
    initialize: function (options) {
      this.el = options.el ;
      if(options.hide!=null){
    	  this.hide = options.hide;
      }
     
      this.views = [] ;
      
      _.bindAll(this, 'render', 'onSelectView') ;
      this.renderTmpl() ;
    },
    
    _template: _.template(UIBreadcumbsTmpl),
    
    _templateHide: _.template(UIBreadcumbsTmplHide),
    
    renderTmpl: function() {
      var params = {} ;
      if(!this.hide){
    	  $(this.el).html(this._template(params));
          $(this.el).trigger("create") ;
      }else {
    	  $(this.el).html(this._templateHide(params));
          $(this.el).trigger("create") ;
	 }
      
    },
    
    render: function() {
      this.renderTmpl() ;
      var view = this.views.pop() ;
      if(view != null) view.render() ;
    },
    
    _buttonTmpl: _.template(
      "<a class='onSelectView ui-disabled' data-role='button' data-icon='<%=icon%>'><%=label%></a>"
    ),
    
    push: function(view) {
      this.views.push(view) ;
      var label = view.label ;
      if(label == null) label = "???" ;
      var breadcumbs = this.$('.Breadcumbs') ;
      var dataIcon = 'home' ;
      if(this.views.length > 1) dataIcon = 'back' ;
      breadcumbs.find("a").removeClass('ui-disabled');
      breadcumbs.
        find(".ui-controlgroup-controls").
        append(this._buttonTmpl({icon: dataIcon, label: label}));
      breadcumbs.trigger("create");
      breadcumbs.controlgroup({refresh: true, corners: false});
      this.$('.BreadcumbsView').unbind() ;
      view.setElement(this.$('.BreadcumbsView')).render();
    },
    
    pop: function() {
      var view = this.views.pop() ;
      var breadcumbs = this.$('.Breadcumbs') ;
      breadcumbs.find("a:last-child").remove();
      breadcumbs.controlgroup({refresh: true});
      return view ;
    },
    
    back: function() {
      this.pop() ;
      var view = this.views[this.views.length - 1] ;
      view.setElement(this.$('.BreadcumbsView')).render();
      
    },
    
    events: {
      'click a.onSelectView': 'onSelectView'
    },
    
    onSelectView: function(evt) {
      //console.log("Call on select view....") ;
      var label = $.trim($(evt.target).text()) ;
      var breadcumbs = this.$('.Breadcumbs') ;
      for(var i = this.views.length - 1; i >= 0; i--) {
        if(this.views[i].label == label) {
          breadcumbs.controlgroup({refresh: true});
          this.$('.BreadcumbsView').unbind() ;
          this.views[i].setElement(this.$('.BreadcumbsView')).render();
          return ;
        } else {
          var view = this.views.pop() ;
          //console.log('  remove ' + view.label) ;
          breadcumbs.find("a:last-child").remove();
        }
      }
    }
  });
  
  return UIBreadcumbs ;
});
