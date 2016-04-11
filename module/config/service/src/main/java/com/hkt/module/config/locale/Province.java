package com.hkt.module.config.locale;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class Province {
  private String name ;
  private String            code;
  private int index;
  private String description ;
  private List<City> cities ;
  
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  
  public int getIndex() {
    return index;
  }
  public void setIndex(int index) {
    this.index = index;
  }
  public String getCode() {
    return code;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  
  public List<City> getCities() { return cities; }
  public void setCities(List<City> cities) { this.cities = cities; }
  
  public List<Region<City>> findCities(Country country, Pattern exp) {
    List<Region<City>> holder = new ArrayList<Region<City>>() ;
    for(City sel : cities) {
      if(exp.matcher(sel.getName()).matches()) {
        Region<City> region = new Region<City>() ; 
        region.setType(Region.Type.City) ;
        region.setCountry(country.getName()) ;
        region.setProvince(getName()) ;
        region.setRegion(sel) ;
        holder.add(region) ;
       }
    }
    return holder ;
  }
}
