package com.hkt.module.core.monitor;

public interface Monitorable<T> {
  public String getMonitorName() ;
  public MonitorSummary getMonitorSummary() ;
  public T getMonitorData() ;
}