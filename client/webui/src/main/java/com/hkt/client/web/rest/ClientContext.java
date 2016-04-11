package com.hkt.client.web.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.hkt.module.account.entity.Account;
import com.hkt.module.config.webui.UIConfig;

public class ClientContext {
  final static public String NAME = "ClientContext" ;
  
  private Account account ;
  private UIConfig webuiConfig ;
  
  public Account getAccount() { return account; }
  public void setAccount(Account account) { this.account = account; }
  
  public UIConfig getWebuiConfig() { return webuiConfig; }
  public void setWebuiConfig(UIConfig uiconfig) { this.webuiConfig = uiconfig; }
  
  static public ClientContext get(HttpServletRequest req) {
    HttpSession session = req.getSession() ;
    return (ClientContext) session.getAttribute(NAME) ;
  }
  
  static public void set(HttpServletRequest req, ClientContext ctx) { 
    HttpSession session = req.getSession(true) ;
    if(ctx == null) session.removeAttribute(NAME) ;
    else session.setAttribute(NAME, ctx) ;
  }
}
