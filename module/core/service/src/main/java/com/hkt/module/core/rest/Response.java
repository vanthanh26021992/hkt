package com.hkt.module.core.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.type.TypeReference;

import com.hkt.module.core.entity.FilterResult;
import com.hkt.util.json.JSONSerializer;

public class Response {
  private long         requestAtTime;
  private long         serviceReceiveAtTime;
  private long         serviceFinishAtTime;

  private String       module;
  private String       service;
  private String       method;

  private JsonNode     data;

  private List<String> logs;
  private String       exception;

  public Response() {
  }

  public Response(Request req) {
    this.requestAtTime = req.getRequestAtTime();
    this.module = req.getModule();
    this.service = req.getService();
    this.method = req.getMethod();
  }

  public long getRequestAtTime() {
    return requestAtTime;
  }

  public void setRequestAtTime(long requestAtTime) {
    this.requestAtTime = requestAtTime;
  }

  public long getServiceReceiveAtTime() {
    return serviceReceiveAtTime;
  }

  public void setServiceReceiveAtTime(long serviceReceiveAtTime) {
    this.serviceReceiveAtTime = serviceReceiveAtTime;
  }

  public long getServiceFinishAtTime() {
    return serviceFinishAtTime;
  }

  public void setServiceFinishAtTime(long serviceFinishAtTime) {
    this.serviceFinishAtTime = serviceFinishAtTime;
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

  public JsonNode getData() {
    return data;
  }

  public void setData(JsonNode data) {
    this.data = data;
  }

  @JsonIgnore
  public <T> T getDataAs(Class<T> type) throws Exception {
    if(exception != null) {
      throw new Exception(exception) ;
    }
    if(data == null) return null ;
    return JSONSerializer.INSTANCE.fromJsonNode(data, type);
  }
  
  @JsonIgnore
  public <T> List<T> getDataAs(TypeReference<List<T>> tref) throws Exception {
    if(exception != null) {
      throw new Exception(exception) ;
    }
    return JSONSerializer.INSTANCE.fromJsonNode(data, tref);
  }
  
  @JsonIgnore
  public <T> FilterResult<T> getDataAsByFilter(TypeReference<FilterResult<T>> tref) throws Exception {
    if(exception != null) {
      throw new Exception(exception) ;
    }
    return JSONSerializer.INSTANCE.fromJsonNode(data, tref);
  }

  @JsonIgnore
  public <T> void setDataAs(T obj) throws IOException {
    if(obj == null) {
      data = null; 
    } else {
      data = JSONSerializer.INSTANCE.toJsonNode(obj);
    }
  }

  public List<String> getLogs() {
    return logs;
  }

  public void setLogs(List<String> logs) {
    this.logs = logs;
  }
  
  public void addLog(String log) {
    if(logs == null) logs = new ArrayList<String>() ;
    logs.add(log) ;
  }

  public String getException() {
    return exception;
  }

  public void setException(String exception) {
    this.exception = exception;
  }
}
