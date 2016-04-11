package com.hkt.util.json;

import java.io.IOException;
import java.util.Date;

import org.junit.Test;

public class JSONSerializerUnitTest {
  @Test
  public void testSerialization() throws IOException {
    Dummy dummy = new Dummy() ;
    dummy.setString("a string") ;
    dummy.setInteger(10) ;
    dummy.setBool(true) ;
    dummy.setDate(new Date()) ;
    
    String json = JSONSerializer.INSTANCE.toString(dummy) ;
    System.out.println(json);
    dummy = JSONSerializer.INSTANCE.fromString(json, Dummy.class) ;
    System.out.println(JSONSerializer.INSTANCE.toString(dummy));
  }
  
  static public class Dummy {
    private String string ;
    private int    integer ;
    private boolean bool ;
    private Date   date  ;
    public String getString() {
      return string;
    }
    public void setString(String string) {
      this.string = string;
    }
    public int getInteger() {
      return integer;
    }
    public void setInteger(int integer) {
      this.integer = integer;
    }
    public boolean isBool() {
      return bool;
    }
    public void setBool(boolean bool) {
      this.bool = bool;
    }
    public Date getDate() {
      return date;
    }
    public void setDate(Date date) {
      this.date = date;
    }
    
    
  }
}
