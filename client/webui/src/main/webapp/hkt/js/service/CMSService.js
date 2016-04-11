define([
    'jquery', 'service/Server'
], function($, Server) {
  /** @type service.CMSService */
  var CMSService = {
    module : 'cms',
    service : 'CMSService',

    /** @memberOf service.CMSService */
    ping : function() {
      var request = {
        module : this.module, service : this.service, method : 'ping',
        params : {}
      };
      return Server.POST(request);
    },

    /** @memberOf service.CMSService */
    createScenario : function(scenario) {
      var request = {
        module : 'cms', service : 'CMSService', method : 'createScenario',
        params : {
          scenario : scenario
        }
      };
      return Server.POST(request);
    },

    /** @memberOf service.CMSService */
    cleanData : function(scenario) {
      var request = {
        module : 'cms', service : 'CMSService', method : 'deleteAll',
      };
      return Server.POST(request);
    },
   
    /** @memberOf service.CMSService */
    getNodebyPath : function(path) {
      var request = {
        module : 'cms',  service : 'CMSService', method : 'getNodeByPath',
        params : { path : path }
      };
      return Server.POST(request);
    },

    /** @memberOf service.CMSService */
    deleteNode : function(node) {
      var request = {
        module : 'cms', service : 'CMSService', method : 'deleteNode',
        params : { node : node }
      };
      return Server.POST(request);
    },

    /** @memberOf service.CMSService */
    createNode : function(parentPath, node, attributes) {
      var request = {
        module : 'cms', service : 'CMSService', method : 'createNode',
        params : {
          parentPath : parentPath, node : node, attributes : attributes
        }
      };
      return Server.POST(request);
    },

    /** @memberOf service.CMSService */
    getNodeDetail : function(path) {
      var request = {
        module : 'cms', service : 'CMSService', method : 'getNodeDetail',
        params : { path : path }
      };
      return Server.POST(request);
    },
    
    /** @memberOf service.CMSService */
    updateNode : function(node, attrs){
      var request = {
          module : 'cms', service : 'CMSService', method : 'updateNode',
          params : { node : node, attrs : attrs }
      };
      return Server.POST(request);
    },
    
    /** @memberOf service.CMSService */
    addTemplate : function(template){
      var request = {
        module : 'cms', service : 'CMSService', method : 'addTemplate',
        params : { template : template }
      };
      return Server.POST(request);
    },
    
    /** @memberOf service.CMSService */
    getTemplate : function(mimeType){
      var request = {
        module : 'cms', service : 'CMSService', method : 'getTemplate',
        params : { mimeType : mimeType }
      };
      return Server.POST(request);
    },
    
    createAttribute : function(nodeAttribute){
      var request = {
          module : 'cms', service : 'CMSService', method : 'createAttribute',
          params : { nodeAttribute : nodeAttribute }
        };
        return Server.POST(request);
      },
   
  // END
  };
  return CMSService;
});
