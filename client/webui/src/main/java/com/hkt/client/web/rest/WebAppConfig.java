package com.hkt.client.web.rest;

import com.hkt.module.config.webui.UIConfig;


public class WebAppConfig {
  private AdminAuthentication adminAuthentication ;
  private UIConfig webuiConfig ;
  
  public AdminAuthentication getAdminAuthentication() { return adminAuthentication;}
  public void setAdminAuthentication(AdminAuthentication adminAuthentication) {
    this.adminAuthentication = adminAuthentication;
  }
  
  public UIConfig getWebuiConfig() { return webuiConfig; }
  public void     setWebuiConfig(UIConfig uiconfig) { this.webuiConfig = uiconfig; }

  public boolean isAdmin(String loginId, String password) {
    if(loginId.equals(adminAuthentication.getLoginId()) &&
       password.equals(adminAuthentication.getPassword())) {
      return true ;
    }
    return false ;
  }
  
  static public class AdminAuthentication {
    private String loginId ;
    private String password ;
    
    public String getLoginId() { return loginId; }
    public void setLoginId(String loginId) { this.loginId = loginId; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
  }
}
