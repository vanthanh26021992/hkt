package com.hkt.module.core.entity;

import java.util.List;

public class FilterResult<T> {
  private FilterQuery filterQuery;
  private List<T>     data;
  
  public FilterResult() {}
  
  public FilterResult(FilterQuery query) {
    filterQuery = query ;
  }

  public FilterQuery getFilterQuery() {
    return filterQuery;
  }

  public void setFilterQuery(FilterQuery query) {
    this.filterQuery = query;
  }

  public List<T> getData() {
    return data;
  }

  public void setData(List<T> data) {
    this.data = data;
  }

}
