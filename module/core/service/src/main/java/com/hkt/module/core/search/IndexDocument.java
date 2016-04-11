package com.hkt.module.core.search;

import java.io.IOException;
import java.util.Date;

import org.apache.lucene.document.BinaryDocValuesField;
import org.apache.lucene.document.CompressionTools;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.DoubleField;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.FloatField;
import org.apache.lucene.document.IntField;
import org.apache.lucene.document.LongField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.document.StoredField ;
import org.apache.lucene.util.BytesRef;

import com.hkt.util.json.JSONSerializer;
/**
 * @author tuan field id: id field date: created:date field vntxt: content:vntxt
 *         field long: number:long field dbl: price:dbl
 */
public class IndexDocument {
  private Document document = new Document();

  public Document getIndexDocument() {
    return this.document;
  }

  public void add(String fname, String value) {
    if (value == null) return;
    Field lfield = new StringField(fname, value, Store.YES);
    document.add(lfield);
  }

  public void add(String fname, String[] value) {
    if (value == null || value.length == 0) return;
    Field lfield = new TextField(fname, new WordTokenStream(value));
    document.add(lfield);
  }

  public void add(String fname, int value) {
    IntField lfield = new IntField(fname, value, Store.YES);
    document.add(lfield);
  }

  public void add(String fname, long value) {
    LongField lfield = new LongField(fname, value, Store.YES);
    document.add(lfield);
  }

  public void add(String fname, Date value) {
    LongField lfield = new LongField(fname, value.getTime(), Store.YES);
    document.add(lfield);
  }

  public void add(String fname, float value) {
    FloatField lfield = new FloatField(fname, value, Store.YES);
    document.add(lfield);
  }

  public void add(String fname, double value) {
    DoubleField lfield = new DoubleField(fname, value, Store.YES);
    document.add(lfield);
  }

  public void add(String fname, byte[] data) {
    BinaryDocValuesField lfield = new BinaryDocValuesField(fname, new BytesRef(data));
    document.add(lfield);
  }
  
  public void addStore(String fname, Object obj) throws IOException {
    if(obj == null) return ;
    byte[] bytes = JSONSerializer.INSTANCE.toBytes(obj) ;
    bytes = CompressionTools.compress(bytes) ;
    StoredField field = new StoredField(fname, bytes) ;
    document.add(field);
  }
  
  public <T> void addType(SearchPlugin<T> plugin) {
    add(getTypeFieldName(plugin), plugin.getName()) ;
  }
  
  public <T> void addId(SearchPlugin<T> plugin, String id) {
    add(getIdFieldName(plugin), id) ;
  }
  
  public void addTitle(String title) {
    addTitle(Tokenizer.DEFAULT.tokenize(title)) ;
  }
  
  public void addTitle(String[] token) { this.add("title", token) ; }
  
  public void addSummary(String summary) {
    addSummary(Tokenizer.DEFAULT.tokenize(summary)) ;
  }
  
  public void addSummary(String[] token) {
    this.add("summary", token) ;
  }
  
  public void addText(String text) {
    addText(Tokenizer.DEFAULT.tokenize(text)) ;
  }
  
  public void addText(String[] token) {
    this.add("text", token) ;
  }
  
  public <T> void addSource(T entity) throws IOException {
    addStore("source", entity) ;
  }
  
  static public <T> String getTypeFieldName(SearchPlugin<T> plugin) {
    return "doc:type" ;
  }
  
  static public <T> String getIdFieldName(SearchPlugin<T> plugin) {
    return "doc:id:" + plugin.getName();
  }
  
  static public <T> T getSource(Document doc, Class<T> type) throws Exception {
    BytesRef bref = doc.getBinaryValue("source") ;
    if(bref == null) return null ;
    byte[] bytes = CompressionTools.decompress(bref.bytes) ;
    return JSONSerializer.INSTANCE.fromBytes(bytes, type) ;
  }
}