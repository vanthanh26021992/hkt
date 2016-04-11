package com.hkt.module.account.repository;

import javax.persistence.PrePersist;

import org.springframework.stereotype.Component;

import com.hkt.module.account.entity.Account;

//@Component
public class AccountRepositoryListener {
//  @PrePersist
  public void prePersist(Account acc) {
    //TODO: resolve the cyclic dependency in config module
  }
}