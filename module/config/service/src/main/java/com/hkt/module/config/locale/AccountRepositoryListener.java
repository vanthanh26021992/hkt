package com.hkt.module.config.locale;

import javax.persistence.EntityNotFoundException;
import javax.persistence.PrePersist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hkt.module.account.entity.Account;
import com.hkt.module.config.generic.GenericOptionService;
import com.hkt.module.config.generic.OptionGroup;

@Component
public class AccountRepositoryListener {
  static private LocaleService localeService;
  
  static private GenericOptionService optionService;
  
  @Autowired(required = true)
  public void setLocaleService(LocaleService locale) {
    localeService = locale;
  }
  
  @Autowired(required = true)
  public void setGenericOptionService(GenericOptionService option) {
    optionService = option;
  }
  
  @PrePersist
  public void prePersist(Account acc) {
    if (acc.getContacts() != null) {
      for (int i = 0; i < acc.getContacts().size(); i++) {
        if (acc.getContacts().get(i).getCountry() != null) {
          if (localeService.findCountryByName(acc.getContacts().get(i).getCountry()) == null)
            throw new EntityNotFoundException("cannot find Country ");
        }
      }
      
      for (int i = 0; i < acc.getContacts().size(); i++) {
        if (acc.getContacts().get(i).getCity() != null) {
          if (localeService.findCityByName(acc.getContacts().get(i).getCity()) == null)
            throw new EntityNotFoundException("cannot find City ");
        }
      }
    }
    
    if (acc.getProfiles() != null && acc.getProfiles().getUserEducations() != null) {
      OptionGroup optionGroup = optionService.getOptionGroup("config", "LocaleService", "language");
      
      for (int i = 0; i < acc.getProfiles().getUserEducations().length; i++) {
        Object obj = acc.getProfiles().getUserEducations()[i].get("language");
        
        if ( obj != null) {
          
          if (optionGroup.getOption(obj.toString()) == null) {
            throw new EntityNotFoundException("cannot find Language ");
          }
        }
      }
    }
  }
  
}