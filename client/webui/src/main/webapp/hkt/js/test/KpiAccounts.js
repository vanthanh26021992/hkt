/**
 *  Edit by Bui Trong Hieu
 */
define([
        'jquery',
        'underscore', 
        'backbone',
        'service/service',
        'ui/UITable',
        'ui/UIPopup',
        'ui/UIBean',
        'ui/UIBreadcumbs',
        'module/Module',
        'module/kpi/KpiAccount',
        'dialog/Dialog',
        'ui/UIPopup'
], function($, _, Backbone,service, UITable, UIPopup, UIBean, UIBreadcumbs, module, KpiAccount,UIDialog, UIPopup ){
	
	var UIKpiAccountList = UITable.extend({
		label: "Thiết lập KPI",
		screen: "KpiAccounts",
		config: {
			toolbar: {
				dflt: {
					actions: [
					      {
					    	  action: "onNew", icon: "plus", label: "Thêm mới",
					    	  onClick: function(thisUI) {
					    		  	var today = new Date();
				                  	var codeString = moment(today).format('YYYYMMDDHHmmss') ;
				    				var kpiAccount = { code: codeString, valueChanges: []};
				    				var aview = new KpiAccount.UIKpiAccountDetail().init(thisUI, kpiAccount, true);
//				    				UIPopup.activate(new KpiAccount.UIKpiAccountDetail().init(thisUI, kpiAccount, true)) ;
				                    thisUI.viewStack.push(aview);
					    	  }
					      },
					      {
					    	  action: "onRefresh", icon: "refresh", label: "Xem lại",
				                onClick: function(thisUI) { 
				                  thisUI.onRefresh() ;
				                }
					      }
					 ]
				},
				filter: {
                    fields: [
					    {label: 'Search By Code', field: 'code', type: 'string', operator: 'LIKE'},
					    {label: 'Search By Name', field: 'name', type: 'string', operator: 'LIKE'},
					 ],
					 onFilter: function(thisUI, query) {
						 
					 }
				}
			},
			bean: {
				fields: [
				  {
				   label: "Mã", field: 'code', toggled:true, filterable: true,
				   onClick: function(thisUI, row) {
				    	var code = thisUI.getItemOnCurrentPage(row) ;
				    	var uiDetail = thisUI.UIKpiAccountDetail.init(thisUI, code, false) ;
//				    	UIPopup.activate(uiDetail) ;
				    	thisUI.viewStack.push(uiDetail) ;
				     }
				   },
				   {label: "Tên", field: 'name', toggled:true, filterable: true },
				   {label: "Loại", field: 'type', toggled:true, filterable: true,
					custom: {
					  getDisplay: function(bean) {
					    if(bean.type==null){
					       return null;
					    }else {
					       if(bean.type == "USER"){
					          return "Nhân viên";	
					       }else if(bean.type == "Deparment"){
					    	  return "Phòng ban";
						   }else{
							   return "Công ty";
						   }
						 }
					   }
				     }
				   },
				   {
				    label: "Loại đối tượng", field: 'path', toggled:true, filterable: true,
				    custom: {
			          getDisplay: function(bean) {
			            if(bean.path==null){
			            	return null;
			            }else {
			            	if(bean.type == "USER" || bean.type == "ORGANIZATION"){
			            		var account = service.AccountService.getAccountByLoginId(bean.path).data;
			            		if(account==null){
									return null;
								}else {
									return account.name;
								}
			            	}else {
			            		var group = service.AccountService.getGroupByPath(bean.path).data;
								if(group==null){
									return null;
								}else {
									return group.label;
								}
							}
						}
			          }
					}
				   },
				   {label: "Nhóm", field: 'codeGroup', toggled:true, filterable: true,
					custom: {
					  getDisplay: function(bean) {
				        if(bean.codeGroup==null){
				           return null;
				        }else {
				           if(bean.codeGroup!=null){
				        	   var kpi = service.KpiService.getGroupByCode(bean.codeGroup).data;
					           if(kpi==null){
								 return null;
							   }else {
								 return kpi.name;
							   }	
				           }else{
				        	   return null;
				           }
				           
						}
				      }
					}
				   },
				   {label: "Miêu tả", field: 'description', toggled:true, filterable: true}
				  ],

				  actions: [
				     {
				    	 icon: "edit", label: "Sửa",
				    	 onClick: function(thisUI, row){
				    		 var code = thisUI.getItemOnCurrentPage(row);
				    		 thisUI.UIKpiAccountDetail.init(thisUI, code, false) ;
				              thisUI.viewStack.push(thisUI.UIKpiAccountDetail) ;
				    	 }
				     } ,
			          {
				            icon: "delete", label: "Xóa",
				            onClick: function(thisUI, row) {
				            	var dialog = {nameDialog: "", isDialog: true, kpi: []};
				            	 var code = thisUI.getItemOnCurrentPage(row);
				            	 var kpiAccount = service.KpiService.getKpiAccountByCodeKpiAccount(code.code).data;
				            	 if(kpiAccount.length == 0){
				            		dialog.nameDialog = "Bạn muốn xóa đối tượng này?";
				            		dialog.isDialog = true; 
				            		thisUI.code = code ;
				            	 }
//				            	 else{
//				            		 dialog.nameDialog = "Nếu bạn muốn xóa đối tượng này bạn phải xóa các đối tượng có liên kết!";
//				            		 dialog.isDialog = false;
//				            		 var recipes = service.KpiService.getKpiAccountByCode(code.code).data;
//				            		 var recipe = {code: recipes.code, name: recipes.name, classify: "Công thức" };
//				            		 dialog.kpi.push(recipe);
//				            		 
//				            	 }
				            	UIPopup.activate(new UIDialog.UIDialog().init(thisUI,dialog));
				            }
				          }
				     ]
			}
		},
		onDelete: function(){
            var deleted = service.KpiService.deleteKpiAccountByCode(this.code.code).data;
            this.onRefresh();
		},
	    onRefresh: function() {
	        var result = service.KpiService.getAllKpiAccount(true).data ;
	        this.setBeans(result) ;
	        this.renderRows() ;
	      },
	    back: function(refresh) {
	        if(refresh) this.onRefresh() ;
	        this.viewStack.back() ;
	      },
	    init: function(viewStack){
			this.viewStack = viewStack;
			this.UIKpiAccountDetail = new KpiAccount.UIKpiAccountDetail() ;
	    	var result = service.KpiService.getAllKpiAccount(true).data;
			this.setBeans(result);
			return this;
	    },
	    onAddBean: function(){
		  	var today = new Date();
          	var codeString = moment(today).format('YYYYMMDDHHmmss') ;
			var kpiAccount = { code: codeString, valueChanges: []};
			var aview = new KpiAccount.UIKpiAccountDetail().init(this, kpiAccount, true);
            this.viewStack.push(aview);
	    },
	});
	
	var UIKpiAccounts = module.UIScreen.extend({
		 initialize: function (options) {
		    },
		    
		    activate: function() { 
		      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
		      var aview = new UIKpiAccountList().init(this.viewStack);
		      this.viewStack.push(aview) ;
		    },
		    
		    deactivate: function() { }
	});
	
	return UIKpiAccounts;
});