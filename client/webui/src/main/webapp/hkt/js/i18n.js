define([
  'jquery',
  'service/service'
], function($, service) {
  var Resource = function(component, language) {
    this.resource = service.Server.syncGET(component + '_' + language + ".json") ;
    var instance = this ;
    
    this.res = function(key, params) {
      var val = instance.resource[key] ;
      if(val == null) return key ;
      return val ;
    }
  };
  
  var i18n = {
    selectLanguage: 'vn',
    
    availableLanguages: [
      {label: 'Tiếng Việt', code: 'vn'},
      {label: 'English',  code: 'en'}
    ],
   
    resources: {} ,
    
    changeLanguage: function(language) {
      this.selectLanguage = language ;
    },
    
    getResource: function(resource) {
      if(this.resources[resource] == null) {
        var res = new Resource(resource, this.selectLanguage) ;
        this.resources[resource] = res.res ;
      }
      return this.resources[resource] ;
    }
  }
  return i18n ;
});
