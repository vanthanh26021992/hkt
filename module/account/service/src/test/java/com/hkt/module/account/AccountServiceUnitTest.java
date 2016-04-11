package com.hkt.module.account;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.account.entity.Account;
import com.hkt.module.account.entity.Account.Type;
import com.hkt.module.account.entity.AccountDetail;
import com.hkt.module.account.entity.AccountMembership.Capability;
import com.hkt.module.account.util.AccountScenario;
import com.hkt.module.core.ServiceCallback;
import com.hkt.module.core.search.SearchQuery;
import com.hkt.module.core.search.SearchResult;
import com.hkt.module.kpi.KpiService;
import com.hkt.util.json.JSONSerializer;
import com.hkt.util.test.Verifier;

public class AccountServiceUnitTest extends AbstractUnitTest {
  static ServiceCallback<AccountService> FAIL_CALLBACK = new ServiceCallback<AccountService>() {
    public void callback(AccountService service) {
      throw new RuntimeException("Fail. Expect a rollback if method annotate with the Transactionnal");
    }
  };
  
  static public String ORG_ACCOUNT = "hkt";
  static public String USER_ACCOUNT = "tu.phan";
  
  @Autowired
  AccountService service;
  
  @Autowired
  KpiService serviceKPI;
  
  private AccountScenario scenario;
  
  @Before
  public void setup() throws Exception {
    scenario = AccountScenario.loadTest();
    service.createScenario(scenario);
  }
  
  @After
  public void tearDown() throws Exception {
    service.deleteAll();
  }
  
  @Test
  public void testKPI() throws Exception{
	  service.getBusinessInformation();
  }
  
  @Test
  public void testSerialization() throws IOException {
    assertTrue(scenario.getAccounts().size() > 0);
    assertTrue(scenario.getGroups().size() > 0);
    
    AccountDetail hktDetail = scenario.getAccounts().get(0);
    Account hkt = hktDetail.getAccount();
    
    // assertNotNull(hkt.getProfiles().getBasic().get("foundedDate")) ;
    System.out.println(JSONSerializer.INSTANCE.toString(scenario));
  }
  
//  @Test
//  public void testBusinessInformation() throws Exception{
//	  service.getBusinessInformation();
//  }
  
  @Test
  public void testAccountCrud() throws Exception {
    // test transaction
    try {
      service.deleteAccountCallBack(service.getAccountByLoginId(ORG_ACCOUNT), FAIL_CALLBACK);
    } catch (Throwable t) {
      System.out.println("Fail callback exception: " + t.getMessage());
    }
    
    Account orgAccount = service.getAccountByLoginId(ORG_ACCOUNT);
    assertNotNull(orgAccount);
    assertNotNull(orgAccount.getProfiles());
    
    assertEquals(1, orgAccount.getContacts().size());
    assertEquals(Capability.ADMIN, service.getMembershipByAccountAndGroup(ORG_ACCOUNT, "hkt/employees")
        .getCapability());
    
    service.deleteAccountByLoginId(ORG_ACCOUNT);
    
    assertNull(service.getAccountByLoginId(ORG_ACCOUNT));
    assertNull(service.getMembershipByAccountAndGroup(ORG_ACCOUNT, "hkt/employees"));
  }
  
  @Test
  public void testFindAccounts() {
    List<Account> accounts = service.findAccountByLoginId("tu", Type.USER);
    assertEquals(10, accounts.size());
  }
  
  @Test
  public void testFilterAccounts() {
    // TODO: test filterAccounts(...) method
  }
  
  @Test
  public void testSearchAccounts() throws Exception {
    SearchQuery query = new SearchQuery("title:hkt");
    SearchResult<Account> result = service.searchAccounts(query);
    
    assertEquals(1, result.getTotalHits());
    
    System.out.println(JSONSerializer.INSTANCE.toString(result));
  }
  
  @Test
  public void testAccountDetailGet() throws Exception {
    Verifier<AccountDetail> accVerifier = new Verifier<AccountDetail>() {
      public void verify(AccountDetail detail) {
        assertNotNull(detail);
        assertEquals(ORG_ACCOUNT, detail.getAccount().getLoginId());
        assertEquals(3, detail.getMemberships().size());
        assertTrue(detail.getMemberships().contains(service.getMembershipByAccountAndGroup(ORG_ACCOUNT, "hkt")));
        assertTrue(detail.getMemberships().contains(
            service.getMembershipByAccountAndGroup(ORG_ACCOUNT, "hkt/employees")));
      }
    };
    accVerifier.verify(service.getAccountDetail(ORG_ACCOUNT));
    accVerifier.verify(service.getAccountDetail(service.getAccountByLoginId(ORG_ACCOUNT).getId()));
  }
  
  
}