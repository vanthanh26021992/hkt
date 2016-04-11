define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'ui/UIPopup',
  'ui/UITable',
  'module/cms/Node'
], function($, _, Backbone, service, UIPopup, UITable, Node) {
  var UINodeList = UITable.extend({
    label: "Nodes",
    config : {
      toolbar: {
        dflt: {
          actions: [
            {
              action: "onRefresh", icon: "refresh", label: "Refresh",
              onClick: function(thisUI) { 
                if(thisUI.onRefresh) thisUI.onRefresh() ;
              }
            }
          ],
        }
      },
      bean: {
        fields: [
          { 
            label: 'Path', field: 'path', toggled: true, filterable: true,
            onClick: function(thisUI, row) {
              thisUI.onViewNode(thisUI.getItemOnCurrentPage(row)) ;
            }
          },
          { label: 'Name', field: 'name', toggled: true, filterable: true}
        ],
        actions: [
          {
            icon: "delete", label: "Delete",
            onClick: function(thisTable, row) { console.log("delete row " + row) ;}
          }
        ]
      }  
    },
    
    onViewNode: function(node) {
      UIPopup.activate(new Node.UINode().init(node)) ;
    },
    
    init: function(nodes) {
      this.setBeans(nodes) ;
      return this;
    }
  }) ;
  
  var Nodes = {
    UINodeList: UINodeList 
  };
  
  return Nodes ;
});