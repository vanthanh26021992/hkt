package com.hkt.module.account.repository;

import com.hkt.module.account.entity.AccountGroup;

public interface AccountGroupRepositoryCustom {
  public int cascadeDelete(AccountGroup group) ;
}
