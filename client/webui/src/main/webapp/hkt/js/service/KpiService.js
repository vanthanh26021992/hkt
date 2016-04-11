/**
 * 
*/
define([
	'jquery',
	'service/Server',
], function ($, Server){
	var KpiService= {
			getCityByCode: function(code){
				var request={
						module: 'kpi', service:'KpiService', method: 'getCityByCode',
						params: {code: code}
				};
				return Server.POST(request);
			},
			getCityByCodeCountry:function(codeCountry){
				var request= {
						model: 'kpi', service: 'KpiService', method:'getCityByCodeCountry',
						params: {codeCountry:codeCountry}
				};
				return Server.POST(request);
			},
			getAllCity : function() {
			      var request = { 
			        module : 'kpi', service : 'KpiService', method : 'getAllCity',
			        params : {}
			      };
			      return Server.POST(request);
			 },
			 saveCity : function(city) {
			      var request = {
			        module : 'kpi', service : 'KpiService', method : 'saveCity',
			        params : { city : city }
			      };
			      return Server.POST(request);
			 },
			 deleteCity : function(city) {
			      var request = {
			        module : 'kpi', service : 'KpiService', method : 'deleteCity',
			        params : { city : city }
			      };
			      return Server.POST(request);
			 },
			    
	};
	return KpiService;
}); 