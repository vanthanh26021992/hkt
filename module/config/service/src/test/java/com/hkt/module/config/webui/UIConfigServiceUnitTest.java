package com.hkt.module.config.webui;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.account.AccountService;
import com.hkt.module.account.entity.AccountMembership;
import com.hkt.module.account.entity.AccountMembership.Capability;
import com.hkt.module.account.util.AccountScenario;
import com.hkt.module.config.AbstractUnitTest;
import com.hkt.module.core.entity.AbstractPersistable.State;
import com.hkt.util.json.JSONReader;
import com.hkt.util.json.JSONSerializer;

public class UIConfigServiceUnitTest extends AbstractUnitTest {
  @Autowired
  private UIConfigService service;

  @Autowired
  private AccountService accountService;

  @Before
  public void setup() throws Exception {
    accountService.createScenario(AccountScenario.loadTest());
  }

  @Test
  public void testService() throws Exception {
    JSONReader reader = new JSONReader("src/test/resources/uiconfig.json");
    UIConfig uiconfig = reader.read(UIConfig.class);
    service.setUIConfigTemplate(uiconfig);

    List<ACLConfig> hktACLs = service.getPermissionConfigs("hkt");

    List<AccountMembership> memberships = new ArrayList<AccountMembership>();
    for (ACLConfig acl : hktACLs) {
      AccountMembership m = new AccountMembership();
      m.setLoginId("hkt");
      m.setGroupPath(acl.getGroup());
      if (acl.getModule().startsWith("account")) {
        m.setCapability(Capability.ADMIN);
      } else {
        m.setPersistableState(State.DELETED);
      }
      memberships.add(m);
    }
    accountService.saveAccountMemberships(memberships);
    System.out.println(JSONSerializer.INSTANCE.toString(hktACLs));
    System.out.println("---------------------------------------");
    UIConfig hktUIConfig = service.getUIConfig("hkt");
    System.out.println(JSONSerializer.INSTANCE.toString(hktUIConfig));
  }
}
