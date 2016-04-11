package com.hkt.module.core.rest;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonNode;
import org.springframework.stereotype.Component;

import com.hkt.util.json.JSONSerializer;

@Component
public class ProxyDispatcher implements Dispatcher {
  private String module ;
  private String serviceName ;
  private Object service ;
  private Map<String, MethodHandler> handlers = new HashMap<String, MethodHandler>() ;
  
  @Override
  public String getModule() { return module; }
  public void   setModule(String module) { this.module = module ; }
  
  @Override
  public String getServiceName() { return serviceName ; }
  public void   setServiceName(String service) { this.serviceName = service ; }
  
  public void   setService(Object service) { 
    this.service = service ; 
    Method[] method = service.getClass().getDeclaredMethods() ;
    for(Method sel : method) {
      if(!Modifier.isPublic(sel.getModifiers())) continue ;
      
      Class[] paramType = sel.getParameterTypes()  ;
      handlers.put(sel.getName(), new MethodHandler(sel, paramType)) ;
    }
  }
  
  @Override
  public void dispatch(Request req, Response res) throws Exception {
    String name = req.getMethod() ;
    MethodHandler handler = handlers.get(name) ;
    if(handler == null) {
      res.addLog("Cannot find the method " + name) ;
      return ;
    }
    if(handler.paramType.length == 0) {
      Object result = handler.invoke(service, null) ;
      res.setDataAs(result) ;
    } else {
      Object[] args = new Object[handler.paramType.length] ;
      JsonNode[] jsonParams = req.getJsonNodeParams() ;
      for(int i = 0; i < args.length; i++) {
        if(jsonParams[i] == null) {
          args[i] = null ;
        } else {
          args[i] = JSONSerializer.INSTANCE.fromJsonNode(jsonParams[i], handler.paramType[i]) ;
        }
      }
      Object result =  handler.invoke(service, args) ;
      res.setDataAs(result) ;
    }
  }

  Object fromJsonNode(JsonNode node, Class type) throws IOException {
    if(type == String.class) return node.asText() ;
    return JSONSerializer.INSTANCE.fromJsonNode(node, type) ;
  }
  
  static class MethodHandler {
    private Method method ;
    private Class[]  paramType ;
  
    public MethodHandler(Method method, Class[]  paramType) {
      this.method = method ;
      this.paramType = paramType ;
    }
    
    public Object invoke(Object src, Object[] arg) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
      return method.invoke(src, arg) ;
    }
  }
}
