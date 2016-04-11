package com.hkt.module.config.webui;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.Iterator;
import java.util.List;

import com.hkt.module.account.AccountACL;

public class UIConfig implements Serializable {
  private String language ;
  private List<UIModuleConfig> modules ;
  
  public String getLanguage() { return this.language ; }
  public void   setLanguage(String language) { this.language = language ; }
  
  public List<UIModuleConfig> getModules() { return modules; }
  public void setModules(List<UIModuleConfig> modules) { this.modules = modules; }
  
  public UIConfig configure(AccountACL acl) {
    Iterator<UIModuleConfig> i = modules.iterator() ;
//    while(i.hasNext()) {
//      UIModuleConfig selModule = i.next() ;
//      if(selModule.hasPermission(acl)) {
//      } else {
//        i.remove() ;
//      }
//    }
    return this ;
  }
  
  public UIConfig cloneUIConfig() throws Exception { 
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(bos);
    oos.writeObject(this);
    oos.flush();
    oos.close();
    bos.close();
    byte[] byteData = bos.toByteArray();
    ByteArrayInputStream bais = new ByteArrayInputStream(byteData);
    return (UIConfig) new ObjectInputStream(bais).readObject();
  }
  
  static public class UIModuleConfig implements Serializable {
    private String name ;
    private Permission permission ;
    private List<UIScreenConfig> screens ;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Permission getPermission() { return permission; }
    public void setPermission(Permission permission) { this.permission = permission; }
    
    public List<UIScreenConfig> getScreens() { return screens; }
    public void setScreens(List<UIScreenConfig> screens) { this.screens = screens; }
    
    public void configure(AccountACL acl) {
      Iterator<UIScreenConfig> i = screens.iterator() ;
      while(i.hasNext()) {
        UIScreenConfig sel = i.next() ;
        if(sel.hasPermission(acl)) {
        } else {
          i.remove() ;
        }
      }
    }
    
    public boolean hasPermission(AccountACL acl) {
      if(permission == null) return true ;
      return permission.hasPermission(acl) ;
    }
  }
  
  static public class UIScreenConfig implements Serializable {
    private String name ;
    private String label ;
    private Permission permission ;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name ; }

    public String getLabel() { return this.label ;}
    public void setLabel(String label) { this.label = label ; }
    
    public Permission getPermission() { return permission ; }
    public void setPermission(Permission permission) { this.permission = permission; }
  
    public boolean hasPermission(AccountACL acl) {
      if(permission == null) return true ;
      return permission.hasPermission(acl) ;
    }
  }
  
  static public class Permission implements Serializable {
    public enum Capability { READ, WRITE, ADMIN }
    private String group ;
    private Capability capability;

    public String getGroup() { return group; }
    public void setGroup(String group) { this.group = group; }
    
    public Capability getCapability() { return capability; }
    public void setCapability(Capability capability) { this.capability = capability; }
    
    public boolean hasPermission(AccountACL acl) { return acl.hasMembership(group) ; }
  }
}