package com.hkt.module.core.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hkt.module.core.monitor.MonitorSummary;
import com.hkt.module.core.monitor.Monitorable;
import com.hkt.util.json.JSONSerializer;

@Service("RestService")
public class RestService implements Monitorable<RestMonitorData>{
  private RestMonitorData monitor = new RestMonitorData() ;
  private Map<String, Dispatcher> dispatchers ;
  
  @Autowired
  public void setDispatchers(Dispatcher[] list) {
    dispatchers = new HashMap<String, Dispatcher>() ;
    for(Dispatcher sel : list) {
      dispatchers.put(sel.getModule() + sel.getServiceName(), sel) ;
    }
  }
  
  public Response dispatch(Request req) {
    Response response = new Response(req) ;
    response.setServiceReceiveAtTime(System.currentTimeMillis()) ;
    Dispatcher dispatcher = dispatchers.get(req.getModule() +  req.getService()) ;
    if(dispatcher != null) {
      try { 
        if(req.isLogEnable()) {
          response.addLog("found service " + req.getService() + " in the module " + req.getModule()) ;
        }
        dispatcher.dispatch(req, response) ;
      } catch(Exception ex) {
        System.err.println("Request: ") ;
        System.err.println(JSONSerializer.INSTANCE.toString(req)) ;
        ex.printStackTrace() ;
        response.setException(ex.getMessage()) ;
      }
    } else {
      response.addLog("Not found service " + req.getService() + " in the module " + req.getModule()) ;
    }
    response.setServiceFinishAtTime(System.currentTimeMillis()) ;
    monitor.onRequest(req, response) ;
    return response ;
  }
  
  public String getMonitorName() { return "RestMonitor"; }

  public MonitorSummary getMonitorSummary() {
    MonitorSummary summary = new MonitorSummary() ;
    summary.setName(getMonitorName()) ;
    summary.setDescription("Monitor the rest api calls") ;
    summary.addProperty("Calls", monitor.getTotalCall()) ;
    summary.addProperty("Errors", monitor.getTotalError()) ;
    summary.addProperty("Agv Exec Time", monitor.getAvgExecTime()) ;
    summary.addProperty("Max Exec Time", monitor.getMaxExecTime()) ;
    return summary ;
  }
  
  public RestMonitorData getMonitorData() { return this.monitor ; }
}
