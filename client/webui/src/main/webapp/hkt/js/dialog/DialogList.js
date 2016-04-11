define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'module/Module',
  'ui/UIBean',
  'dialog/UITableDialog',
  'ui/UIPopup',
  'ui/UIBreadcumbs',
  'text!dialog/DialogList.jtpl'
], function($, _, Backbone, service, module, UIBean, UITable, UIPopup, UIBreadcumbs, DialogList) {
  
  var UIMembershipList = UITable.extend({
  });
  
  /**@type module.account.GroupsView */
  var PriorityUi = Backbone.View.extend({
    label: "Đối tượng cần xóa",
    
    /**@type service.AccountService */
    AccountService: service.AccountService,
    
    initialize: function (config) {
      _.bindAll(this, 'render') ;
      this.membershipList = new UIMembershipList({hide:true}) ;
    },

    _template: _.template(DialogList),
    
    render: function() {
      var params = {
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      this.membershipList.setElement(this.$('.MembershipsList')).render();
    },
    
    events: {
      'click a.onExit' : 'onExit'
    },
      
    /**@memberOf module.account.GroupsView */
    onExit: function(evt) {
    	UIPopup.closePopup() ;
    },
    
    init: function(uiTable) {
      this.uiTable=uiTable;
      this.membershipList.dialogLabel = uiTable.dialogLabel;
      this.membershipList.setBeans(uiTable.kpi) ;
      return this ;
    },
  });
  
  return PriorityUi ;
});
