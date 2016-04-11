package com.hkt.module.account.repository;

import java.util.List;

import com.hkt.module.account.entity.Account;
import com.hkt.module.core.entity.FilterQuery;
import com.hkt.module.core.entity.FilterResult;

interface AccountRepositoryCustom {
  public FilterResult<Account> search(FilterQuery query) ;
  public List<Account> jdbcFindByAll();
}
