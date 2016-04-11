package com.hkt.module.config.webui;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkt.module.account.AccountACL;
import com.hkt.module.account.AccountService;
import com.hkt.module.account.entity.AccountMembership;
import com.hkt.module.account.entity.AccountMembership.Capability;

@Service("UIConfigService")
public class UIConfigService {
  @Autowired
  private AccountService accService;
  private UIConfig uiconfigTemplate;

  public void setUIConfigTemplate(UIConfig config) {
    this.uiconfigTemplate = config;
  }

  public UIConfig getUIConfig(String loginId) throws Exception {
    AccountACL acl = new AccountACL(accService, loginId);
    return uiconfigTemplate.cloneUIConfig().configure(acl);
  }

  public UIConfig getAdminUIConfig() throws Exception {
    return uiconfigTemplate.cloneUIConfig();
  }

  @Transactional
  public List<ACLConfig> getPermissionConfigs(String loginId) {
    AccountACL acl = new AccountACL(accService, loginId);
    List<ACLConfig> holder = new ArrayList<ACLConfig>();
    for (UIConfig.UIModuleConfig sel : uiconfigTemplate.getModules()) {
      AccountMembership m = acl.getMembership(sel.getPermission().getGroup());
      ACLConfig pconfig = new ACLConfig();
      pconfig.setModule(sel.getName());
      pconfig.setGroup(sel.getPermission().getGroup());
      if (m != null)
        pconfig.setCapability(m.getCapability());
      holder.add(pconfig);

      for (UIConfig.UIScreenConfig screen : sel.getScreens()) {
        if (screen.getPermission() != null) {
          m = acl.getMembership(screen.getPermission().getGroup());
          pconfig = new ACLConfig();
          pconfig.setModule(sel.getName());
          pconfig.setScreen(screen.getName());
          pconfig.setGroup(screen.getPermission().getGroup());
          if (m != null)
            pconfig.setCapability(m.getCapability());
          holder.add(pconfig);
        }
      }
    }
    return holder;
  }

  @Transactional
  public void savePermissionConfigs(String loginId, List<ACLConfig> list) {
    System.out.println("call savePermissionConfigs");
  }

  @Transactional
  public Capability getPermission(String organizationLoginId, String loginId, String screen) {
    try {
      String group = organizationLoginId + "/"+loginId + "/" + screen;
      AccountACL acl = new AccountACL(accService, loginId);
      return acl.getMembership(group).getCapability();
    } catch (Exception e) {
      return null;
    }

  }

}
