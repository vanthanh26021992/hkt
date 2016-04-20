/**
 * 
 */

define([ 'jquery', 'underscore', 'backbone', 'service/service', 'ui/UITable',
		'ui/UIPopup', 'ui/UICollapsible', 'ui/UIBean', 'ui/UIBreadcumbs',
		'module/Module', 'module/account/PriorityUi', 'dialog/Dialog',
		'module/account/Group', 'util/SQL', 'util/DateTime', ], function($, _,
		Backbone, service, UITable, UIPopup, UICollapsible, UIBean,
		UIBreadcumbs, module, PriorityUi, UIDialog, Group, sql, DateTime) {
	
	var UIGroupList = UITable.extend({
		label : 'Danh sách thành phố',
		screen : 'Cities',
		config : 
		{
			toolbar : 
			{
				dflt : 
				{
					actions : 
					[
						 {
							action : 'onNew', icon : 'plus', label : 'Thêm mới', 
							onClick : function(thisUI) {
								console.log(thisUI);
								thisUI.onAddBean();
							}
						 }, 
						 {
							 action : 'onRefesh', icon :'refesh', label : 'Xem lại', onClick : function(thisUI){
								thisUI.onRefresh(); 
							}
						 }
					]
				}
			},
			bean : {
				label : 'Thành phố',
				fields : [
						{
							label : 'Mã', field : 'code', toggled : true, filterable : true,
							validator : {name : 'empty'},
							onClick : function(thisUI, row) {
								thisUI.onEditBean(row);
							},
						}, 
						{
							label : 'Tên', field : 'name', toggled : true, filterable : true,
						}, 
						{
							label : 'Mô tả', field : 'description',textarea : {}
						}, 
						{
							label : 'Quốc gia', field : 'codeCountry', toggled : true, filterable : true
						} ],
				actions : [
						{
							icon : 'edit',
							label : 'Sửa',
							onClick : function(thisUI, row) 
							{
								thisUI.onEditBean(row);
							}
						},
						{
							icon : 'delete',
							label : 'Xóa',
							onClick : function(thisUI, row) 
							{
								var code = thisUI.getItemOnCurrentPage(row);
								var city = service.KpiService.getCityByCode(code.code).data;
								//console.log(city);
								console.log(service.KpiService.deleteCity(city));
								service.KpiService.deleteCity(city);
								thisUI.removeItemOnCurrentPage(row);
							}
						}],
			}
		},
		init : function(viewStack) {
			
			this.viewStack = viewStack;
			this.isSave = true;
			var result = service.KpiService.getAllCity().data;
			this.setBeans(result);
			return this;
		},
		save : function(city) {
			service.KpiService.saveCity(city);
		},
		saveAll : function(bean,thisUI) {
			console.log("2");
			for (var i = 0; i < beans.length; i++) {
				var bean = service.KpiService.getCityByCode(beans[i].code).data;
				bean.priority = beans[i].priority;
				service.KpiService.saveCity(bean);
			}
			thisUI.setBeans(beans);
			thisUI.renderRows();
		},
		onRefresh: function()
		{
			var result = service.KpiService.getAllCity().data;
			this.setBeans(result);
			this.renderRows();
		},

		back : function(refresh) {
			if (refresh)
				this.onRefresh();
			this.viewStack.back();
		},
	});
	var UIGroups = module.UIScreen.extend({
		initialize : function(options) {
			
			this.groupList = new UIGroupList().init(null);
		},
		activate : function() {
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