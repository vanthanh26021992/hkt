package com.hkt.module.account.rest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.account.AbstractUnitTest;
import com.hkt.module.account.AccountService;
import com.hkt.module.account.entity.Account;
import com.hkt.module.account.util.AccountScenario;
import com.hkt.module.core.ServiceCallback;
import com.hkt.module.core.rest.Request;
import com.hkt.module.core.rest.Response;
import com.hkt.module.core.rest.RestService;
import com.hkt.util.json.JSONReader;
import com.hkt.util.json.JSONSerializer;

public class AccountServiceDispatcherUnitTest extends AbstractUnitTest {
  static ServiceCallback<AccountService> FAIL_CALLBACK = new ServiceCallback<AccountService>() {
    public void callback(AccountService service) {
      throw new RuntimeException("Fail. Expect a rollback if method annotate with the Transactionnal") ;
    }
  };
  
  @Autowired
  AccountService service ;
  
  @Autowired
  RestService restService ;
  
  @Before
  public void setup() throws Exception {
    JSONReader reader = new JSONReader("src/test/resources/scenario/account.json") ;
    AccountScenario scenario = reader.read(AccountScenario.class) ;
    service.createScenario(scenario) ;
  }
  
  @After
  public void tearDown() throws Exception {
    service.deleteAll() ;
  }
  
  @Test
  public void testRestService() throws Exception {
    Request req = new Request("account", "AccountService", "getAccountByLoginId") ;
    req.addParam("loginId", "hkt") ;
    Response res = restService.dispatch(req) ;
    System.out.println(JSONSerializer.INSTANCE.toString(res)) ;
    Account account = res.getDataAs(Account.class) ;
    assertNotNull(account) ;
    assertEquals("hkt", account.getLoginId()) ;
  }
}