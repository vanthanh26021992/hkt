package com.hkt.module.core.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hkt.util.BeanInspector;
import com.hkt.util.text.TabularPrinter;

public class ReportTable implements Serializable{
  private SQLSelectQuery query ;
  private List<Map<String, Object>> records   = new ArrayList<Map<String, Object>>();

  public SQLSelectQuery getQuery() {  return query; }

  public void setQuery(SQLSelectQuery query) { this.query = query; }

  public void addRecord(Map<String, Object> record) {
    records.add(record);
  }

  public <T> Map<String, Object> createRecord(T record) {
    BeanInspector<T> typeInspector = BeanInspector.get(record.getClass());
    Map<String, Object> map = new HashMap<String, Object>();
    for (String property : typeInspector.getPropertyNames()) {
      Object val = typeInspector.getValue(record, property);
      map.put(property, val);
    }
    return map ;
  }

  public <T> Map<String, Object> createRecord(T record, String[] properties) {
    BeanInspector<T> typeInspector = BeanInspector.get(record.getClass());
    Map<String, Object> map = new HashMap<String, Object>();
    for (String property : properties) {
      Object val = typeInspector.getValue(record, property);
      map.put(property, val);
    }
    return map ;
  }
  
  public <T> Map<String, Object> createRecord(T record, Collection<String> properties) {
    BeanInspector<T> typeInspector = BeanInspector.get(record.getClass());
    Map<String, Object> map = new HashMap<String, Object>();
    for (String property : properties) {
      Object val = typeInspector.getValue(record, property);
      map.put(property, val);
    }
    return map ;
  }
  
  public List<Map<String, Object>> getRecords() {
    return records;
  }

  public void setRecords(List<Map<String, Object>> records) {
    this.records = records;
  }

  public void dump(String[] field) {
    int[] width = new int[field.length] ;
    for(int i = 0; i < width.length; i++) width[i] = 15 ;
    TabularPrinter p = new TabularPrinter(System.out, width) ;
    p.printHeader(field) ;
    for(int i = 0; i < records.size(); i++) {
      Map<String, Object> record = records.get(i) ;
      Object[] values = new Object[field.length] ;
      for(int j = 0; j < field.length; j++) {
        values[j] = record.get(field[j]) ;
      }
      p.printRow(values) ;
    }
  }
  
  public void dumpEx(String[] field) {
    int[] width = new int[field.length] ;
    for(int i = 0; i < width.length; i++) width[i] = 15 ;
    for(int i = 0; i < records.size(); i++) {
      Map<String, Object> record = records.get(i) ;
      Object[] values = new Object[field.length] ;
      for(int j = 0; j < field.length; j++) {
        values[j] = record.get(field[j]) ;
      }
    }
  }
}
