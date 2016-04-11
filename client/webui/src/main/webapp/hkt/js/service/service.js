define([
  'jquery',
  'service/Server',
  'service/ServerService',
  'service/AccountService',
  'service/CMSService',
  'service/UIConfigServer',
  'service/KpiService'
], function($, Server, ServerService, AccountService, CMSService,UIConfigServer, KpiService) {
  var service = {
    /**@type service.Server */
    Server: Server,
    
    /**@type service.ServerService */
    ServerService: ServerService,
    
    /**@type service.AccountService */
    AccountService: AccountService,
    
    /**@type service.AccountService */
    CMSService: CMSService,
    
    /**@type service.UIConfigServer */
    UIConfigServer: UIConfigServer,
    
    /**@type KpiService */
    KpiService: KpiService
  };

  return service ;
});
