/**
 *  Edit by Bui Trong Hieu
 */
define([
   'jquery',
   'service/service',
   'ui/UITable',
   'ui/UIPopup',
   'test/UICollapsible',
   'ui/UIBean',
   'util/DateTime',
   'module/kpi/ValueChange',
], function($, service, UITable, UIPopup, UICollapsible, UIBean,DateTime,ValueChange){
	
	var UIKpiAccount = UIBean.extend({
		label: "Kpi",
		config: {
			beans: {
				kpiAccount: {
					label: "Kpi",
					fields: [
						{
							field: "code", label: "Mã", required: true,
							validator: {name: "empty"} 
						},
						{
							field: "name", label: "Tên", required: true,
							validator: {name: "empty"} 
						},
						{
							field: "type", label: "Loại đối tượng", required: true,
							defaultValue: "USER",
				              select: {
				                  getOptions: function(field, bean) {
				                    var options = [
				                      { label: "Nhân viên", value: 'USER' },
				                      { label: "Phòng ban", value: 'Deparment'},
				                      { label: "Công ty", value: 'ORGANIZATION'},
				                    ];
				                    return options ;
				                  }
				                },
								custom: {
									set: function(bean,thisUI){
											thisUI.test(thisUI, bean);},
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
							field: "path", label: "Đối tượng", required: true, checkBox: true,
							custom: {
				                getDisplay: function(bean) { return bean.path == null ? null : bean.nameObject; },
				                set: function(bean, obj,thisUI,beanState) {
				                	beanState.search =  obj.label;
				                	bean.path = obj.value ;
				                	bean.nameObject = obj.label;},
				                autocomplete: {
				                  search: function(val, bean) {
					               var result = [] ;

					               if(bean.type == "Deparment")
					               	   {
					            	   var deparments = service.AccountService.findGroupByLabel(val).data ;
						               for(var i = 0; i < deparments.length; i++) {
						                  var deparment = deparments[i] ;
						                  result[i] = { value: deparment.path, label:  deparment.label } ;
						                 }
					                   }
					               else if(bean.type == "USER")
					            	   {
						                    var accounts = service.AccountService.findAccountByLoginId(val, bean.type).data ;
						                    for(var i = 0; i < accounts.length; i++) {
						                      var account = accounts[i] ;
						                      result[i] = { value: account.loginId, label: account.name} ;
						                    }
					            	   }
				                    return result ;
				                  }
				                }
				              }
						},
						{
							   label: "Nhóm", field: 'codeGroup', toggled: true, filterable: true,
					            custom: {
						              getDisplay: function(bean) {
						                return bean.nameGroup == null ? null : bean.nameGroup ;
						              },
						              set: function(bean, obj) { bean.nameGroup = obj.label;
						              							 bean.codeGroup = obj.value; },
						              autocomplete: {
						                search: function(val) {
						                  var result = [] ;
						                  var groupsKpis = service.KpiService.findGroupKpiByName(val).data;
						                  for(var i = 0; i < groupsKpis.length; i++) {
						                	  	var groupsKpi = groupsKpis[i] ;
							                	result[i] = { value: groupsKpi.code, label: groupsKpi.name} ;
						                    }
						                  return result ;
						                }
						              }
						            }
						   },
					   {
							field: "typeRate", label: "Loại đánh giá", 
							custom: {
								  set: function(bean,thisUI){},
				                  getDisplay: function(bean) {
				                    if(bean.type=='value'){
				                    	return "Giá trị";
				                    }else {
								  	    return "Xếp loại";
									}
				                  }
							 },
							defaultValue: "value",
				              select: {
				                  getOptions: function(field, bean) {
				                    var options = [
				                      { label: "Giá trị", value: 'value' },
				                      { label: "Xếp loại", value: 'rate'}
				                    ];
				                    return options ;
				                  }
				                }
						},
					   {
						   field: "description", label: "Miêu tả", textarea: {}  
					   }
					],
				},
			},
		},
		test: function(thisUI,bean){
			var beanState = thisUI.getBeanState('kpiAccount');
			var kpiConfig = this.getBeanConfig('kpiAccount');
			if(bean.type == "ORGANIZATION")
				{
				 var accounts = service.AccountService.findAccountByType(bean.type).data ;
				 beanState.search = accounts[0].name;
				 beanState.isCheck = true;
				 bean.path = accounts[0].loginId ;
             	 bean.nameObject = accounts[0].name;
             	kpiConfig.disableField('path', true) ;
				}
			else{
				beanState.isCheck = false;
				kpiConfig.disableField('path', false) ;
				beanState.search = null;
				}
				
		},
		init: function(UIParent, kpiAccount, isNew){
			this.UIParent = UIParent;
			this.bind('kpiAccount', kpiAccount, true) ;
			var kpiConfig = this.getBeanConfig('kpiAccount');
			var beanState = this.getBeanState('kpiAccount');
			beanState.search = kpiAccount.nameObject;
			var businessInformation = service.AccountService.getBusinessInformation().data;
			if(kpiAccount.path == businessInformation.loginId){
				kpiConfig.disableField('path', true) ;
			}
			beanState.editMode = true;
			if(!isNew) {
				for(var i = 0; i< kpiConfig.beanConfig.fields.length; i++){
					kpiConfig.disableField(kpiConfig.beanConfig.fields[i].field, true) ;
				}
			}	
			return this;
		},
	});	
	
	var UIKpiAccountDetail = UICollapsible.extend({
		label: "Thiết lập",
		config: {
			actions: [
			{
				 action: "edit", label: "Sửa", icon: "edit",
		          onClick: function(thisUI) {
		        	var kpiConfig = thisUI.UIKpiAccount.getBeanConfig('kpiAccount');
		  			for(var i = 0; i< kpiConfig.beanConfig.fields.length; i++){
		  				if(kpiConfig.beanConfig.fields[i].field == 'code'){
		  					kpiConfig.disableField(kpiConfig.beanConfig.fields[i].field, true) ;
		  				}else{
		  					kpiConfig.disableField(kpiConfig.beanConfig.fields[i].field, false) ;
		  				}
					}
		  			thisUI.UIKpiAccount.render();
		          }
			},
			{
		          action: "save", label: "Lưu", icon: "check",
		          onClick: function(thisUI) {	
		        	if(!thisUI.UIKpiAccount.validate()) {
		               thisUI.render() ;
		               return ;
		            }

		            var kpi = thisUI.kpiAccount;
		            kpi.valueChanges = thisUI.UIValueChange.getBeans();
		            for(var i = 0; i<kpi.valueChanges.length; i++){
		            	kpi.valueChanges[i].kpiAccountCode = kpi.code;
		            }
		            service.KpiService.saveKpiAccount(kpi) ;
		            if(thisUI.UIParent.back) thisUI.UIParent.back(true) ;
		            thisUI.UIParent.onAddBean();

		          }
		        },
				{
					 action: "back", label: "Thoát", icon: "back",
			          onClick: function(thisUI) {
			        	  UIPopup.closePopup() ;
			          }
				},
			]
		},
	    init: function(UIParent, kpiAccount, isNew) {
	        this.clear() ;
	        
	        this.UIParent = UIParent ;
	        this.kpiAccount = kpiAccount ;
	        this.UIKpiAccount = new UIKpiAccount().init(this,kpiAccount, isNew);
	        this.add(this.UIKpiAccount) ;
	        kpiAccount.valueChanges.codeKpiAccount = kpiAccount.code;
	        this.UIValueChange = new ValueChange.UIValueChangeList().init(this,kpiAccount);
	        this.add(this.UIValueChange);
	        this.editMode(isNew);
	        if(isNew){
	        	var kpiConfig = this.hidenButton('edit');
	        }
	        return this ;
	      },
	      onHidePopup: function(thisUI){
	    	  UIPopup.activate(thisUI.init(thisUI, thisUI.kpiAccount, true)) ;
	      }
	});
	
	var KpiAccount = {
			UIKpiAccount: UIKpiAccount,
			UIKpiAccountDetail : UIKpiAccountDetail
	};
	
	return KpiAccount;
});