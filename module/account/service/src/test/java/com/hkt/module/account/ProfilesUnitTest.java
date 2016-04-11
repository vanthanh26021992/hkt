package com.hkt.module.account;

import static org.junit.Assert.assertNotNull;

import org.junit.Test;

import com.hkt.module.account.entity.Profiles;
import com.hkt.util.json.JSONReader;
import com.hkt.util.json.JSONSerializer;

public class ProfilesUnitTest  {
  
  @Test
  public void testOrgProfiles() throws Exception {
    JSONReader reader = new JSONReader("src/test/resources/org-profiles.json") ;
    Profiles profiles = reader.read(Profiles.class) ;
    assertNotNull(profiles.getBasic()) ;
    System.out.println(JSONSerializer.INSTANCE.toString(profiles));
  }
  
  @Test
  public void testUserProfiles() throws Exception {
    JSONReader reader = new JSONReader("src/test/resources/user-profiles.json") ;
    Profiles profiles = reader.read(Profiles.class) ;
    assertNotNull(profiles.getBasic()) ;
    System.out.println(JSONSerializer.INSTANCE.toString(profiles));
  }
}