/**
 * Edit by Bui Trong Hieu
 */
define([
	'jquery', 'underscore', 'backbone', 'service/service', 'ui/UITable', 'ui/UIPopup', 'ui/UICollapsible', 'ui/UIBean',
	'ui/UIBreadcumbs', 'module/Module', 'module/account/PriorityUi', 'dialog/Dialog',
	'module/account/Group', 'util/SQL', 'util/DateTime',
], function($,_,Backbone,service,UITable,UIPopup,UICollapsible,UIBean,UIBreadcumbs,module,PriorityUi,UIDialog,
	Group,sql,DateTime) {

	var UIGroupList = UITable.extend({
		label : "Danh sách Phòng ban",
		screen : "ListGroup",
		config : {
			toolbar : {
				dflt : {
					actions : [
						{
							action : "onNew", icon : "plus", label : "Thêm mới", onClick : function(thisUI) {
								var today = new Date();
								var codeString = moment(today).format('YYYYMMDDHHmmss');
								var groups = {
									code : codeString
								};
								var aview = new Group.UIGroup().init(thisUI, null, groups, false);
								UIPopup.activate(aview);
							}
						}, {
							action : "onRefresh", icon : "refresh", label : "Xem lại", onClick : function(thisUI) {
								thisUI.onRefresh();
							}
						}, {
							action : "onReport", icon : "forward", label : "Sắp xếp ưu tiên", onClick : function(thisUI) {
								UIPopup.activate(new PriorityUi().init(thisUI));
							}
						}
					]
				},
			},
			bean : {
				label : 'Phòng ban',
				fields : [
					{
						label : "Mã", field : 'code', toggled : true, filterable : true, validator : {
							name : "empty"
						}, onClick : function(thisUI,row) {
							var code = thisUI.getItemOnCurrentPage(row);
							var account = service.AccountService.getAccountGroupByCode(code.code).data;
							var uiDetail = new Group.UIGroup().init(thisUI, code.parentCode, account, true);
							UIPopup.activate(uiDetail);
						}
					}, {
						label : "Tên", field : 'name', toggled : true, filterable : true, validator : {
							name : "empty"
						}
					}, {
						label : "Phòng ban cha", field : 'parentName', toggled : true, filterable : true,
					}, {
						label : "Người chịu trách nhiệm", field : 'responsible', toggled : true, filterable : false,
					}, {
						label : "Miêu tả", field : 'description', textarea : {}
					}
				],

				actions : [
					{
						icon : "edit", label : "Sửa", onClick : function(thisUI,row) {
							var code = thisUI.getItemOnCurrentPage(row);
							var account = service.AccountService.getAccountGroupByCode(code.code).data;
							var uiDetail = new Group.UIGroup().init(thisUI, code.parentCode, account, true);
							UIPopup.activate(uiDetail);
						}
					},
					{
						icon : "delete", label : "Xóa", onClick : function(thisUI,row) {
							var dialog = {
								nameDialog : "", isDialog : true, kpi : []
							};
							var code = thisUI.getItemOnCurrentPage(row);
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
							UIPopup.activate(new UIDialog.UIDialog().init(thisUI, dialog));
						}
					}
				]
			}
		}, 
		
		onDelete : function() {
			service.AccountService.deleteGroup(this.code).data;
			this.onRefresh();
		}, 
		
		save : function(group) {
			service.AccountService.saveGroup(group);
		}, 
		
		saveAll : function(beans,thisUI) {
			for (var i = 0; i < beans.length; i++) {
				var bean = service.AccountService.getAccountGroupByCode(beans[i].code).data;
				bean.priority = beans[i].priority;
				service.AccountService.saveGroup(bean);
			}
			thisUI.setBeans(beans);
			thisUI.renderRows();
		}, 
		
		onRefresh : function() {
			var result = service.AccountService.getAccountByUser().data;
			this.setBeans(result);
			this.renderRows();
		}, 
		
		back : function(refresh) {
			if (refresh)
				this.onRefresh();
			this.viewStack.back();
		}, 
		init : function(viewStack) {
			this.viewStack = viewStack;
			this.isSave = true;
			var result = service.AccountService.getAccountByUser().data;
			result = _.sortBy(result, "priority");
			this.setBeans(result);
			return this;
		}
	});

	var UIGroups = module.UIScreen.extend({
		initialize : function(options) {
			this.groupList = new UIGroupList().init(null);
		}, activate : function() {
			this.viewStack = new UIBreadcumbs({
				el : "#workspace"
			});
			this.UIGroupList = new UIGroupList().init(this.viewStack);
			this.viewStack.push(this.UIGroupList);
		},

		deactivate : function() {
		}

	});

	return UIGroups;
});
