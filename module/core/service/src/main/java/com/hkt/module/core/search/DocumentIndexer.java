package com.hkt.module.core.search;

import java.io.IOException;

import org.apache.lucene.analysis.Analyzer ;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.index.Term;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.Version;
/**
 * Author : Tuan Nguyen
 */
public class DocumentIndexer {
  private IndexWriter indexWriter ;

  public DocumentIndexer() throws Exception {
  	init(new RAMDirectory()) ;
  }
  
  public DocumentIndexer(Directory directory) throws Exception {
  	if(directory != null) init(directory) ;
  }
  
  protected void init(Directory directory) throws Exception {
    if(IndexWriter.isLocked(directory)) IndexWriter.unlock(directory) ;
    Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_46);
    IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_46, analyzer);
    iwc.setOpenMode(OpenMode.CREATE_OR_APPEND);
    iwc.setRAMBufferSizeMB(128);
    this.indexWriter = new IndexWriter(directory, iwc);
  }

  IndexWriter getIndexWriter() { return this.indexWriter ; }
  
  public void index(IndexDocument idoc) throws IOException {
    indexWriter.addDocument(idoc.getIndexDocument()) ;
  }
  
  public void delete(String field, String term) throws Exception {
    indexWriter.deleteDocuments(new Term(field, term)) ;
  }
  
  public void deleteAll() throws Exception {
    indexWriter.deleteAll() ;
  }
  
  public void optimize() throws Exception {
    indexWriter.maybeMerge() ;
  }
  
  public void commit() throws IOException {
    indexWriter.commit() ;
  }
  
  public void close() throws IOException {
    indexWriter.close(true) ;
  }
}