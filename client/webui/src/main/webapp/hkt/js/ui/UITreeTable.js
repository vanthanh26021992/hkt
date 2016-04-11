define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!ui/UITreeTable.jtpl',
  'css!ui/UITreeTable.css'
], function($, _, Backbone, UITreeTableTmpl) {
  var Node = function(id, bean, name, index, icon) {
    this.bean = bean;
    this.name = name;
    this.id   = id;
    this.index   = index;
    this.children = [] ; 
    this.collapsed = true;
    this.icon = icon;

    this.addChild = function(bean, name) {
      var childId = this.id + "_" + this.children.length;
      var child = new Node(childId, bean, name, this.index+1) ;
      this.children.push(child) ;
      return child;
    };
    this.addChild = function(bean, name, icon) {
        var childId = this.id + "_" + this.children.length;
        var child = new Node(childId, bean, name, this.index+1,icon) ;
        this.children.push(child) ;
        return child;
      };

    this.getChildren = function() { return this.children; };

    this.isCollapsed = function() { return this.collapsed; };

    this.setCollapsed = function(collapsed) { this.collapsed = collapsed; };

    this.toggleCollapsed = function() { 
    	this.collapsed = !this.collapsed; 
    	};

    this.findDescendant = function(id) {
      if(this.id == id) return this;
      for(var i = 0; i < this.children.length; i++) {
        var found = this.children[i].findDescendant(id);
        if(found != null) return found ;
      }
      return null ;
    };
  };
  /**
   *@type widget.UITreeTable 
   */
  var UITreeTable = Backbone.View.extend({

    initialize: function (options) {
     this.nodes = [] ;
      _.bindAll(this, 'render', 'onDfltToolbarAction', 'onObject') ;
    },
    
    getNodes: function() { return this.nodes ; },

    addNode: function(bean, name) {
      var id = "node_" + this.nodes.length;
      var node = new Node(id, bean, name, 0, "") ;
      this.nodes.push(node);
      return node ;
    },
    
    addNode: function(bean, name, icon) {
        var id = "node_" + this.nodes.length;
        var node = new Node(id, bean, name, 0, icon) ;
        this.nodes.push(node);
        return node ;
      },
    
    setBeans: function(beans) {
        var pageSize = beans.length ;
        for(var i = 0; i < beans.length; i++) {
          addNode(beans[i])
        }
      },

    _template: _.template(UITreeTableTmpl),
    
    render: function() {
      var params = { 
        config: this.config, 
        nodes: this.nodes,
        valueTime: this.valueTime,
      	nameObject: this.nameObject,
      	typeTime: this.typeTime,
      	isNew: this.isNew
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create");
    },
    
    events: {
      'click a.onCollapseExpand': 'onCollapseExpand',
      'click  a.onDfltToolbarAction': 'onDfltToolbarAction',
      'click  a.onObject': 'onObject',
    },
    
    onObject: function(evt){
    		this.renderObject();
    },
    
    onCollapseExpand: function(evt) {
      var nodeId = $(evt.target).attr('nodeId') ;
      var node = this._findNode(nodeId) ;
      this.addChild(node);
      node.toggleCollapsed() ;
      this.render() ;
    },
    
    onDfltToolbarAction: function(evt) {
        var actionIdx = parseInt($(evt.target).closest('a').attr('action')) ;
        var actions = this.config.toolbar.dflt.actions ;
        actions[actionIdx].onClick(this) ;
      },
    
    _findNode: function(nodeId) {
      for(var i = 0; i < this.nodes.length; i++) {
        var found = this.nodes[i].findDescendant(nodeId) ;
        if(found != null) return found ;
      }
      return null ;
    },
  });
  
  return UITreeTable ;
});
