define([
  'service/service',
  'ui/UIPopup',
  'ui/UICollapsible',
  'ui/UIBean',
], function(service, UIPopup, UICollapsible, UIBean) {  
  var UIMembership = UIBean.extend({
    label: "Membership",
    config: {
      beans: {
        membership: {
          label: 'Membership',
          fields: [
            { 
                field: "nameEmployee", label: "Tên", required: true,
    			custom: {
  		          getDisplay: function(bean) {
  		            if(bean.loginId == null){
  		               return null;
  		            }else {
  		            	var account = service.AccountService.getAccountByLoginId(bean.loginId).data ;
  		            	return account.name;
  				    }
  		          },
  		        }
              },

            { field: "role",  label: "Quyền", toggled: true,
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
			          set: function(bean, obj) { bean.role = obj.value ;},
                autocomplete: {
                  search: function(val) {
                    var positions = service.KpiService.findPositonByName(val).data ;
                    var result = [] ;
                    for(var i = 0; i < positions.length; i++) {
                      var position = positions[i] ;
                      result[i] = {value: position.code, label: position.name} ;
                    }
                    return result ;
                 }
                }
			        }
            },
            { label: 'Miêu tả', field: 'description', toggled: true, filterable: true },
          ],
          edit: {
            disable: true , 
            actions: [
              {
                action:'save', label: "Lưu", icon: "check",
                onClick: function(thisUI, beanConfig, beanState) { 
                  if(!thisUI.validate()) {
                    thisUI.render() ;
                    return ;
                  }
                  var membership = thisUI.getBean('membership') ;
                  service.AccountService.saveAccountMembership(membership).data ;
                  
                  if(thisUI.UIParent.onRefresh != null) {
                    thisUI.UIParent.onRefresh(membership.groupPath) ;
                  }
                  UIPopup.closePopup() ;
                }
              },
              {
                action:'cancel', label: "Thoát", icon: "back",
                onClick: function(thisUI, beanConfig, beanState) { 
                  UIPopup.closePopup() ;
                }
              }
            ],
          }
        }
      }
    },
    
    init: function(UIParent, membership, isNew) {
      this.UIParent = UIParent ;
      this.bind('membership', membership) ;
      var config = this.getBeanConfig('membership') ;
      this.getBeanState('membership').editMode = true ;
      config.disableEditAction(false) ;
      if(!isNew){
    	  for(var i = 0; i< config.beanConfig.fields.length; i++){
    		  config.disableField(config.beanConfig.fields[i].field, true) ;
			}
      }
      return this ;
    },
    
  });
  
  var Membership = {
    UIMembership : UIMembership,
  };
  
  return Membership ;
});
