define([
  'jquery', 
  'underscore', 
  'backbone',
  'util/DateTime',
  'module/Module',
  'ui/UIBreadcumbs',
  'ui/UICollapsible',
  'ui/UIBean',
  'ui/UITable',
  'module/kpi/UITreeKPI',
  'service/service',
  'ui/UIPopup',
  'module/kpi/ValueChangeKpi',
], function($, _, Backbone, DateTime, module, UIBreadcumbs, 
            UICollabsible, UIBean, UITable, UITreeTable,service,UIPopup,ValueChange) {
	
	var UIKpiAccount = UIBean.extend({
		label: "Chọn đối tượng",
		config: {
			beans: {
				kpiAccount: {
					label: "Chọn đối tượng",
					fields: [
					        
{field: "type", label: "Loại đối tượng", required: true,
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
			set: function(bean,thisUI){thisUI.test(thisUI, bean);},
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
	field: "nameObject", label: "Đối tượng", required: true,
	custom: {
        getDisplay: function(bean) { return bean.path == null ? null : bean.nameObject; },
        set: function(bean, obj) { bean.path = obj.value ;
        						   bean.nameObject = obj.label;
        						   bean.name = obj.name;},
        autocomplete: {
          search: function(val, bean) {
           var result = [] ;

           if(bean.type == "Deparment")
           	   {
        	   var deparments = service.AccountService.findGroupByLabel(val).data ;
               for(var i = 0; i < deparments.length; i++) {
                  var deparment = deparments[i] ;
                  result[i] = { value: deparment.path, label:  deparment.label, name: deparment.name } ;
                 }
               }
           else
        	   {
                    var accounts = service.AccountService.findAccountByLoginId(val, bean.type).data ;
                    for(var i = 0; i < accounts.length; i++) {
                      var account = accounts[i] ;
                      result[i] = { value: account.loginId, label: account.name, name : ""} ;
                    }
        	   }
            return result ;
          }
        }
      }
},   
{
	label: "Năm", field: 'yearTime', required: false,filterable: true,toggled: true,
	defaultValue: Number(DateTime.fromDateTimeToYYYY(DateTime.getCurrentDate())),
	fieldLoad: "valueTime",
      select: {
          getOptions: function(field, bean) {
        	    var date = DateTime.getCurrentDate();
                var options = DateTime.fromDateTimeToYYYY(date) ;
                var result = [] ;
                for(var i = 0; i < 5; i++) {
                  var year = Number(options)-i;
                  result[i] = { label: year , value: year } ;
                }
                return result ;
          }
        }
},
{
field: "typeTime", label: "Loại thời gian", toggled:true,filterable: true,
 custom: {
	 set: function(bean,thisUI){},
      getDisplay: function(bean) {
        if(bean.typeTime=='year'){
        	return "Năm";
        }else {
			if(bean.typeTime=='month'){
				return "Tháng";
			}else {
				return "Quý";
			}
		}
      }
 },
defaultValue: "year",
fieldLoad: "valueTime",
  select: {
      getOptions: function(field, bean) {
        var options = [
          { label: "Năm", value: 'year' },
          { label: "Quý", value: 'quarterly'},
          { label: "Tháng", value: 'month'}
        ];
        return options ;
      }
    }
  
},
{
label: "Thời gian", field: 'valueTime', required: false,filterable: true,toggled: true,
  select: {
      getOptions: function(field, bean) {
    	 if(bean.typeTime=='year'){
            var result = [] ;
            if(bean.yearTime==0){
            	bean.yearTime=Number(DateTime.fromDateTimeToYYYY(DateTime.getCurrentDate()));
            }
            result[0] = { label: bean.yearTime , value: bean.yearTime } ;
            return result ;
    	 }else {
    		 if(bean.typeTime=='month'){
    			 var result = [] ;
                 for(var i = 1; i <= 12; i++) {
                    result[i-1] = { label: i , value: i } ;
                 }
                 return result ;
    		 }else {
    			 var result = [] ;
                 for(var i = 1; i <= 4; i++) {
                    result[i-1] = { label: i , value: i } ;
                  }
                 return result ;
			}
    		
		} 
      }
    }
},
					],
			          edit: {
			              disable: false ,
			              actions: [
			                {
			                  action:'save', label: "Lưu", icon: "check",
			                  onClick: function(thisUI) { 
			                	  var kpiAccount = thisUI.getBean('kpiAccount') ;
			                	  thisUI.UIParent.codeObject = kpiAccount.path;
			                	  thisUI.UIParent.nameObject = kpiAccount.nameObject;
			                	  thisUI.UIParent.valueTime = kpiAccount.valueTime;
			                	  thisUI.UIParent.yearTime = kpiAccount.yearTime;
			                	  thisUI.UIParent.typeTime = kpiAccount.typeTime;
			                	  thisUI.UIParent.type = kpiAccount.type;
			                	  thisUI.UIParent.render();
			                	  thisUI.UIParent.onRefresh();
			                	  UIPopup.closePopup() ;
			                	  
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
             	 kpiConfig.disableField('nameObject', true) ;
				}
			else{
				beanState.isCheck = false;
				kpiConfig.disableField('nameObject', false) ;
				beanState.search = null;
				}
				
		},
		init: function(UIParent, kpiAccount){
			this.UIParent = UIParent;
			this.bind('kpiAccount', kpiAccount, true) ;
			var kpiConfig = this.getBeanConfig('kpiAccount');
			this.getBeanState('kpiAccount').editMode = true;
			return this;
		},
	});	
	
  var UITreeTableSample = UITreeTable.extend({
    label: "Tree Table",

    config: {
      toolbar: {
        dflt: {
          actions: [
            {
              action: "onRefresh", icon: "refresh", label: "Đối tượng", 
              onClick: function(thisTable) { 
            	  var object = {};
		    	  UIPopup.activate(new UIKpiAccount().init(thisTable, object));
		    	  
              } 
            }
          ]
        }
      },
      
      bean: {
        label: 'Contact Bean',
        fields: [
                 { 
               	  field: "valueTarget", label: "Kế hoạch", defaultValue: 'default value', 
                   toggled: true, filterable: true
                 },
                 { 
               	  field: "valueActual", label: "Thực hiện", defaultValue: 'default value', 
                   toggled: true, filterable: true
                 },
                 { 
               	  field: "perfect", label: "Hoàn thành(%)", defaultValue: 'default value', 
                   toggled: true,
                   custom: {
 					  getDisplay: function(bean) {
 						if(bean.valueActual!=null && bean.valueActual!="undefined"){
 							if(bean.valueActual>0){
 	 				           return bean.valueActual/bean.valueTarget*100;
 	 				        }else {
 	 				           return 0;
 	 						}
 						}else{
 							return "";
 						}
 				        
 				      }
 					}
                 },
                 { 
               	  field: "rateName", label: "Đánh giá", defaultValue: 'default value', 
                   toggled: true, filterable: true
                 },
                 
                 { 
               	  field: "solution", label: "Biện pháp", defaultValue: 'default value', 
                   toggled: true
                 },
               ],
        actions: [
				     {
				    	 icon: "edit", label: "Sửa",
				    	 onClick: function(thisUI, row){
				    		 var node = thisUI.getNode(row);
				    		 if(node.index==0){
				    			 var today = new Date();
				                  var codeString = moment(today).format('YYYYMMDDHHmmss') ;
				    			 var valueChage = {code: codeString, valueTime: thisUI.valueTime,
				    					 typeTime: thisUI.typeTime, yearTime: thisUI.yearTime};
				    			 thisUI.codeGroup = node.bean.code;
				    			 var aview = new ValueChange.UIValueChangeList().init(thisUI,valueChage, true);
					    		 UIPopup.activate(aview);
				    		 }else{
				    			 var aview = new ValueChange.UIValueChangeList().init(thisUI,node.bean, false);
					    		 UIPopup.activate(aview);
				    		 }
				    		 
				    	 }
				     } ,
				     ]
      }
    },
    
    onRefresh: function() {
    	if(this.typeTime=='year'){
    		this.nameTime = "Năm: " + this.valueTime;
          }else {
				if(this.typeTime=='month'){
					this.nameTime = "Tháng: " +this.valueTime +"/"+this.yearTime;
				}else {
					this.nameTime = "Quý: " +this.valueTime +"/"+this.yearTime;
				}
			}
    	var nodes=[];
    	this.setNodes(nodes);
  	  var result = service.KpiService.getAllGroupKpi();
        var valueTime= this.valueTime;
        for(var i = 0; i< result.length; i++){
      	  var node_1 = this.addNode(result[i],result[i].name);
      	  node_1.setCollapsed(false);
      	  if(this.codeObject!=null){
      		var kpiAccounts = service.KpiService.getAllKpiAccountByCodeGroup(result[i].code,this.codeObject).data;
        	  if(kpiAccounts!=null){
        		  for(var j = 0; j< kpiAccounts.length; j++){
  	        		  if(kpiAccounts[j] !=null){
  	        			  var valueChages = kpiAccounts[j].valueChanges;
  	            		  for(var k = 0; k< valueChages.length; k++){
  	            			  if(valueChages[k].valueTime ==valueTime){
  	            				  node_1.addChild(valueChages[k],kpiAccounts[j].name);
  	            			  }
  	                		  
  	                	  }
  	        		  }
  	        		  
  	        	  } 
        	  }
      	  }
      	  
      	  
        }
        this.render();
	}
  });
  
  var UISamples = module.UIScreen.extend({
    initialize: function (options) {
    },

    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      
      var uiTreeTableSample = new UITreeTableSample() ;
      var result = service.KpiService.getAllGroupKpi();
      var valueTime=Number(DateTime.fromDateTimeToYYYY(DateTime.getCurrentDate()));
      for(var i = 0; i< result.length; i++){
    	  var node_1 = uiTreeTableSample.addNode(result[i],result[i].name);
    	  node_1.setCollapsed(false);
    	  var kpiAccounts = service.KpiService.getAllKpiAccountByCodeGroup(result[i].code,"HKT").data;
    	  for(var j = 0; j< kpiAccounts.length; j++){
    		  if(kpiAccounts[j] !=null){
    			  var valueChages = kpiAccounts[j].valueChanges;
    			  var b = false;
        		  for(var k = 0; k< valueChages.length; k++){
        			  if(valueChages[k].valueTime ==valueTime){
        				  b = true;
        				  node_1.addChild(valueChages[k],kpiAccounts[j].name);
        			  }
            		  
            	  }
        		  if(b==false){
        			  var valueChage = {};
        			  node_1.addChild(valueChage,kpiAccounts[j].name);
        		  }
    		  }
    		  
    	  }
      }
      
      this.viewStack.push(uiTreeTableSample) ;
    },
    
    deactivate: function() { }
    
  });
  
  return UISamples ;
});
