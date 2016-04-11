package com.hkt.module.account.entity;

import java.io.Serializable;
import java.util.List;

public class AccountDetail implements Serializable {

  private Account account;
  private List<AccountMembership> memberships;

  public AccountDetail() {

  }

  public AccountDetail(Account account, List<AccountMembership> memberships) {
    this.account = account;
    this.memberships = memberships;
  }

  public Account getAccount() {
    return account;
  }

  public void setAccount(Account account) {
    this.account = account;
  }

  public List<AccountMembership> getMemberships() {
    return memberships;
  }

  public void setMemberships(List<AccountMembership> memberships) {
    this.memberships = memberships;
  }
}
