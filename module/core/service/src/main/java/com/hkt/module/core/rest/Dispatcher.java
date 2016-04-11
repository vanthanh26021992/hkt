package com.hkt.module.core.rest;

public interface Dispatcher {
  public String getModule() ;
  public String getServiceName() ;
  public void dispatch(Request request, Response response) throws Exception ;
}
