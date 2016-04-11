define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'module/Module',
  'ui/UIBean',
  'ui/UITableBasic',
  'ui/UIPopup',
  'ui/UIBreadcumbs',
  'text!module/account/Priority.jtpl'
], function($, _, Backbone, service, module, UIBean, UITable, UIPopup, UIBreadcumbs, PriorityTmpl) {
  
  var UIMembershipList = UITable.extend({
  });
  
  /**@type module.account.GroupsView */
  var PriorityUi = Backbone.View.extend({
    label: "Sắp xếp ưu tiên",
    
    /**@type service.AccountService */
    AccountService: service.AccountService,
    
    initialize: function (config) {
      _.bindAll(this, 'render', 'onTop', "onSave") ;
      this.membershipList = new UIMembershipList({hide:true}) ;
    },

    _template: _.template(PriorityTmpl),
    
    render: function() {
      var params = {
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      this.membershipList.setElement(this.$('.MembershipsList')).render();
    },
    
    events: {
      'click a.onTop': 'onTop',
      'click a.onUp': 'onUp',
      'click a.onDown': 'onDown',
      'click a.onEnd': 'onEnd',
      'click a.onSave': 'onSave',
      'click a.onExit' : 'onExit'
    },
      
    /**@memberOf module.account.GroupsView */
    onExit: function(evt) {
    	UIPopup.closePopup() ;
    },
    onTop: function(evt) {
    	this.membershipList.top();
    },
    
    onUp: function(evt) {
    	this.membershipList.up();
    },
    
    onDown: function(evt) {
    	this.membershipList.down();
    },
    
    onEnd: function(evt) {
    	this.membershipList.end();
    },
    
    onSave: function(evt) {
    	this.membershipList.saveAll(this.membershipList.getBeans(), this.uiTable);
    	UIPopup.closePopup() ;
    },
    
    init: function(uiTable) {
      this.uiTable=uiTable;
      this.membershipList.label = uiTable.label;
      this.membershipList.config = uiTable.config;
      this.membershipList.saveAll = uiTable.saveAll;
      this.membershipList.setBeans(uiTable.getBeans()) ;
      return this ;
    },
  });
  
  return PriorityUi ;
});
