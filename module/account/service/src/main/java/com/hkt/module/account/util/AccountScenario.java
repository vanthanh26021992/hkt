package com.hkt.module.account.util;

import java.util.List;

import com.hkt.module.account.entity.AccountDetail;
import com.hkt.module.account.entity.AccountGroup;
import com.hkt.util.IOUtil;
import com.hkt.util.json.JSONReader;

public class AccountScenario {
  private List<AccountGroup>  groups;
  private List<AccountDetail> accounts;

  public AccountScenario() { }
  
  public List<AccountGroup> getGroups() {
    return groups;
  }

  public void setGroups(List<AccountGroup> groups) {
    this.groups = groups;
  }

  public List<AccountDetail> getAccounts() {
    return accounts;
  }

  public void setAccounts(List<AccountDetail> accounts) {
    this.accounts = accounts;
  }
  
  static public AccountScenario load(String res) throws Exception {
    JSONReader reader = new JSONReader(IOUtil.loadRes(res)) ;
    AccountScenario scenario = reader.read(AccountScenario.class) ;
    return scenario ;
  }
  
  static public AccountScenario loadTest() throws Exception {
    return load("classpath:scenario/account.json") ;
  }
}