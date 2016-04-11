define([
  'jquery', 
  'underscore', 
  'backbone',
  'service/service',
  'ui/UICollapsible',
  'ui/UITable',
  'module/account/Account'
], function($, _, Backbone, service, UICollapsible, UITable, Account) {  
  var UIWebuiACL = UITable.extend({
    label: "Phân quyền",
    config: {
      toolbar: {
        dflt: {
          actions: [
          ]
        }
      },
      
      bean: {
        label: 'Phân quyền',
        fields: [
          { 
            field: "module",   label: "Menu", 
            toggled: true, filterable: true,
            enable: false,
          },
          { 
            field: "screen",   label: "Giao diện", 
            toggled: true, filterable: true,
            enable: false,
          },
          { 
            field: "permission",   label: "Quyền", 
            toggled: true, filterable: true,
            custom: {
				 set: function(bean,thisUI){},
                 getDisplay: function(bean) {
                   if(bean.permission=='not'){
                   	return "Không quyền";
                   }else {
						if(bean.permission=='read'){
							return "Quyền đọc";
						}else {
							if(bean.permission=='write'){
								return "Quyền ghi";
							}else {
								return "Toàn quyền";
							}
						}
					}
                 }
			 },
            defaultValue: "not",
              select: {
                  getOptions: function(field, bean) {
                    var options = [
                      { label: "Không quyền", value: 'not' },
                      { label: "Quyền đọc", value: 'read'},
                      { label: "Quyền ghi", value: 'write'},
                      { label: "Toàn quyền", value: 'all'}
                    ];
                    return options ;
                  }
                }
          },
        ],
        actions:[
          {
            icon: "check", label: "Check/Uncheck",
            onClick: function(thisTable, row) { 
              thisTable.onEditBean(row) ;
            }
          }
        ]
      },
      pageSize: 50
    },
    
    init: function(account) {
      var uipermissions = [
        { module: "Tổ chức Nhân sự", screen: "Nhân sự", permission: "not" },
        { module: "Tổ chức Nhân sự", screen: "Phòng ban", permission: "not" },
        { module: "Tổ chức Nhân sự", screen: "Cây Phòng ban & Nhân sự", permission: "not" },
        { module: "Quản trị KPI", screen: "Thiết lập KPI", permission: "not" },
        { module: "Quản trị KPI", screen: "Nhóm KPI", permission: "not" },
        { module: "Quản trị KPI", screen: "Thêm nhanh giá trị", permission: "not" },
        { module: "Quản trị KPI", screen: "Thẻ điểm Cân Bằng", permission: "not" },
        { module: "Thống kê", screen: "Thống kê", permission: "not" },
        { module: "Thống kê", screen: "Cơ cấu tổ chức", permission: "not" },
        { module: "Thiết lập chung", screen: "Thông tin doanh nghiệp", permission: "not" },
        { module: "Thiết lập chung", screen: "Thông tin cơ bản", permission: "not" },
      ];
      console.log(account.profiles);
      if(account.profiles!=null && account.profiles.permissions!=null && account.profiles.permissions.length>0){
    	  uipermissions = account.profiles.permissions;
      }
      
      this.setBeans(uipermissions) ;
      return this ;
    }
  
  });
  
  var UIAccountACL = UICollapsible.extend({
    label: "Phân quyền",
    config: {
      actions: [
        { 
          action: "back", label: "Hủy",
          onClick: function(thisUI) {
            if(thisUI.UIParent.back) thisUI.UIParent.back(false) ; 
          }
        },
        {
          action: "save", label: "Lưu",
          onClick: function(thisUI) {
        	  var uipermissions = thisUI.UIWebuiACL.getBeans();
        	  var config = {Accounts:uipermissions[0].permission,
        			  ListGroup:uipermissions[1].permission,
        			  Groups:uipermissions[2].permission,
        			  KpiAccounts:uipermissions[3].permission,
        			  GroupKpis:uipermissions[4].permission,
        			  MulValueChange:uipermissions[5].permission,
        			  TreeTableValueChange:uipermissions[6].permission,
        			  Report:uipermissions[7].permission,
        			  DepartmentTree:uipermissions[8].permission,
        			  BusinessInformations:uipermissions[9].permission,
        			  Setup:uipermissions[10].permission};
        	  if(thisUI.account.profiles==null){
        		  thisUI.account.profiles = {}; 
        	  }
        	  thisUI.account.profiles.config = config;
            thisUI.account.profiles.permissions = uipermissions;
            service.AccountService.saveAccount(thisUI.account);
            if(thisUI.UIParent.back) thisUI.UIParent.back(false) ;
          }
        }
      ]
    },
    
    init: function(UIParent, account) {
      this.clear() ;
      this.account = service.AccountService.getAccountByLoginId(account.loginId).data;
      this.UIParent = UIParent ;
      this.UIWebuiACL = new UIWebuiACL().init(this.account);
      this.add(this.UIWebuiACL) ;
      return this ;
    },
  });
  
  return UIAccountACL ;
});
