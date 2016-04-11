package com.hkt.module.core.search;

import java.io.IOException;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.util.Version;

public class DocumentSearcher {
  private IndexWriter   writer ;
  private IndexSearcher indexSearcher ;
  private Analyzer      analyzer      ;
  
  public DocumentSearcher(IndexWriter writer) throws Exception {
  	init(writer) ;
  }
  
  protected void init(IndexWriter writer) throws Exception {
    this.writer = writer ;
    this.analyzer = new StandardAnalyzer(Version.LUCENE_46) ;
    update() ;
  }
  
  
  public void update() throws IOException {
    IndexReader reader = DirectoryReader.open(writer, true);
    this.indexSearcher = new IndexSearcher(reader) ;
  }
  
  public Analyzer getAnalyzer() { return this.analyzer ; }
  
  public TopScoreDocCollector query(String query) throws Exception {
    TopScoreDocCollector collector = TopScoreDocCollector.create(1000, false) ;
    DocumentQueryParser parser = new DocumentQueryParser(analyzer) ;
    indexSearcher.search(parser.parse(query), null, collector) ;
    return collector ;
  }
  
  public TopScoreDocCollector query(String query,  int limit) throws Exception {
    TopScoreDocCollector collector = TopScoreDocCollector.create(limit, false) ;
    if((query == null || query.length() == 0)) return collector ;
    
    DocumentQueryParser parser = new DocumentQueryParser(analyzer) ;
    Query pquery = parser.parse(query) ;
    System.out.println("LUCENE QUERY: " + pquery);
    indexSearcher.search(pquery, null, collector) ;
    return collector ;
  }
  
  
  public TopScoreDocCollector query(Query query,  int limit) throws Exception {
    TopScoreDocCollector collector = TopScoreDocCollector.create(limit, false) ;
    if(query == null) return collector ;
    indexSearcher.search(query, null, collector) ;
    return collector ;
  }

  public Document getDocument(int docId) throws Exception {
    return indexSearcher.getIndexReader().document(docId) ;
  }
  
  public void close() throws IOException {
    indexSearcher.getIndexReader().close() ;
  }
}