/**
 *  Design by Bui Trong Hieu
 */
define(
	[
		'jquery', 'underscore', 'backbone', 'service/service', 'module/Module', 'ui/UITable', 'ui/UIReport',
		'ui/UIBreadcumbs', 'ui/UIPopup', 'module/account/Account', 'i18n',
		'module/account/UIAccountACL', 'dialog/Dialog', 'util/DateTime', 'util/SQL',
	],
	function($, _, Backbone, service, module, UITable, UIReport, UIBreadcumbs, UIPopup, Account, i18n, UIAccountACL, UIDialog, DateTime, sql) {

		var res = i18n.getResource('module/account/account');

		var UIAccountList = UITable.extend({
			label : res('UIAccountList.label'),
			screen : "Accounts",
			config : {
				toolbar : {
					dflt : {
						actions : [
							{
								action : "onNew", icon : "plus", label : res('UIAccountList.action.onNew'), onClick : function(thisUI) {
									var account = {
										type : 'USER', loginId : "", profiles : {
											basic : {
												firstName : '', lastName : ''
											}
										}
									};
									var aview = new Account.UIAccountDetail().init(thisUI, account, true);
									thisUI.viewStack.push(aview);

								}
							}, {
								action : "onRefresh", icon : "refresh", label : "Xem lại", onClick : function(thisUI) {
									thisUI.onRefresh();
								}
							},

						],
					},
				},

				bean : {
					fields : [
						{
							label : res('UIAccountList.field.loginId'), field : 'loginId', toggled : true, filterable : true,
							onClick : function(thisUI, row) {
								var code = thisUI.getItemOnCurrentPage(row);
								var account = service.AccountService.getAccountByLoginId(code.loginId).data;
								var uiAccount = new Account.UIAccountDetail().init(thisUI, account, false);
								thisUI.viewStack.push(uiAccount);
							}
						}, {
							label : "Tên", field : 'name', toggled : true, filterable : true
						}, {
							label : "Phòng ban", field : 'department', toggled : true, filterable : true
						}, {
							label : "Chức vụ", field : 'position', toggled : true, filterable : true
						}, {
							label : "Ngày sinh", field : 'birthday', toggled : true, filterable : true
						}, {
							label : res('UIAccountList.field.email'), field : 'email', toggled : true, filterable : true
						}
					],
					actions : [
						{
							icon : "edit", label : "Sửa", onClick : function(thisUI, row) {
								var code = thisUI.getItemOnCurrentPage(row);
								var account = service.AccountService.getAccountByLoginId(code.loginId).data;
								var uiAccount = new Account.UIAccountDetail().init(thisUI, account, false);
								thisUI.viewStack.push(uiAccount);
							}
						},
						{
							icon : "delete", label : "Xóa", onClick : function(thisUI, row) {
								var dialog = {
									nameDialog : "", isDialog : true, kpi : []
								};
								var code = thisUI.getItemOnCurrentPage(row);
								var kpis = service.KpiService.getAllKpiAccountByPath(code.loginId).data;
								var groups = service.AccountService.getAccountGroupByResponsible(code.loginId).data;
								if (kpis.length == 0 && groups.length == 0) {
									dialog.nameDialog = "Bạn muốn xóa đối tượng này?";
									dialog.isDialog = true;
									thisUI.code = code;
								} else {
									dialog.nameDialog = "Nếu bạn muốn xóa đối tượng này bạn phải xóa các đối tượng có liên kết!";
									dialog.isDialog = false;
									for (var i = 0; i < kpis.length; i++) {
										var kpi = {
											code : kpis[i].code, name : kpis[i].name, classify : "Thiết lập KPI"
										};
										dialog.kpi.push(kpi);
									}
									for (var i = 0; i < groups.length; i++) {
										var group = {
											code : groups[i].code, name : groups[i].name, classify : "Phòng ban"
										};
										dialog.kpi.push(group);
									}
								}
								UIPopup.activate(new UIDialog.UIDialog().init(thisUI, dialog));
							}
						},
						{
							icon : "check", label : "Phân quyền", onClick : function(thisUI, row) {
								var account = thisUI.getItemOnCurrentPage(row);
								var uiAccountACL = new UIAccountACL().init(thisUI, account);
								thisUI.viewStack.push(uiAccountACL);
							}
						},
					]
				}
			},
			onDelete : function() {
				var deleted = service.AccountService.deleteAccountByLoginId(this.code.loginId).data;
				this.onRefresh();
			},
			onRefresh : function() {
				var result = service.AccountService.getAccountByUser().data;
				this.setBeans(result);
				this.renderRows();
			},
			onAddBean : function() {
				var account = {
					type : 'USER', loginId : "", profiles : {
						basic : {
							firstName : '', lastName : ''
						}
					}
				};
				var aview = new Account.UIAccountDetail().init(this, account);
				this.viewStack.push(aview);
			},

			back : function(refresh) {
				if (refresh)
					this.onRefresh();
				this.viewStack.back();
			},

			init : function(viewStack) {
				this.viewStack = viewStack;
				var result = service.AccountService.getAccountByUser().data;
				this.setBeans(result);
				return this;
			},
		});

		var UIAccountsScreen = module.UIScreen.extend({
			initialize : function(options) {
			},

			activate : function() {
				this.viewStack = new UIBreadcumbs({
					el : "#workspace"
				});
				var aview = new UIAccountList().init(this.viewStack);
				this.viewStack.push(aview);
			},

			deactivate : function() {
			}

		});

		return UIAccountsScreen;
	});
