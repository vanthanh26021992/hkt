package com.hkt.module.core.entity;


abstract public class ReportTableProcessor<T> {
  public void onStart(ReportTable report) {
  }
  
  abstract public void process(ReportTable report, T entity) ;
  
  public void onFinish(ReportTable report) {
  }
}