define([
'service/service',
'module/setting/BusinessInformations',
'module/account/Group',
'module/kpi/BalanceCard',
'util/DateTime',
],function(service,BusinessInformations,Group,BalanceCard,DateTime){
	var Department = function(viewStack) {
		this.viewStack = viewStack;
		var businessInformation = service.AccountService.getBusinessInformation().data;
		this.uiBalanceCardDetail = new BalanceCard().uiBalanceCardDetail;
		this.uiBalanceCardDetail.initDetail(this.viewStack);
		this.gui = function(code, name) {
	    return this.uiBalanceCardDetail;
		};
		var a = this.gui(businessInformation.loginId, businessInformation.name);
		
       var aview = new BusinessInformations().UIAccountDetail.init(this.viewStack, businessInformation, true);
       if(businessInformation.profiles.basic.department!=null){
    	   var group = service.AccountService.getAccountGroupByCode(businessInformation.profiles.basic.department).data;
    	   businessInformation.loginId= group.code;
       }
		var nodeStructure = {text:{name:"hkt"},children:[],index: 2};
		var text = {
		  name: businessInformation.name,
		  code: businessInformation.loginId,
		  contact: {val: "BSC", href: " ", gui: a},
		  gui: aview,
		  
		  viewStack: this.viewStack,
		};
		nodeStructure.text = text;
		var groups = service.AccountService.getAccountGroupByParentCode("").data ;
		var children= [];
		var index = 5;
		this.getChild= function(groups1,children) {
			var children1= [];
			
			for(var i = 0; i< groups1.length; i++){
				var group = groups1[i];
				var depas = new Group.UIGroup().init(this, null, group, false);
				var kpi = this.gui(group.code, group.name);
				var groups2 = service.AccountService.getAccountGroupByParentCode(group.code).data;
				if(groups2.length>0){
				  children1[i]={
				    text:{name: group.name,code: group.code,gui: depas,contact: {val: "BSC", href: " ", gui: kpi},viewStack: this.viewStack,},
				    stackChildren: true,
				    children: [],
				  };
				  this.getChild(groups2,children1[i]);
				}else{
				  children1[i]={
					text:{name: group.name,code: group.code,gui: depas,contact: {val: "BSC", href: " ", gui: kpi},viewStack: this.viewStack,},
					children: [],
				  };
				  this.getChild(groups2,children1[i]);
				}
			}
			if(children1.length>0){
			  children.children=children1;	
			}
			
		};
		
		for(var i = 0; i < groups.length; i++){
			var group = groups[i];
			var kpi = this.gui(group.code, group.name);
			var depas = new Group.UIGroup().init(this, null, group, false);
			var groups1 = service.AccountService.getAccountGroupByParentCode(group.code).data;
			if(groups1.length>0){
			   children[i]={
				 text:{name: group.name,code: group.code,gui: depas,contact: {val: "BSC", href: " ", gui: kpi},viewStack: this.viewStack,},
				 stackChildren: true,
				 children: [],
			   };
			   this.getChild(groups1,children[i]);
			}else{
				children[i]={
				   text:{name: group.name,code: group.code,gui: depas,contact: {val: "BSC", href: " ", gui: kpi},viewStack: this.viewStack,},
				   children: [],
				};
				this.getChild(groups1,children[i]);
			}
		}
		nodeStructure.index = index;
		nodeStructure.children=children;
		    this.chart_config = {
		        chart: {
		            container: "#Department",
		            rootOrientation:  'NORTH', // NORTH || EAST || WEST || SOUTH
		            connectors: {
		                type: 'step',
		                style: {
		    				"stroke-width": 2
		    			}
		            },
		            node: {
		                HTMLclass: 'nodeExample1'
		            }
		        },
		        nodeStructure: nodeStructure,
		        index : nodeStructure.index
		       
		    };
	};

   return Department;
});