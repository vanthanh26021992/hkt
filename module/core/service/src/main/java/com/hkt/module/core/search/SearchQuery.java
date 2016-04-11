package com.hkt.module.core.search;

public class SearchQuery {
  private int    from = 0 ;
  private int    limit = 100 ;
  private String query;

  public SearchQuery() {} 
  
  public SearchQuery(String query) {
    this.query = query ;
  }
  
  public int getFrom() {
    return from;
  }

  public void setFrom(int from) {
    this.from = from;
  }

  public int getLimit() {
    return limit;
  }

  public void setLimit(int limit) {
    this.limit = limit;
  }

  public String getQuery() {
    return query;
  }

  public void setQuery(String query) {
    this.query = query;
  }

}
