package com.hkt.module.core.rest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.hkt.util.json.JSONReader;
import com.hkt.util.json.JSONSerializer;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
  locations = {
    "classpath:META-INF/spring/module.core.service.xml"
  }
)
public class RestServiceUnitTest {
  @Autowired
  RestService service ;
  
  @Test
  public void testRequest() throws Exception {
    JSONReader reader = new JSONReader("src/test/resources/Request.json") ;
    Request request = reader.read(Request.class) ;
    reader.close() ;
    System.out.println(JSONSerializer.INSTANCE.toString(request)) ;
   
    assertEquals("string", request.getParamsAs("string", String.class)) ;
    assertEquals(new Integer(1), request.getParamsAs("integer", Integer.class)) ;
    
    Data object = request.getParamsAs("object", Data.class) ;
    assertNotNull(object) ;
    assertEquals("string", object.getString()) ;
    assertEquals(2, object.getStringArray().length) ;
    assertNotNull(object.getNestedData()) ;
    assertEquals("string", object.getNestedData().getString()) ;
    assertEquals(2, object.getNestedData().getStringArray().length) ;
  }
  
  @Test
  public void testResponse() throws Exception {
    JSONReader reader = new JSONReader("src/test/resources/Response.json") ;
    Response res = reader.read(Response.class) ;
    reader.close() ;
    
    System.out.println(JSONSerializer.INSTANCE.toString(res)) ;
    assertNotNull(res.getException()) ;
    res.setException(null) ;
    Data data = res.getDataAs(Data.class) ;
    assertNotNull(data) ;
    assertEquals("string", data.getString()) ;
    assertEquals(2, data.getStringArray().length) ;
    assertNotNull(data.getNestedData()) ;
    assertEquals("string", data.getNestedData().getString()) ;
    assertEquals(2, data.getNestedData().getStringArray().length) ;
    assertEquals(2, res.getLogs().size()) ;
  }
  
  @Test
  public void testRestService() throws Exception {
    Request req = new Request("core", "PingService", "ping") ;
    req.setRequestAtTime(System.currentTimeMillis()) ;
    req.setLogEnable(true) ;
    
    Response res = service.dispatch(req) ;
    assertNotNull(res.getLogs()) ;
    
    assertEquals("Hello", res.getDataAs(String.class)) ;
    
    req = new Request("core", "PingService", "hello") ;
    req.addParam("name", "Tuan") ;
    res = service.dispatch(req) ;
    System.out.println(JSONSerializer.INSTANCE.toString(res)) ;
  }
  
  static public class Data {
    String string ;
    String[] stringArray ;
    int integer ;
    int[] integerArray ;
    List<String> List ;
    Data nestedData ;
    
    public String getString() {
      return string;
    }
    
    public void setString(String string) {
      this.string = string;
    }
    public String[] getStringArray() {
      return stringArray;
    }
    public void setStringArray(String[] stringArray) {
      this.stringArray = stringArray;
    }
    public int getInteger() {
      return integer;
    }
    public void setInteger(int integer) {
      this.integer = integer;
    }
    public int[] getIntegerArray() {
      return integerArray;
    }
    public void setIntegerArray(int[] integerArray) {
      this.integerArray = integerArray;
    }
    public List<String> getList() {
      return List;
    }
    public void setList(List<String> list) {
      List = list;
    }

    public Data getNestedData() {
      return nestedData;
    }

    public void setNestedData(Data nested) {
      this.nestedData = nested;
    }
  }
}