/**
 *  @author Bui Trong Hieu
 */
define([
        'jquery',
        'underscore', 
        'backbone',
        'service/service',
        'ui/UICollapsible',
        'dialog/UIBean',
        'ui/UIBreadcumbs',
        'module/Module',
], function($, _, Backbone,service, UICollapsible, UIBean, UIBreadcumbs, module){
	
	var UIDialogNotice = UIBean.extend({
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
			                  action:'cancel', label: "Thoát", icon: "back",
			                  onClick: function(thisUI) { 
			                	  thisUI.UIPopup.closePopup() ;
			                  }
			                }
			              ],
			            },
				},
			},
		},
		    
		init: function(UIPopup, dialog){
			this.UIPopup = UIPopup;
			this.bind('dialog', dialog, true) ;
			this.getBeanState('dialog').editMode = true;
			return this;
		},
	});	
	
	var DialogNotice = {
			UIDialogNotice: UIDialogNotice,
	};
	
	return DialogNotice;
});