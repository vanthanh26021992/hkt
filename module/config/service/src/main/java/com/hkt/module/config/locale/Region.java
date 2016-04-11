package com.hkt.module.config.locale;

public class Region<T> {
  static public enum Type{ Country, Province, City }
  
  private Type     type ;
  private String   country ;
  private String   province ;
  private T        region ;
  
  public Type getType() { return this.type ; }
  public void setType(Type type) { this.type = type ; }
  
  public String getCountry() { return country; }
  public void setCountry(String country) { this.country = country; }
  
  public String getProvince() { return province; }
  public void setProvince(String province) { this.province = province; }
  
  public T getRegion() { return region; }
  public void setRegion(T region) { this.region = region; }
}
