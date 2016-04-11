package com.hkt.module.core.search;

import java.io.IOException;

abstract public class SearchPlugin<T> {
  abstract public String getName() ;
  abstract public Class<T> getType() ;
  abstract public IndexDocument create(T entity) throws IOException ;
}
