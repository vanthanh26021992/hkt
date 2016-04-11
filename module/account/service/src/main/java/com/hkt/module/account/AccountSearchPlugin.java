package com.hkt.module.account;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.hkt.module.account.entity.Account;
import com.hkt.module.account.entity.Contact;
import com.hkt.module.account.entity.Profile;
import com.hkt.module.account.entity.Profiles;
import com.hkt.module.core.search.IndexDocument;
import com.hkt.module.core.search.SearchPlugin;

@Component
public class AccountSearchPlugin extends SearchPlugin<Account> {
  final static String[] ORG_NAME_KEY =  { "name" } ;
  final static String[] USER_NAME_KEY = { "firstName", "lastName"} ;
  
  public String getName() { return Account.class.getSimpleName() ; }
  
  public Class<Account> getType() { return Account.class ; } 
  
  public IndexDocument create(Account account) throws IOException {
    IndexDocument idoc = new IndexDocument() ;
    idoc.addTitle(getTitle(account)) ;
    idoc.addSummary("") ;
    idoc.addText(getText(account)) ;
    idoc.addSource(account) ;
    return idoc ;
  }
  
  private String getTitle(Account account) {
    StringBuilder title = new StringBuilder() ;
    add(title, account.getLoginId()) ;
    //add(title, account.getEmail()) ;
    Profiles profiles = account.getProfiles() ;
    if(profiles != null) {
      Profile basic = profiles.getBasic() ;
      if(account.getType() == Account.Type.USER) add(title, basic, USER_NAME_KEY) ;
      else add(title, basic, ORG_NAME_KEY) ;
    }
    return title.toString() ;
  }
  
  private String getText(Account account) {
    StringBuilder b = new StringBuilder() ;
    add(b, account.getLoginId()) ;
   // add(b, account.getEmail()) ;
    Profiles profiles = account.getProfiles() ;
    if(profiles != null) {
      for(Profile profile : profiles.allProfiles()) add(b, profile) ;
    }
    if(account.getContacts() != null) {
      for(Contact contact : account.getContacts()) add(b, contact) ;
    }
    return b.toString() ;
  }
  
  private void add(StringBuilder b, Contact contact) {
  }
  
  private void add(StringBuilder b, Profile profile, String[] key) {
    for(String sel : key) add(b, profile.get(sel)) ;
  }
  
  private void add(StringBuilder b, Profile profile) {
    for(Map.Entry<String, Object> entry : profile.entrySet()) {
      add(b, entry.getValue()) ;
    }
  }
  
  private void add(StringBuilder b, Object obj) {
    if(obj == null) return ;
    if(obj instanceof String[]) {
      for(String val : (String[]) obj) {
        b.append(' ').append(val) ;
      }
    } else {
      b.append(' ').append(obj) ;
    }
  }
}