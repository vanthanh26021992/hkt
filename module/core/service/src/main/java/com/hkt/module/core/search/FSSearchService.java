package com.hkt.module.core.search;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.lucene.document.Document;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopScoreDocCollector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hkt.util.FileUtil;

@Service("FSSearchService")
public class FSSearchService {
  private DocumentIndexer  indexer ;
  private DocumentSearcher searcher ;
  private Map<String, SearchPlugin<?>> plugins = new HashMap<String, SearchPlugin<?>>();
  private String indexDir = "target/indexdb";
  private boolean modifiedIndex =  false ;
  
  @PostConstruct
  public void onInit() throws Exception {
    String appDir = System.getProperty("app.dir") ;
    if(appDir != null) {
      appDir = appDir.replace('\\', '/') ;
      indexDir = appDir + "/data/lucene" ;
      if(!FileUtil.exist(indexDir))FileUtil.mkdirs(indexDir);
    }
    indexer = new FSDocumentIndexer(indexDir, "default", "shard0");
    indexer.commit() ;
    searcher = new DocumentSearcher(indexer.getIndexWriter());
  }
  
  @PreDestroy
  public void onDestroy() throws Exception {
    searcher.close() ;
    indexer.close() ;
  }
  
  @Autowired
  public void setPlugins(SearchPlugin<?>[] plugins) {
    for(SearchPlugin<?> sel : plugins) add(sel) ;
  }
  
  public void add(SearchPlugin<?> plugin) {
    plugins.put(plugin.getType().getName(), plugin) ;
  }
  
  public void setIndexDir(String dir) { this.indexDir = dir; }

  public <T> void add(long id, T entity, boolean isNew) throws Exception {
    add(Long.toString(id), entity, isNew) ;
  }
  
  public <T> void add(String id, T entity, boolean isNew) throws Exception {
    SearchPlugin<T> plugin = (SearchPlugin<T>)plugins.get(entity.getClass().getName()) ;
    IndexDocument idoc = plugin.create(entity) ;
    if(!isNew) delete(plugin, id) ;
    idoc.addType(plugin) ;
    idoc.addId(plugin, id) ;
    indexer.index(idoc) ;
    modifiedIndex = true ;
  }
  
  public <T> void delete(Class<T> type, long id) throws Exception {
    delete(type, Long.toString(id)) ;
  }
  
  public <T> void delete(Class<T> type, String id) throws Exception {
    delete((SearchPlugin<T>)plugins.get(type.getName()), id) ;
  }
  
  <T> void delete(SearchPlugin<T> plugin, String id) throws Exception {
    indexer.delete(IndexDocument.getIdFieldName(plugin), id) ;
    modifiedIndex = true ;
  }
  
  public <T> void delete(Class<T> type) throws Exception {
    SearchPlugin<T> plugin = (SearchPlugin<T>) plugins.get(type.getName()) ;
    indexer.delete(IndexDocument.getTypeFieldName(plugin), plugin.getName()) ;
    indexer.commit() ;
  }
  
  
  public <T> void optimize() throws Exception {
    indexer.optimize() ;
    modifiedIndex = false ;
  }
  
  public <T> SearchResult<T> query(Class<T> type, SearchQuery query) throws Exception {
    commitIfModify() ;
    SearchPlugin<T> plugin = (SearchPlugin<T>) plugins.get(type.getName()) ;
    String filterQuery = "doc\\:type:" + plugin.getName() + " " + query.getQuery() ;
    TopScoreDocCollector collector = searcher.query(filterQuery, query.getLimit()) ;
    SearchResult<T> result = new SearchResult<T>(query, collector.getTotalHits()) ;
    ScoreDoc[] docs = collector.topDocs().scoreDocs ;
    for(int i = 0; i < docs.length; i++) {
      Document doc = searcher.getDocument(docs[i].doc) ;
      T entity = IndexDocument.getSource(doc, plugin.getType()) ;
      result.add(entity, docs[i].score) ;
    }
    return result ;
  }
  
  private void commitIfModify() throws IOException {
    if(!modifiedIndex) return ;
    this.searcher.update() ;
    modifiedIndex = false ;
  }
}