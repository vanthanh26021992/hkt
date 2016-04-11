define([
  'jquery', 
  'underscore', 
  'backbone',
  'module/Module',
  'ui/UIBreadcumbs',
  'ui/UITabbedPane',
  'module/admin/config/UICountries',
  'module/admin/config/UILanguages',
  'module/admin/config/UIOption',
  'module/admin/config/Cities',
  'module/admin/config/Currencies',
  'module/admin/config/ProductUnits',
], function($, _, Backbone, module, UIBreadcumbs, UITabbedPane, UICountries, UILanguages, UIOption,
    Cities, Currencies, ProductUnits) {
  
  var UIConfigs = UITabbedPane.extend({
    label: 'Configs',
    config: {
      tabs: [
         
        { 
          label: "Countries",  name: "countries",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new UICountries().init(thisUI.viewStack) ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "Cities",  name: "cities",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new Cities.UICityList().init(thisUI.viewStack) ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "Currencies",  name: "currencies",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new Currencies.UICurrencyList().init(thisUI.viewStack) ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "Product Units",  name: "productUnits",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new ProductUnits.UIProductUnitList().init(thisUI.viewStack) ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "Certificates", name: "certificates",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new UIOption().init("config", "LocaleService", "certificate", "Certificate") ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
//        { 
//          label: "Currencies", name: "currencies",
//          onSelect: function(thisUI, tabConfig) {
//            var uiTab = new UIOption().init("config", "LocaleService", "currency", "Currency") ;
//            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
//          }
//        },
        { 
          label: "Genders", name: "genders",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new UIOption().init("config", "LocaleService", "genders", "Genders") ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "Languages",  name: "languages",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new UIOption().init("config", "LocaleService", "language", "Language") ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "MarialStatus", name: "marialstatus",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new UIOption().init("config", "LocaleService", "marital_status", "MaritalStatus") ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        },
        { 
          label: "TypeRestaurants", name: "typerestaurants",
          onSelect: function(thisUI, tabConfig) {
            var uiTab = new UIOption().init("config", "LocaleService", "type_restaurant", "TypeRestaurants") ;
            thisUI.setSelectedTab(tabConfig.name, uiTab) ;
          }
        }
      ]
    },
    
    init: function(viewStack) {
      this.viewStack = viewStack ;
    }
  });
  
  var UIConfigScreen = module.UIScreen.extend({
    initialize: function (options) {
    },
    
    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      var view = new UIConfigs() ;
      view.init(this.viewStack) ;
      this.viewStack.push(view) ;
    },
    
    deactivate: function() { }
    
  });
  
  return UIConfigScreen ;
});
