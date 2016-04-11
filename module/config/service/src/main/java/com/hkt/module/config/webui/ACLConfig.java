package com.hkt.module.config.webui;

import com.hkt.module.account.entity.AccountMembership;

public class ACLConfig {
  private String module ;
  private String screen ;
  private String group  ;
  private AccountMembership.Capability capability ;
  private String[] tag = { "admin" };
  
  public String getModule() { return module; }
  public void setModule(String module) { this.module = module; }
  
  public String getScreen() { return screen; }
  public void setScreen(String screen) { this.screen = screen; }
  
  public String getGroup() { return group; }
  public void setGroup(String group) { this.group = group; }
  
  public AccountMembership.Capability getCapability() { return capability; }
  public void setCapability(AccountMembership.Capability capability) {
    this.capability = capability;
  }
  
  public String[] getTag() { return tag; }
  public void     setTag(String[] tag) { this.tag = tag; }
}
