package com.hkt.client.web.rest;

import org.junit.Test;

import com.hkt.util.IOUtil;
import com.hkt.util.json.JSONSerializer;

public class ClientContextUnitTest {
  @Test
  public void testSerialization() throws Exception {
//    String json = IOUtil.getFileContentAsString("src/main/webapp/hkt/js/data/config.json", "UTF-8") ;
//    ClientContext ctx = JSONSerializer.INSTANCE.fromString(json, ClientContext.class) ;
//    System.out.println(JSONSerializer.INSTANCE.toString(ctx));
  }
  
  @Test
  public void testUIConfigSerialization() throws Exception {
    String json = IOUtil.getFileContentAsString("src/main/webapp/hkt/config/webapp.json", "UTF-8") ;
    WebAppConfig config = JSONSerializer.INSTANCE.fromString(json, WebAppConfig.class) ;
    System.out.println(JSONSerializer.INSTANCE.toString(config));
  }
  
  @Test
  public void testJSON() throws Exception {
    String json = IOUtil.getFileContentAsString("src/main/webapp/hkt/scenario/default/account.json", "UTF-8") ;
    JSONSerializer.INSTANCE.fromString(json) ;
  }
}