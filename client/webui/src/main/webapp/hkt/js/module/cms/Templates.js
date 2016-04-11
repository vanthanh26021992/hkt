define([ 
  'service/service',
  'module/Module',
  'ui/UITable',
  'ui/UIBreadcumbs',
], function(service, module, UITable, UIBreadcumbs) {
  
  var UICMSTemplates = UITable.extend({
    label: "CMS Templates",
      config : {
        toolbar: {
          dflt: {
            actions: [
              {
                action: "onRefresh", icon: "refresh", label: "Refresh",
                onClick: function(thisUI) { 
                  thisUI.onRefresh() ;
                }
              },
              {
                action: "addAll", icon: "check", label: "Add All",
                onClick: function(thisUI) { 
                }
              }
            ],
          },
        },
      bean : {
        fields: [
          { label : 'Name', field : 'name', toggled : true, filterable : true,
            onClick: function(thisUI, row) {
              var templateDesc = thisUI.getItemOnCurrentPage(row) ;
            }
          },
          { label : 'Path', field : 'path', toggled : true, filterable : true}
        ],
        actions: [
          {
            icon: "check", label: "Add",
            onClick: function(thisUI, row) {
              var templateDesc = thisUI.getItemOnCurrentPage(row) ;
              thisUI.add(templateDesc) ;
            }
          }
        ]
      }
    },
    
    onRefresh: function() {
      var availables = service.Server.syncGET("templates/config.json", {}) ;
      this.setBeans(availables) ;
      this.renderRows() ;
    },
    
    add: function(tmplDesc) {
      var template = service.Server.syncGET("templates/" + tmplDesc.path, {}) ;
      template.template = JSON.stringify(template.template) ;
      service.CMSService.addTemplate(template) ;
      console.log("add template....") ;
    },
    
    addAll: function() {
    },
    
    init: function (viewStack) {
      this.viewStack = viewStack ;
      var availables = service.Server.syncGET("templates/config.json", {}) ;
      this.setBeans(availables) ;
      return this ;
    }
    
  });
  
  var UITemplates = module.UIScreen.extend({
    initialize: function (options) {
    },
    
    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      var aview = new UICMSTemplates().init(this.viewStack);
      this.viewStack.push(aview) ;
    },
    
    deactivate: function() { }
    
  });
  
  return UITemplates ;
});
