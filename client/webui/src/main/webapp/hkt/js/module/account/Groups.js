define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'module/Module',
  'ui/UIBean',
  'ui/UITable',
  'ui/UIPopup',
  'ui/UIBreadcumbs',
  'module/account/Group',
  'module/account/Account',
  'module/account/Membership',
  'text!module/account/Groups.jtpl',
  'dialog/Dialog'
], function($, _, Backbone, service, module, UIBean, UITable, UIPopup, UIBreadcumbs, Group, 
    Account, Membership, GroupsTemplate,  UIDialog) {
  
  var UIMembershipList = UITable.extend({
    label : "Membership", 
    config: {
      toolbar: {
        dflt: {
          actions: []
        }
      },
      bean: {
        fields: [
//          { 
//            label: 'Id', field: 'id', toggled: true,
//            onClick: function(thisUI, row) { 
//              console.log("edit row " + row) ;
//            } 
//          },
          { 
            label: 'Tên nhân viên', field: 'nameEmployee', toggled: true, filterable: true,
			custom: {
		          getDisplay: function(bean) {
		            if(bean.loginId == null){
		               return null;
		            }else {
		            	var account = service.AccountService.getAccountByLoginId(bean.loginId).data ;
		            	return account.name;
				    }
		          },
		        },
            onClick: function(thisUI, row) { 
              var membership = thisUI.getItemOnCurrentPage(row) ;
              var account = service.AccountService.getAccountByLoginId(membership.loginId).data ;
              var view = new Account.UIAccountDetail().init(thisUI, account, false) ;
              thisUI.viewStack.push(view) ;
            }
          },
          { label: 'Quyền', field: 'role', toggled: true, filterable: true,
				custom: {
			          getDisplay: function(bean) {
			            if(bean.loginId == null){
			               return null;
			            }else {
			              var position = service.KpiService.getPositionByCode(bean.role).data;
			              if(position!=null){
			            	  return position.name;
			              }else {
							return null;
						  }
					    }
			          },
			        }
          },
          { label: 'Miêu tả', field: 'description', toggled: true, filterable: true },
        ],
        actions: [
          {
            icon: "edit", label: "Sửa",
            onClick: function(thisUI, row) {
              var membership = thisUI.getItemOnCurrentPage(row) ;
              UIPopup.activate( new Membership.UIMembership().init(thisUI, membership, false)) ;
            } 
          },
          {
            icon: "bars", label: "Thông tin nhân viên",
            onClick: function(thisUI, row) { 
              var membership = thisUI.getItemOnCurrentPage(row) ;
              var account = service.AccountService.getAccountByLoginId(membership.loginId).data ;
              var view = new Account.UIAccountDetail().init(thisUI, account, false) ;
              thisUI.viewStack.push(view) ;
            } 
          },
          {
            icon: "delete", label: "Xóa",
            onClick: function(thisUI, row) { 
              var membership = thisUI.getItemOnCurrentPage(row) ;
              var deleted = service.AccountService.deleteMembershipByLoginIdAndGroupPath(membership.loginId, membership.groupPath).data ;
              if(deleted) {
                thisUI.removeItemOnCurrentPage(row) ;
              }
            }
          }
        ]
      }
    },
    
    back: function(){
      this.viewStack.back() ;
    },
    
    init: function(viewStack) {
      this.viewStack = viewStack ;
    },
    
    onRefresh: function(groupPath){
      var meberships = service.AccountService.findMembershipByGroupPath(groupPath).data ;
      this.setBeans(meberships) ;
      this.renderRows() ;
    }
  });
  
  /**@type module.account.GroupsView */
  var GroupsView = Backbone.View.extend({
    label: "Cây Phòng ban & Nhân sự",
    screen: "Groups",
    /**@type service.AccountService */
    AccountService: service.AccountService,
    
    initialize: function (config) {
      _.bindAll(this, 'render', 'onNewGroup', "onCloseGroupForm") ;
      this.membershipList = new UIMembershipList() ;
    },

    _template: _.template(GroupsTemplate),
    
    render: function() {
      var params = {
        group : this.currentGroupDetail.group,
        memberships: this.currentGroupDetail.memberships,
        children: this.currentGroupDetail.children,
        serviceA: this.AccountService
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      this.membershipList.setBeans(params.memberships) ;
      this.membershipList.setElement(this.$('.MembershipsList')).render();
    },
    
    events: {
      'click a.onNewGroup': 'onNewGroup',
      'click a.onEditGroup': 'onEditGroup',
      'click a.onDeleteGroup': 'onDeleteGroup',
      'click a.onSelectGroup': 'onSelectGroup',
      'click a.onCloseGroupForm': 'onCloseGroupForm',
      'click a.onAddMembership' : 'onAddMembership',
//      'click a.onAddValueChange' : 'onAddValueChange'
    },
      
    /**@memberOf module.account.GroupsView */
    onAddMembership: function(evt) {
      var parentPath = null ;
      if(this.currentGroupDetail != null && this.currentGroupDetail.group != null) {
        parentPath = this.currentGroupDetail.group.code ;
      }
      var membership = { loginId: "", groupPath: parentPath} ;
      UIPopup.activate( new Membership.UIMembership().init(this, membership, true)) ;
    },
    onNewGroup: function(evt) {
    	
      var parentPath = null ;
      if(this.currentGroupDetail != null && this.currentGroupDetail.group != null) {
        parentPath = this.currentGroupDetail.group.code ;
      }
      var today = new Date();
      var codeString = moment(today).format('YYYYMMDDHHmmss') ;
      var group = {
    		  
        code: codeString, name: "", description: ""
      } ;
      if(UIPopup.getPermission("Groups","write")){
    	  UIPopup.activate( new Group.UIGroup().init(this, parentPath, group, true));
 	 }
      
    },
    
    onEditGroup: function(evt) {
      var group = this.currentGroupDetail.group ;
      var groups = service.AccountService.getAccountGroupByCode(group.code).data;
      if(UIPopup.getPermission("Groups","write")){
    	  UIPopup.activate( new Group.UIGroup().init(this, groups.parentCode, group, false));
 	 }
    
     
    },
    
    onDeleteGroup: function(evt) {
    	var dialog = {nameDialog: "", isDialog: true, kpi: []};
    	var code = this.currentGroupDetail.group;
    	var kpis = service.KpiService.getAllKpiAccountByPath(code.code).data;
			var accounts = service.AccountService.getAccountByDeparment(code.code).data;
			var groups = service.AccountService.getAccountGroupByParentCode(code.code).data;
			if (kpis.length == 0 && groups.length == 0) {
				dialog.nameDialog = "Bạn muốn xóa đối tượng này?";
				dialog.isDialog = true;
				thisUI.code = code;
			} else {
				dialog.nameDialog = "Nếu bạn muốn xóa đối tượng này bạn phải xóa các đối tượng có liên kết!";
				dialog.isDialog = false;
				for (var i = 0; i < kpis.length; i++) {
					var kpi = {
						code : kpis[i].code, name : kpis[i].name, classify : "Danh sách phòng ban"
					};
					dialog.kpi.push(kpi);
				}
				 for(var i = 0; i< groups.length;i++){
	   			 var group = {code: groups[i].code, name: groups[i].name, classify: "Phòng ban" };
	   			 dialog.kpi.push(group);
	   		 }
				 for(var i = 0; i< accounts.length;i++){
	   			 var account = {code: accounts[i].loginId, name: accounts[i].name, classify: "Nhân sự" };
	   			 dialog.kpi.push(account);
	   		 }
			}
   	UIPopup.activate(new UIDialog.UIDialog().init(this,dialog));
    },
    
	onDelete: function(){
   	 if(UIPopup.getPermission("Groups","all")){
   		 var parent = null;
   		 if(this.code.parentCode != undefined){
   			parent = this.code.parentCode ;
   		 }
	      service.AccountService.deleteGroup(this.code).data ;
	      console.log(parent);
	      if(this.AccountService.getGroupDetailByCode(parent).data !=null)
	    	  this.updateSelectGroup(this.AccountService.getGroupDetailByCode(parent).data) ;
	 }
        
	},
    
    onRefresh: function() {
    	console.log("onRefresh");
      var path = null ;
      if(this.currentGroupDetail != null && this.currentGroupDetail.group != null) {
        path = this.currentGroupDetail.group.code ;
      }
      
      this.currentGroupDetail = this.AccountService.getGroupDetailByCode(path).data ;
      this.render() ;
    },
    
    onSelectGroup: function(evt) {
      var gpath = $(evt.target).attr('path') ;
      if(gpath == null || gpath == undefined) {
        gpath = $(evt.target).closest("a").attr('path') ;
      }
      if(gpath == '') gpath = null ;
      this.updateSelectGroup(this.AccountService.getGroupDetailByCode(gpath).data) ;
    },
    
    onCloseGroupForm: function(evt) {
      console.log("close group form") ;
    },
    
    updateSelectGroup: function(groupDetail) {
      this.currentGroupDetail = groupDetail ;
      if(groupDetail.memberships.length !=0)
    	  this.membershipList.setBeans(groupDetail.memberships) ;
      this.render() ;
    },
    
    init: function(viewStack) {
      this.viewStack = viewStack ;
      this.currentGroupDetail = service.AccountService.getGroupDetailByCode(null).data ;
      this.membershipList.init(this.viewStack) ;
      this.membershipList.setBeans(this.currentGroupDetail.memberships) ;
      return this ;
    },
  });

  
  var UIGroupsScreen = module.UIScreen.extend({
    
    initialize: function (options) {
    },

    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      var aview = new GroupsView().init(this.viewStack) ;
      this.viewStack.push(aview) ;
    },
    
    deactivate: function() { }
    
  });
  
  return UIGroupsScreen ;
});
