define([
  'jquery',
  'service/Server',
], function($, Server) {
	
  var config = null;
  /**@type service.AccountService */
  var AccountService = {
    /**@memberOf service.AccountService*/
    cleanAccountDB : function(scenario) {
      var request = { 
        module : 'account', service : 'AccountService', method : 'deleteAll',
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    getProfileConfig : function() {
    	if(config==null){
    		config = this.getBusinessInformation().data;
    	}
    	if(config.profiles.config!=null){
    		return config.profiles.config;	
    	}else{
    		return [];
    	}
      
    },
    
    /**@memberOf service.AccountService*/
    createScenario : function(scenario) {
      var request = {
        module : 'account', service : 'AccountService', method : 'createScenario',
        params : { scenario : scenario }
      };
      return Server.POST(request);
    },

    /**@memberOf service.AccountService*/
    getAccountGroupByCode : function(loginId) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getAccountGroupByCode',
        params : { loginId : loginId }
      };
      return Server.POST(request);
    },
    
    
    /**@memberOf service.AccountService*/
    getAccountByLoginId : function(loginId) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getAccountByLoginId',
        params : { loginId : loginId }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    getAccountGroupByParentCode : function(code) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getAccountGroupByParentCode',
        params : { code : code }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    saveAccount : function(account) {
      var request = {
        module : 'account', service : 'AccountService', method : 'saveAccount',
        params : { account : account }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    deleteAccountByLoginId : function(loginId) {
      var request = {
        module : 'account', service : 'AccountService', method : 'deleteAccountByLoginId',
        params : { loginId : loginId }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    findAccountByLoginId : function(loginId, type) {
      var request = {
        module : 'account', service : 'AccountService', method : 'findAccountByLoginId',
        params : { logingId: loginId , type: type}
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    findAccountByName : function(loginId) {
      var request = {
        module : 'account', service : 'AccountService', method : 'findAccountByName',
        params : { logingId: loginId}
      };
      return Server.POST(request);
    },
    
    
    /**@memberOf service.AccountService*/
    filterAccount : function(query) {
      var request = {
        module : 'account', service : 'AccountService', method : 'filterAccount',
        params : { query: query }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    getAccountByUser : function() {
        var request = {
                module : 'account', service : 'AccountService', method : 'getAccountByUser',
                params : {}
              };
              return Server.POST(request);
            },
    /**@memberOf service.AccountService*/
    searchAccounts : function(query) {
      var request = {
        module : 'account', service : 'AccountService', method : 'searchAccounts',
        params : { query: query }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    getAccountGroupByResponsible : function(code) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getAccountGroupByResponsible',
        params : { code : code }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    saveGroup : function(group) {
      var request = {
        module : 'account', service : 'AccountService', method : 'saveGroup',
        params : { group : group }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    getGroupByCode : function(code) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getByCode',
        params : { code : code }
      };
      return Server.POST(request);
    },

    
    /**@memberOf service.AccountService*/
    findAllAccountGroup: function() {
      var request = {
          module : 'account', service : 'AccountService', method : 'findAllAccountGroup',
          params : {}
          };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    deleteGroup : function(group) {
      var request = {
        module : 'account', service : 'AccountService', method : 'deleteGroup',
        params : { group : group }
      };
      return Server.POST(request);
    },
    
    
    /**@memberOf service.AccountService*/
    getGroupDetailByCode : function(path) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getGroupDetailByCode',
        params : { path : path }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    getByLoginIds : function(loginId) {
      var request = {
        module : 'account', service : 'AccountService', method : 'getByLoginIds',
        params : { loginId : loginId }
      };
      return Server.POST(request);
    },
    
    /**@memberOf service.AccountService*/
    createMembership : function(loginId, groupPath, cap) {
      var request = {
        module : 'account', service : 'AccountService', method : 'createMembership',
        params : { loginId: loginId, groupPath: groupPath, cap : cap }
      };
      return Server.POST(request);
    },
    
    saveAccountMembership : function(accountMembership) {
      var request = {
        module : 'account', service : 'AccountService', method : 'saveAccountMembership',
        params : { accountMembership : accountMembership }
      };
      return Server.POST(request);
    },
    
    getMembershipByAccountAndGroup : function(loginId, groupPath) {
        var request = {
          module : 'account', service : 'AccountService', method : 'getMembershipByAccountAndGroup',
          params : { loginId: loginId, groupPath: groupPath}
        };
        return Server.POST(request);
      },
    
    /**@memberOf service.AccountService*/
    deleteMembership : function(accountMembership) {
      var request = {
        module : 'account', service : 'AccountService', method : 'deleteMembership',
        params : { accountMembership: accountMembership}
      };
      return Server.POST(request);
    },
    deleteMembershipByLoginIdAndGroupPath: function(loginId, groupPath) {
        var request = {
                module : 'account', service : 'AccountService', method : 'deleteMembershipByLoginIdAndGroupPath',
                params : { loginId: loginId, groupPath: groupPath}
              };
              return Server.POST(request);
            },
    findMembershipByGroupPath : function(path) {
      var request = {
        module : 'account', service : 'AccountService', method : 'findMembershipByGroupPath',
        params : { path: path }
      };
      return Server.POST(request);
    },
    
    findMembershipByAccountLoginId : function(loginId) {
        var request = {
          module : 'account', service : 'AccountService', method : 'findMembershipByAccountLoginId',
          params : { loginId: loginId }
        };
        return Server.POST(request);
      },
    
    /**@memberOf service.AccountService*/
    findGroupByName : function(name) {
      var request = {
        module : 'account', service : 'AccountService', method : 'findGroupByName',
        params : {name: name}
      };
      return Server.POST(request);
    },

    getAllMemberShipByPath: function(path){
        var request = {
                module : 'account', service : 'AccountService', method : 'getAllMemberShipByPath',
                params : { path: path }
              };
              return Server.POST(request);
    },
    getBusinessInformation: function(){
        var request = {
                module : 'account', service : 'AccountService', method : 'getBusinessInformation',
                params : {}
              };
              return Server.POST(request);
    },
    
    findAccountByType: function(type){
        var request = {
                module : 'account', service : 'AccountService', method : 'findAccountByType',
                params : { type: type }
              };
              return Server.POST(request);
    },
    
    getAccountByDeparment: function(code){
      var request = {
        module : 'account', service : 'AccountService', method : 'getAccountByDeparment',
        params : { code: code }
      };
      return Server.POST(request);
    },
  };
  
  return AccountService ;
});
