define([ 
  'jquery', 
  'service/Server' 
], function($, Server) {
  /** @type service.ServerService */
  var ServerService = {
    getRestMonitor : function() {
      var request = {
        module : 'core', service : 'ServerService', method : 'getRestMonitor',
      };
      return Server.POST(request);
    },
    
    getMonitorSummaries : function() {
      var request = {
        module : 'core', service : 'ServerService', method : 'getMonitorSummaries',
      };
      return Server.POST(request);
    },
    
    getMonitorData : function(name) {
      var request = {
        module : 'core', service : 'ServerService', method : 'getMonitorData',
        params: {name: name}
      };
      return Server.POST(request);
    }
   
  };

  return ServerService;
});