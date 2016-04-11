package com.hkt.module.core.search;

import java.io.File;

import org.apache.lucene.store.FSDirectory;
/**
 * Author : Tuan Nguyen
 */
public class FSDocumentIndexer extends DocumentIndexer {
  private String indexName ;
  private String shardName ;
  private String indexDir ;
  
  public FSDocumentIndexer(String baseDir, String indexName, String shardName) throws Exception {
    super(null) ;
  	this.indexName = indexName ;
    this.shardName = shardName ;
    this.indexDir = baseDir + "/" + indexName + "/" + shardName ;
    File file = new File(indexDir) ;
    init(FSDirectory.open(file)) ;
  }
  
  public String getShardName() { return this.shardName ; }
  
  public String getIndexName() { return this.indexName ; }

  public String getIndexDir()  { return this.indexDir ; }
}