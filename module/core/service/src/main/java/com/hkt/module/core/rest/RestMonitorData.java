package com.hkt.module.core.rest;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonIgnore;

public class RestMonitorData implements Serializable {
  private Map<String, ModuleMonitor> modules = new HashMap<String, ModuleMonitor>() ;
  
  public void onRequest(Request req, Response res) {
    ModuleMonitor module = modules.get(req.getModule()) ;
    if(module == null) {
      synchronized(modules) {
        module = modules.get(req.getModule()) ;
        if(module == null) {
          module = new ModuleMonitor(req.getModule()) ;
          modules.put(req.getModule(), module) ;
        }
      }
    }
    module.onRequest(req, res) ;
  }
  
  public ModuleMonitor[] getModules() { 
    return modules.values().toArray(new ModuleMonitor[modules.size()]) ; 
  }
  
  public void setModules(ModuleMonitor[] modules) {
  }
  
  public int getTotalCall() {
    int total = 0 ;
    for(ModuleMonitor sel : modules.values()) total += sel.getRequestCount() ;
    return total ;
  }
  
  public int getTotalError() {
    int total = 0 ;
    for(ModuleMonitor sel : modules.values()) total += sel.getErrorCount() ;
    return total ;
  }
  
  public long getMaxExecTime() {
    long max = 0;
    for(ModuleMonitor sel : modules.values()) {
      if(sel.getMaxExecTime() > max) max  = sel.getMaxExecTime() ;
    }
    return max ;
  }
  
  public long getAvgExecTime() {
    long sum = 0;
    int request  = 0 ;
    for(ModuleMonitor sel : modules.values()) {
      sum += sel.getSumExecTime() ;
      request += sel.getRequestCount() ;
    }
    if(request == 0) return 0 ;
    return sum/request ;
  }
  
  static public class ModuleMonitor implements Serializable  {
    private String module ;
    private int    requestCount ;
    private int    errorCount ;

    private Map<String, CallMonitor> calls = new HashMap<String, CallMonitor>() ;
    
    public ModuleMonitor(String module) {
      this.module = module; 
    }
    
    synchronized public void onRequest(Request req, Response res) {
      requestCount++ ;
      if(res.getException() != null) errorCount++ ;
      CallMonitor call = calls.get(req.getMethod()) ;
      if(call == null) {
        call = new CallMonitor(req.getMethod()) ;
        calls.put(req.getMethod(), call) ;
      }
      call.onRequest(req, res) ;
    }

    public String getModule() { return module; }

    public int getRequestCount() { return requestCount; }

    public int getErrorCount() { return errorCount; }
    
    public long getMaxExecTime() {
      long max = 0 ;
      for(CallMonitor sel : getCalls()) {
        if(sel.getMaxExecTime() > max) max  = sel.getMaxExecTime() ;
      }
      return max ;
    }
    
    public long getAvgExecTime() {
      if(this.requestCount == 0) return 0 ;
      return getSumExecTime()/requestCount;
    }
    
    long getSumExecTime() {
      long sum = 0 ;
      for(CallMonitor sel : getCalls()) {
        sum  += sel.getSumExecTime() ;
      }
      return sum ;
    }
    
    public CallMonitor[] getCalls() {
      return calls.values().toArray(new CallMonitor[calls.size()]);
    }
  }
  
  static public class CallMonitor implements Serializable {
    private String method ;
    private int    requestCount ;
    private int    errorCount ;
    private long   maxExecTime ;
    private long   sumExecTime ;
    
    private Map<String, Integer> errors = new HashMap<String, Integer>() ;
  
    public CallMonitor() {}
    
    public CallMonitor(String method) {
      this.method = method ;
    }
    
    public void onRequest(Request req, Response res) {
      requestCount++ ;
      long execTime = res.getServiceFinishAtTime() - res.getServiceReceiveAtTime() ;
      if(execTime > maxExecTime)  maxExecTime = execTime ;
      sumExecTime +=  execTime ;
      
      if(res.getException() != null) {
        errorCount++ ;
        String error = res.getException() ;
        System.out.println("errors = " + errors);
        System.out.println("error = " + error);
        Integer count = errors.get(error) ;
        if(count == null) count = 1 ;
        else count  = count + 1 ;
        errors.put(error, count + 1) ;
      }
    }

    public String getMethod() { return method; }

    public int getRequestCount() { return requestCount; }

    public int getErrorCount() { return errorCount; }

    public long getMaxExecTime() {
      return maxExecTime;
    }

    @JsonIgnore
    public long getSumExecTime() { return sumExecTime; }

    public long getAvgExecTime() { 
      if(this.requestCount == 0) return  0 ;
      return sumExecTime/requestCount ;
    } 
    
    public Map<String, Integer> getErrors() {
      return errors;
    }
  }
}
