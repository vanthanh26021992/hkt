package com.hkt.module.config.webui;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.account.AccountService;
import com.hkt.module.account.entity.AccountMembership;
import com.hkt.module.account.entity.AccountMembership.Capability;
import com.hkt.module.account.util.AccountScenario;
import com.hkt.module.config.AbstractUnitTest;
import com.hkt.module.config.webui.ACLConfig;
import com.hkt.module.config.webui.UIConfig;
import com.hkt.module.config.webui.UIConfigService;
import com.hkt.module.core.ServiceCallback;
import com.hkt.module.core.entity.AbstractPersistable.State;
import com.hkt.module.core.rest.Request;
import com.hkt.module.core.rest.Response;
import com.hkt.module.core.rest.RestService;
import com.hkt.util.json.JSONReader;
import com.hkt.util.json.JSONSerializer;

public class UIConfigRestDispatcherUnitTest extends AbstractUnitTest {
  static ServiceCallback<UIConfigService> FAIL_CALLBACK = new ServiceCallback<UIConfigService>() {
    public void callback(UIConfigService service) {
      throw new RuntimeException("Fail. Expect a rollback if method annotate with the Transactionnal") ;
    }
  };
  
  @Autowired
  UIConfigService service ;
  
  @Autowired
  private AccountService  accountService ;
  
  @Autowired
  RestService restService ;
  
  @Before
  public void setup() throws Exception {
    accountService.createScenario(AccountScenario.loadTest()) ;
    JSONReader reader = new JSONReader("src/test/resources/uiconfig.json") ;
    UIConfig uiconfig = reader.read(UIConfig.class) ;
    service.setUIConfigTemplate(uiconfig) ;
    
    List<ACLConfig> hktACLs = service.getPermissionConfigs("hkt") ;
    List<AccountMembership> memberships = new ArrayList<AccountMembership>() ;
    for(ACLConfig acl : hktACLs) {
      AccountMembership m = new AccountMembership() ;
      m.setLoginId("hkt") ;
      m.setGroupPath(acl.getGroup()) ;
      if(acl.getModule().startsWith("account")) {
        m.setCapability(Capability.ADMIN) ;
      } else {
        m.setPersistableState(State.DELETED) ;
      }
      memberships.add(m) ;
    }
    accountService.saveAccountMemberships(memberships) ;
  }
  
  @After
  public void tearDown() throws Exception {
    accountService.deleteAll() ;
  }
  
  @Test
  public void testRestService() throws Exception {
    Request req = new Request("config", "UIConfigService", "getUIConfig") ;
    req.addParam("loginId", "hkt") ;
    Response res = restService.dispatch(req) ;
    System.out.println(JSONSerializer.INSTANCE.toString(res)) ;
    UIConfig uiConfig = res.getDataAs(UIConfig.class);
    assertNotNull(uiConfig);
  }
}