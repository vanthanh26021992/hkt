package com.hkt.module.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hkt.module.core.monitor.MonitorSummary;
import com.hkt.module.core.monitor.Monitorable;
import com.hkt.module.core.rest.RestMonitorData;
import com.hkt.module.core.rest.RestService;

@Service("ServerService")
public class ServerService {
  @Autowired
  private RestService restService;
  
  @Autowired
  private Monitorable<?>[] monitorables;
  
  public MonitorSummary[] getMonitorSummaries() {
    MonitorSummary[] summary = new MonitorSummary[monitorables.length];
    for (int i = 0; i < summary.length; i++) {
      summary[i] = monitorables[i].getMonitorSummary();
    }
    return summary;
  }
  
  public <T> T getMonitorData(String name) {
    for (Monitorable<?> sel : monitorables) {
      if (name.equals(sel.getMonitorName())) {
        return (T) sel.getMonitorData();
      }
    }
    return null;
  }
  
  public RestMonitorData getRestMonitor() {
    return restService.getMonitorData();
  }
}
