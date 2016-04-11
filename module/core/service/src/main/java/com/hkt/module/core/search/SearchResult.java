package com.hkt.module.core.search;

import java.util.ArrayList;
import java.util.List;

public class SearchResult<T> {
  private SearchQuery     query;
  private int             totalHits;
  private List<Record<T>> records;

  public SearchResult() {
  }

  public SearchResult(SearchQuery query, int totalHits) {
    this.query = query;
    this.totalHits = totalHits;
  }

  public SearchQuery getQuery() {
    return query;
  }

  public void setQuery(SearchQuery query) {
    this.query = query;
  }

  public int getTotalHits() {
    return totalHits;
  }

  public void setTotalHits(int totalHits) {
    this.totalHits = totalHits;
  }

  public List<Record<T>> getRecords() {
    return records;
  }

  public void setRecords(List<Record<T>> records) {
    this.records = records;
  }

  public void add(T entity, float score) {
    if(records == null) records = new ArrayList<Record<T>>() ;
    records.add(new Record<T>(entity, score)) ;
  }
  
  static public class Record<T> {
    T     entity;
    float score;

    public Record() {
    }

    public Record(T entity, float score) {
      this.entity = entity;
      this.score = score;
    }

    public T getEntity() {
      return entity;
    }

    public void setEntity(T entity) {
      this.entity = entity;
    }

    public float getScore() {
      return score;
    }

    public void setScore(float score) {
      this.score = score;
    }
  }
}
