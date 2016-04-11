package com.hkt.module.core.search;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.hkt.util.json.JSONSerializer;

/**
 * Author : Tuan Nguyen
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
  locations = {
    "classpath:META-INF/spring/module.core.service.xml"
  }
)
public class FSSearchServiceUnitTest {
  
  @Autowired
  private FSSearchService service ;
  
  @Before
  public void setup() throws Exception {
    service.delete(TestDoc.class) ;
  }

  @Test
  public void test() throws Exception {
    TestDoc doc = null ;
    for(int i = 0 ; i < 10; i ++) {
      doc = new TestDoc() ;
      doc.setId(i) ;
      doc.setTitle("this is the title " + i) ;
      doc.setSummary("this is the summary " + i) ;
      doc.setText("this is the text " + i) ;
      service.add(doc.getId(), doc, true) ;
    }
    doc.setText(doc.getText() + "(update tu.phan@hktconsultant.com)") ;
    service.add(doc.getId(), doc, false) ;
    
    SearchResult<TestDoc> result = service.query(TestDoc.class, new SearchQuery("title:title")) ;
    assertEquals(10, result.getTotalHits()) ;
    
    result = service.query(TestDoc.class, new SearchQuery("update")) ;
    assertEquals(1, result.getTotalHits()) ;
    
    result = service.query(TestDoc.class, new SearchQuery("Tu.Phan\\@hktconsultant.com")) ;
    assertEquals(1, result.getTotalHits()) ;
    
    System.out.println(JSONSerializer.INSTANCE.toString(result));
  }

  @Component
  static public class TestDocSearchPlugin extends SearchPlugin<TestDoc> {

    public String getName() { return TestDoc.class.getSimpleName() ; }
    
    public Class<TestDoc> getType() { return TestDoc.class ; } 
    
    public IndexDocument create(TestDoc entity) throws IOException {
      IndexDocument idoc = new IndexDocument() ;
      idoc.addTitle(entity.getTitle()) ;
      idoc.addSummary(entity.getSummary()) ;
      idoc.addText(entity.getText()) ;
      idoc.addSource(entity) ;
      return idoc ;
    }
  }
  
  static class TestDoc {
    private long   id ;
    private String title;
    private String summary;
    private String text ;
    
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getText() { return text;}
    public void setText(String text) { this.text = text; }
  }
}
