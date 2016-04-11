package com.hkt.module.config.generic;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.hkt.module.config.AbstractUnitTest;

public class GenericOptionServiceUnitTest extends AbstractUnitTest {
  
  @Autowired
  private GenericOptionService service;
  
  @Test
  public void testCurrency() throws Exception {
    OptionGroup optGroup = service.getOptionGroup("config", "LocaleService", "currency") ;
    assertNotNull(optGroup) ;
    assertEquals(2, optGroup.getOptions().size());
    assertNotNull(optGroup.getOption("VND"));
    
    assertEquals(1, service.findOptions("config", "LocaleService", "currency", "V").size());
    assertEquals(1, service.findOptions("config", "LocaleService", "currency", "v").size());
    assertEquals(1, service.findOptions("config", "LocaleService", "currency", "USD").size());
  }
  
  @Test
  public void testLanguage() throws Exception {
    OptionGroup optGroup = service.getOptionGroup("config", "LocaleService", "language") ;
    assertNotNull(optGroup) ;
    
  assertEquals(1, service.findOptions("config", "LocaleService", "language", "vn").size());
  assertEquals(1, service.findOptions("config", "LocaleService", "language", "Viet").size());
  assertEquals(1, service.findOptions("config", "LocaleService", "language", "viet").size());
//  
//  Language language = new Language();
//  language.setName("LÀO");
//  language.setCode("Laos");
//  language.setDescription("Ngôn ngữ quốc gia Lao");
//  
//  language = lservice.saveLanguage(language);
//  assertEquals(4, lservice.getLanguages().size());
//  
//  assertEquals(true, lservice.deleteLanguage(language));
//  assertEquals(3, lservice.getLanguages().size());
  }
}
