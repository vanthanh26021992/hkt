package com.hkt.module.account.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Profiles {
  
  private Map<String, Profile[]> holders = new HashMap<String, Profile[]>() ;
  
  public Profile getBasic() { return getSingle("basic") ; }
  public void    setBasic(Profile profile) { setSingle("basic", profile) ; }
  
  public Profile getConfig() { return getSingle("config") ; }
  public void    setConfig(Profile profile) { setSingle("config", profile) ; }
  
  public Profile[] getUserRelationships() { return holders.get("userRelationships") ; }
  public void      setUserRelationships(Profile[] profile) { holders.put("userRelationships", profile) ; }
  
  public Profile[] getUserEducations() { return holders.get("userEducations") ; }
  public void      setUserEducations(Profile[] profile) { holders.put("userEducations", profile) ; }
  
  public Profile[] getUserWorks() { return holders.get("userWorks") ; }
  public void      setUserWorks(Profile[] profile) { holders.put("userWorks", profile) ; }
  
  public Profile[] getPermissions() { return holders.get("permissions") ; }
  public void      setPermissions(Profile[] profile) { holders.put("permissions", profile) ; }
  
  public Profile[] getBusinessRegistrations() { return holders.get("businessRegistrations") ; }
  public void      setBusinessRegistrations(Profile[] profile) { holders.put("businessRegistrations", profile) ; }
  
  public Profile[] allProfiles() {
    List<Profile> holder = new ArrayList<Profile>() ;
    for(Profile[] parray : holders.values()) {
      for(Profile profile : parray) 
        holder.add(profile) ;
    }
    return holder.toArray(new Profile[holder.size()]) ;
  }
  
  private Profile getSingle(String name) {
    Profile[]  profile = holders.get(name) ; 
    if(profile == null) return null ;
    return profile[0] ;
  }
  
  public void setSingle(String name, Profile profile) { 
    holders.put(name, new Profile[] { profile }) ; 
  }
}