define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'ui/UITable'
], function($, _, Backbone, service, UITable) {
  var NodeAttributes = UITable.extend({
    label: "Node Attributes",
    config: {
      toolbar: {
        dflt: {
          actions: [
            {
              action: "onNew", icon: "add", label: "New",
              onClick: function(thisTable) { 
                thisTable.onAddBean() ;
              } 
            }
          ]
        },
        filter: {
          fields: [
            { label: 'Name', field: 'name', type: 'string', operator: 'LIKE'}
          ],
          onFilter: function(thisTable, query) {
            console.log('onFilter');
          },
        }
      },
      
      bean: {
        label: 'Relationships',
        fields: [
          { label: 'Name', field: 'name', toggled: true, filterable: true},
          { label: 'Type', field: 'type', toggled: true, filterable: true},
          { label: 'Value', field: 'value', toggled: true},
          { label: 'Note', field: 'note', toggled: true}
        ],
        actions:[
          {
            icon: "delete", label: "Delete",
            onClick: function(thisTable, row) { 
              thisTable.removeItemOnCurrentPage(row) ;
            }
          },
          {
            icon: "edit", label: "Modified",
            onClick: function(thisTable, row) { 
              thisTable.onEditBean(row) ;
            }
          }
        ]
      }
    },
    init: function(nodeDetail) {
      var attributes = [] ;
      for(var key in nodeDetail.attributes) {
        var attr = nodeDetail.attributes[key];
        attr.nodePath = nodeDetail.node.path;
        attributes.push(attr) ;
      }
      this.setBeans(attributes) ;
      return this;
    },
    
    onRefresh: function(nodeDetail) {
      var attributes = [] ;
      for(var key in nodeDetail.attributes) {
        var attr = nodeDetail.attributes[key];
        attr.nodePath = nodeDetail.node.path;
        attributes.push(attr) ;
      }
      this.setBeans(attributes) ;
      return this;
    },
    
  });
  
  return NodeAttributes ;
});
