define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'module/Module',
  'ui/UIBreadcumbs',
  'module/cms/NodeAttributes',
  'module/cms/Node',
  'text!module/cms/Explorer.jtpl'
], function($, _, Backbone, service, module, UIBreadcumbs, NodeAttributes, Node, ExplorerTmpl) {
  /**@type module.cms.ExplorerView */
  var Explorer = Backbone.View.extend({
    label: "Nodes",
    
    /**@type service.CMSService */
    CMSService: service.CMSService,
    
    initialize: function (config) {
      _.bindAll(this, 'render', 'onNewNode') ;
      if(this.currentNodeDetail == null) {
        this.currentNodeDetail = this.CMSService.getNodeDetail(null).data ;
      } 
      this.NodeAttributes = new NodeAttributes() ;
      this.NodeAttributes.init(this.currentNodeDetail);
    },

    _template: _.template(ExplorerTmpl),
    
    render: function() {
      var params = {
        node : this.currentNodeDetail.node,
        attributes: this.currentNodeDetail.attributes,
        children: this.currentNodeDetail.children
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      this.NodeAttributes.setElement(this.$('.NodeAttributes')).render();
    },
    
    events: {
      'click a.onNewNode': 'onNewNode',
      'click a.onEditNode': 'onEditNode',
      'click a.onSelectNode': 'onSelectNode'
    },
      
    /**@memberOf module.cms.ExplorerView */
    onNewNode: function(evt) {
      var parentPath = null ;
      if(this.currentNodeDetail != null && this.currentNodeDetail.node != null) {
        parentPath = this.currentNodeDetail.node.path ;
      }
      var nodeDetail = {
        node: { path: null, name: "", mimeType: ""},
        attributes: {}
      } ;
      
      var form =  new Node.UINodeDetail().init(this, parentPath, nodeDetail, true) ;
      this.viewStack.push(form) ;
    },
    
    onEditNode: function(evt) {
      var form =  new Node.UINodeDetail().init(this, null, this.currentNodeDetail, false) ;
      this.viewStack.push(form) ;
    },
    
    onRefresh: function() {
      var path = null ;
      if(this.currentNodeDetail != null && this.currentNodeDetail.node != null) {
        path = this.currentNodeDetail.node.path ;
      }
      this.currentNodeDetail = this.CMSService.getNodeDetail(path).data ;
      this.NodeAttributes.onRefresh(this.currentNodeDetail);
      this.render() ;
    },
    
    onSelectNode: function(evt) {
      var npath = $(evt.target).attr('path') ;
      if(npath == null || npath == undefined) {
        npath = $(evt.target).closest("a").attr('path') ;
      }
      if(npath == '') npath = null ;
      this.currentNodeDetail = this.CMSService.getNodeDetail(npath).data ;      
      this.NodeAttributes.init(this.currentNodeDetail) ;
      this.render() ;
    },
    
    back: function(refresh) {
      if(refresh) this.onRefresh() ;
      this.viewStack.back() ;
    },
    
    init: function(viewStack) {
      this.viewStack = viewStack ;
      return this ;
    },
  });
  
  var UIExplorerScreen = module.UIScreen.extend({
    initialize: function (options) {
    },

    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      var aview = new Explorer().init(this.viewStack) ;
      this.viewStack.push(aview) ;
      console.log("Node activate") ;
    },
    
    deactivate: function() { }
    
  });
  
  return UIExplorerScreen ;
});
