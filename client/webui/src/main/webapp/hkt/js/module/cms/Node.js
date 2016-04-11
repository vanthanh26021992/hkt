define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'ui/UICollapsible',
  'ui/UIBean',
  'module/cms/NodeAttributes'
], function($, _, Backbone, service, UICollapsible, UIBean, NodeAttributes) {
  var UINode =  UIBean.extend({
    label: "Node",
    config : {
      beans: {
        node: {
          name: 'node', label: 'Node',
          fields: [
            {field: "path", label: "Path", disable: true},
            {field: "name", label: "Name"},
            {field: "mimeType", label: "Type"}
          ],
        }
      }
    },
    
    init: function(node) {
      this.bind('node', node) ;
      var nodeConfig = this.getBeanConfig('node') ;
      nodeConfig.disableField('name', true) ;
      return this ;
    }, 
    
    initWithDetail: function(node, isNew) {
      this.bind('node', node) ;
      var nodeConfig = this.getBeanConfig('node') ;
      if(!isNew){
        nodeConfig.disableField('name', true) ;
      }else{
        nodeConfig.disableField('name', false) ;
      }
      this.getBeanState('node').editMode = true ;
      return this ;
    }
  }) ;
  
  
  /**@type module.cms.UINodeDetail */
  var UINodeDetail = UICollapsible.extend({
    label: "Node",
    config: {
      actions: [
        { 
          action: "back", label: "Back",
          onClick: function(thisUI) {
            if(thisUI.UIParent.back) thisUI.UIParent.back(false) ; 
          }
        },
        {
          action: "save", label: "Save",
          onClick: function(thisUI) {
            var node = thisUI.UINode.getBean('node');
            var attributes = thisUI.NodeAttributes.getBeans();
            var nodeAttributes = {};
            for (var i = 0; i < attributes.length; i++) {
              var attribute = attributes[i];
              nodeAttributes[attribute.name] =  attribute;
            }
            var parentPath = thisUI.parentPath;
           
            if(thisUI.isNew) {
              service.CMSService.createNode(parentPath, node, nodeAttributes) ;
            } else {
              service.CMSService.updateNode(node, nodeAttributes) ;
            }
            thisUI.UIParent.back(true) ; 
          }
        }
      ]
    },
    
    onInit: function(options) {
      this.UINode = new UINode() ;
      this.NodeAttributes = new NodeAttributes() ;
      this.add(this.UINode) ;
      this.add(this.NodeAttributes) ;
    },
    
    init: function(UIParent, parentPath, nodeDetail, isNew) {
      this.UIParent = UIParent ;
      this.parentPath = parentPath;
      this.nodeDetail  = nodeDetail;
      this.isNew = isNew ;
      this.UINode.initWithDetail(nodeDetail.node, isNew) ;
      this.NodeAttributes.init(nodeDetail) ;
      return this;
    }
  });
  
  var Node = {
    UINode: UINode,
    UINodeDetail: UINodeDetail
  };
  return Node ;
});
