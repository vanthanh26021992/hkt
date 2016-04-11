define([
  'service/service',
  'ui/UIBean',
  'ui/UIPopup',
], function( service, UIBean, UIPopup) {
  
  var UIGroup = UIBean.extend({
    label: "Phòng ban",
    config: {
      beans: {
        group: {
          label: 'Phòng ban',
          fields : [
            { field: "code", label: "Mã", required: true, validator: {name: "empty"} },
            { field: "name", label: "Tên", validator: {name: "empty"}  },
            {
				   label: "Phòng ban cha", field: 'parentCode', toggled: true, filterable: true,
		            custom: {
			              getDisplay: function(bean) {
			            	if(bean.parentCode == null)
			            		return null;
			            	else{
			            		parent = service.AccountService.getAccountGroupByCode(bean.parentCode).data;
			            		if(parent!=null){
			            			return parent.name;
			            		}else{
			            			return bean.parentName;
			            		}
			            		
			            	}
			              },
			              set: function(bean, obj, thisUI) {
			              if(obj.parent == undefined){
			            	  bean.parentCode = obj.value; 
			            	  bean.parentName=obj.label;
			              }
			              else{
			            	  bean.parentCode = obj.value; 
			            	  bean.parentName=obj.label;
			              }
			              },
			              autocomplete: {
			                search: function(val) {
			                  var result = [] ;
			                  var groups = service.AccountService.findGroupByName(val).data;
			                  for(var i = 0; i < groups.length; i++) {
			                	  	var group = groups[i] ;
				                	result[i] = { value: group.code, label: group.name, parent: group.parentCode} ;
			                    }
			                  return result ;
			                }
			              }
			            }
			   },
			   {
				   label: "Người chịu trách nhiệm", field: 'responsible', toggled: true, filterable: true,
		            custom: {
			              getDisplay: function(bean) {
			            	if(bean.responsible == null)
			            		return null;
			            	else{
			            		var responsible = service.AccountService.getAccountByLoginId(bean.responsible).data;
			            			return responsible.name;
			            		
			            	}
			              },
			              set: function(bean, obj) {
			            	  bean.responsible = obj.value;
			              },
			              autocomplete: {
			                search: function(val) {
			                  var result = [] ;
			                  var accounts = service.AccountService.findAccountByLoginId(val, "USER").data ;
			                    for(var i = 0; i < accounts.length; i++) {
			                      var account = accounts[i] ;
			                      result[i] = { value: account.loginId, label: account.name} ;
			                    }
			                  return result ;
			                }
			              }
			            }
			   },
            { field: "description", label: "Miêu tả", textarea: {} },
          ],
          edit: {
            disable: true,
            actions:[
              { 
                action:'save', label: "Lưu", icon: "check", 
                onClick: function(thisUI) {
                  if(!thisUI.validate()) {
                    thisUI.render() ;
                    return ;
                  }
                  var group = thisUI.getBean('group') ;
                  service.AccountService.saveGroup(group) ;
                  thisUI.Groups.onRefresh() ;
                  UIPopup.closePopup() ; 
                } 
              },
              { 
                  action:'edit', label: "Sửa", icon: "edit", 
                  onClick: function(thisUI) {
                	  for(var i= 0; i< thisUI.config.beans.group.fields.length; i++){
                		  var field = thisUI.config.beans.group.fields[i];
                		  var groupConfig = thisUI.getBeanConfig('group') ;
                		  if(field.field != 'code'){
                			  groupConfig.disableField(field.field, false);
                		  }
                	  }
                	  thisUI.render();
                  } 
                },
              { 
                action:'cancel', label: "Thoát", icon: "back",
                onClick: function(thisUI) { 
                  UIPopup.closePopup() ; 
//                  thisUI.Groups.viewStack.back() ;
                }
              }
            ]
          }
        }
      }
    },
    
    init: function(Groups, parentCode, group, isNew, isPopup) {
      this.Groups = Groups ;
      this.isNew = isNew ;
      this.bind('group', group) ;
      var groupConfig = this.getBeanConfig('group') ;
      groupConfig.disableEditAction(false) ;
      this.getBeanState('group').editMode = true ;
      if(!isNew){
    	  groupConfig.hidenButton('edit', true) ;
    	  groupConfig.disableField('code', true);
      }else{
    	  for(var i = 0; i< groupConfig.beanConfig.fields.length;i++){
    		  var field = groupConfig.beanConfig.fields[i];
    		  groupConfig.disableField(field.field , true);
    	  }
      }
      if(isPopup){
    	  groupConfig.hidenButton('save', true); 
    	  var fields = groupConfig.beanConfig.fields;
    	  for(var i = 0; i< fields.length; i++){
    		  var field = fields[i];
    		  groupConfig.disableField(field.field, true);
    	  }
      }
    	  beanState =  this.getBeanState('group');
    	  beanState.bean.parentCode = parentCode;
      return this ;
    },
  });
  
 var Group = {
     UIGroup: UIGroup
 };
  
  return Group ;
});
