package com.hkt.module.account.entity;

import java.util.List;

public class AccountGroupDetail {
  private AccountGroup group ;
  private List<AccountMembership> memberships ;
  private List<AccountGroup> children ;
  
  public AccountGroupDetail() { }

  public AccountGroupDetail(AccountGroup group, List<AccountMembership> memberships, List<AccountGroup> children) {
    this.group = group ;
    this.memberships = memberships ;
    this.children = children ;
  }
  
  public AccountGroup getGroup() {
    return group;
  }
  
  public void setGroup(AccountGroup group) {
    this.group = group;
  }
  
  public List<AccountMembership> getMemberships() {
    return memberships;
  }
  public void setMemberships(List<AccountMembership> memberships) {
    this.memberships = memberships;
  }

  public List<AccountGroup> getChildren() {
    return children;
  }

  public void setChildren(List<AccountGroup> children) {
    this.children = children;
  }
}
