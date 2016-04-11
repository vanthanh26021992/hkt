package com.hkt.module.account;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import com.hkt.module.account.entity.Account;
import com.hkt.module.account.entity.AccountGroup;
import com.hkt.module.account.entity.AccountMembership;
import com.hkt.module.account.entity.AccountMembership.Capability;
import com.hkt.module.account.entity.AccountMembership.Status;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
  locations = {
    "classpath:META-INF/spring/module.core.service.xml",
    "classpath:META-INF/spring/module.account.service.xml",
    "classpath:META-INF/spring/module.kpi.service.xml"
  }
)
@TransactionConfiguration(defaultRollback=true)
abstract public class AbstractUnitTest {
  protected Account createAccount(String user) {
    Account acc = new Account();
    acc.setLoginId(user);
    acc.setPassword("password") ;
    acc.setEmail(user + "@host") ;
    acc.setType(Account.Type.USER) ;
    return acc ;
  }
  
  protected AccountMembership create(String loginId, String groupPath, Capability cap) {
    AccountMembership membership = new AccountMembership() ;
    membership.setLoginId(loginId) ;
    membership.setGroupPath(groupPath) ;
    membership.setCapability(cap) ;
    membership.setStatus(Status.ACTIVE);
    membership.setRole("");
    return membership ;
  }
  
  protected AccountMembership create(Account account, AccountGroup group, Capability cap) {
    return create(account.getLoginId(), group.getCode(), cap) ;
  }
}
