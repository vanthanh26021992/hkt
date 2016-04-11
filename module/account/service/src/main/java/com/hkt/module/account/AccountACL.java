package com.hkt.module.account;

import java.util.List;

import com.hkt.module.account.entity.AccountMembership;

public class AccountACL {
  private List<AccountMembership> memberships ;
  
  public AccountACL(List<AccountMembership> memberships) {
    this.memberships = memberships ;
  }
  
  public AccountACL(AccountService service, String loginId) {
    this.memberships = service.findMembershipByAccountLoginId(loginId) ;
  }
  
  public AccountMembership getMembership(String group) {
    for(AccountMembership m : memberships) {
      if(m.getGroupPath().equals(group)) return m ;
    }
    return null ;
  }
  
  public boolean hasMembership(String group) {
    return getMembership(group) != null ;
  }
}
