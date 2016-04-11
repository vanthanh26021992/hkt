package com.hkt.module.core;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

import org.springframework.stereotype.Service;

import com.hkt.module.core.monitor.MonitorSummary;
import com.hkt.module.core.monitor.Monitorable;
import com.hkt.util.jvm.JVMInfo;
import com.hkt.util.jvm.MemoryInfo;
import com.hkt.util.text.DateUtil;
import com.hkt.util.text.NumberFormatter;

@Service
public class JVMService implements Monitorable<JVMInfo>{
  public String getMonitorName() { return "JVM Monitor"; }

  public MonitorSummary getMonitorSummary() {
    MonitorSummary summary = new MonitorSummary() ;
    summary.setName(getMonitorName()) ;
    summary.setDescription("Monitor the jvm") ;
    String startTime = 
      DateUtil.asCompactDateTime(ManagementFactory.getRuntimeMXBean().getStartTime()) ;
    String upTime = 
      NumberFormatter.milliTimeAsHumanReadable(ManagementFactory.getRuntimeMXBean().getUptime()) ;
    MemoryInfo mInfo = new MemoryInfo();
    summary.addProperty("Start Time", startTime) ;
    summary.addProperty("Up Time", upTime) ;
    summary.addProperty("Mem Init", mInfo.getInit()) ;
    summary.addProperty("Mem Max", mInfo.getMax()) ;
    summary.addProperty("Mem Use", mInfo.getUse()) ;
    return summary ;
  }
  
  public JVMInfo getMonitorData() { return new JVMInfo() ; }
  
  public String getMemoryInfo() {
    System.gc();
    MemoryMXBean mbean = ManagementFactory.getMemoryMXBean();
    MemoryUsage memory = mbean.getHeapMemoryUsage() ;

    String init = NumberFormatter.byteFormatAsHumanReadable(memory.getInit()) ;
    String max = NumberFormatter.byteFormatAsHumanReadable(memory.getMax()) ;
    String used = NumberFormatter.byteFormatAsHumanReadable(memory.getUsed()) ;
    String committed = NumberFormatter.byteFormatAsHumanReadable(memory.getCommitted()) ;
    
    return "init=" + init + ", max=" + max + ", used=" + used + ", committed=" + committed;
  }
}
