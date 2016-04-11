package com.hkt.module.core.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.node.BooleanNode;
import org.codehaus.jackson.node.DoubleNode;
import org.codehaus.jackson.node.IntNode;
import org.codehaus.jackson.node.LongNode;
import org.codehaus.jackson.node.POJONode;
import org.codehaus.jackson.node.TextNode;

import com.hkt.util.json.JSONSerializer;

public class Request {
  private long     requestAtTime;
  private String   module;
  private String   service;
  private String   method;
  private Map<String,JsonNode> params;
  private boolean  logEnable;

  public Request() { }
  
  public Request(String module, String service, String method) {
    this.requestAtTime = System.currentTimeMillis() ;
    this.module = module ;
    this.service = service ;
    this.method = method ;
  }
  
  public long getRequestAtTime() {
    return requestAtTime;
  }

  public void setRequestAtTime(long requestAtTime) {
    this.requestAtTime = requestAtTime;
  }

  public String getModule() {
    return module;
  }

  public void setModule(String module) {
    this.module = module;
  }

  public String getService() {
    return service;
  }

  public void setService(String service) {
    this.service = service;
  }

  public String getMethod() {
    return method;
  }

  public void setMethod(String method) {
    this.method = method;
  }

  public Map<String, JsonNode> getParams() {
    return params;
  }

  public void setParams(Map<String,JsonNode> params) {
    this.params = params;
  }

  @JsonIgnore
  public <T> T getParamsAs(String name, Class<T> type) throws IOException {
    JsonNode node = params.get(name) ;
    if(node == null) return null ;
    return JSONSerializer.INSTANCE.fromJsonNode(node, type) ;
  }
  
  @JsonIgnore
  JsonNode[] getJsonNodeParams() {
    return params.values().toArray(new JsonNode[params.size()]) ;
  }
  
  public void addParam(String name, Object param) throws IOException {
    if(params == null) params = new LinkedHashMap<String, JsonNode>() ;
    if(param.getClass() == String.class) {
      params.put(name, new TextNode((String) param)) ;
    } else  if(param.getClass() == Integer.class) {
      params.put(name, new IntNode((Integer) param)) ;
    } else  if(param.getClass() == Long.class) {
      params.put(name, new LongNode((Long) param)) ;
    } else  if(param.getClass() == Double.class) {
      params.put(name, new DoubleNode((Double) param)) ;
    } else  if(param.getClass() == Boolean.class) {
      params.put(name, BooleanNode.valueOf((Boolean) param)) ;
    } else {
      params.put(name, JSONSerializer.INSTANCE.toJsonNode(param)) ;
    }
  }
  
  public boolean isLogEnable() {
    return logEnable;
  }

  public void setLogEnable(boolean b) {
    this.logEnable = b;
  }
}
