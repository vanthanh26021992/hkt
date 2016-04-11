/**
 * Edit by Bui Trong Hieu 
 */
define([
   'jquery',
   'service/Server',
], function($, Server){
	var UIConfigServer = {
			getUIConfig : function(loginId){
				var request = {
						module: 'config', service: 'UIConfigService', method: 'getUIConfig'
				};
				return Server.POST(request);
			},
			setUIConfigTeamplate : function(config){
				var request = {
						module: 'config', service: 'UIConfigService', method: 'setUIConfigTeamplate'
				};
				return Server.POST(request);
			},
	};
	return UIConfigServer;
});