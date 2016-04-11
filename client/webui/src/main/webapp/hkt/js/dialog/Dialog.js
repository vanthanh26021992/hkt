/**
 *  @author Bui Trong Hieu
 */
define([
        'jquery',
        'underscore', 
        'backbone',
        'service/service',
        'ui/UITable',
        'ui/UIPopup',
        'ui/UICollapsible',
        'dialog/UIBean',
        'ui/UIBreadcumbs',
        'module/Module',
        'dialog/DialogList',
], function($, _, Backbone,service, UITable, UIPopup, UICollapsible, UIBean, UIBreadcumbs, module, DialogList ){
	
	var UIDialog = UIBean.extend({
		label: "Thông báo",
		config: {
			beans: {
				dialog: {
					label: "Thông báo",
					fields: [
							    {label: "Mã", field: 'code'},
								{label: "Tên", field: 'name' },
								{label: "Phân loại", field: 'classify'}
					],
			          edit: {
			              disable: false ,
			              actions: [
			                {
			                  action:'save', label: "Đồng ý", icon: "check",
			                  onClick: function(thisUI) { 
			                    var dialog = thisUI.beanStates.dialog.bean;
			                    if(dialog.isDialog == true){
			                    	if(dialog.isSave){
			                    		thisUI.UIParent.save();
				                    	UIPopup.closePopup();
			                    	}else{
			                    		thisUI.UIParent.onDelete();
				                    	UIPopup.closePopup();
			                    	}
			                    	
			                    }
			                    else{
			                      thisUI.UIParent.kpi = dialog.kpi;
			                      thisUI.UIParent.dialogLabel = thisUI.config.beans.dialog.fields;
			                      UIPopup.activate(new DialogList().init(thisUI.UIParent));
			                    }
			                  }
			                },
			                {
			                  action:'cancel', label: "Thoát", icon: "back",
			                  onClick: function() { 
			                    UIPopup.closePopup() ;
			                  }
			                }
			              ],
			            },
				},
			},
		},
		    
		init: function(UIParent, dialog){
			this.UIParent = UIParent;
			this.bind('dialog', dialog, true) ;
			this.getBeanState('dialog').editMode = true;
			return this;
		},
		
		setBeans: function(code,bean, classify){
			
		}
	});	
	
	var Dialog = {
			UIDialog: UIDialog,
	};
	
	return Dialog;
});