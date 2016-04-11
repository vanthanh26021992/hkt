package com.hkt.module.cms;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.cms.entity.NodeAttributes;
import com.hkt.module.cms.entity.NodeDetail;
import com.hkt.module.cms.entity.Template;
import com.hkt.module.cms.util.CMSScenario;
import com.hkt.module.core.ServiceCallback;
import com.hkt.util.json.JSONSerializer;

public class CMSServiceUnitTest extends AbstractUnitTest {

  static ServiceCallback<CMSService> FAIL_CALLBACK = new ServiceCallback<CMSService>() {
    public void callback(CMSService service) {
      throw new RuntimeException("Fail. Expect a rollback if method annotate with the Transactionnal");
    }
  };

  @Autowired
  CMSService service;

  private CMSScenario scenario;

  @Before
  public void setup() throws Exception {
    scenario = CMSScenario.loadTest();
    service.createScenario(scenario);
  }

  @After
  public void tearDown() {
    service.deleteAll();
    service.onInit() ;
  }

  @Test
  public void testScenarioSerialization() throws IOException {
    assertTrue(scenario.getNodes().size() > 0);
    NodeDetail node0 = scenario.getNodes().get(0);
    assertEquals("home", node0.getNode().getPath());
    NodeDetail node1 = scenario.getNodes().get(1);
    assertEquals("home/thang", node1.getNode().getPath());
    NodeDetail thangAvatarNode = scenario.getNodes().get(2);
    assertEquals("home/thang/avatar.png", thangAvatarNode.getNode().getPath());
    NodeAttributes attrs = thangAvatarNode.getAttributes();
    assertTrue(attrs.size() > 0);
    assertEquals("Hinh dai dien avatar", attrs.getAttritute("description").getValue());
  }

  @Test
  public void testNodeCrud() {
    NodeDetail detail = service.getNodeDetail("home/thang/avatar.png");
    assertNotNull(detail);
    assertEquals("avatar.png", detail.getNode().getName());
    assertEquals(2, detail.getAttributes().values().size());
    try {
      service.deleteNode(service.getNodeByPath("home"), FAIL_CALLBACK);
    } catch (Exception e) {
      System.out.println("Fail callback exception: " + e.getMessage());
    }
    assertEquals("avatar.png", detail.getNode().getName());
    
    service.deleteNode(service.getNodeByPath("home"));
    assertNull(service.getNodeByPath("home/thang/avatar.png"));
    assertNull(service.getNodeByPath("home/thang"));
    assertNull(service.getNodeByPath("home"));
  }

  @Test
  public void testCreateIfNotExists() throws IOException {
    String path = "home/users/tuan";
    service.createIfNotExists(path);
    assertNotNull(service.getNodeByPath("home"));
    assertNotNull(service.getNodeByPath("home/users"));
    assertEquals("sys/folder", service.getNodeByPath("home/users/tuan").getMimeType());
    
    service.createIfNotExists(path);
  }
  
  @Test
  public void testNodeDetail() throws IOException {
    NodeDetail root = service.getNodeDetail(null);
    assertTrue(root.getChildren().size() > 0);
    System.out.println(JSONSerializer.INSTANCE.toString(root));
    System.out.println("----------------------------------------");
    NodeDetail home = service.getNodeDetail("home");
    System.out.println(JSONSerializer.INSTANCE.toString(home));
  }
  
  @Test
  public void testTemplate() throws IOException {
    Template template = new Template() ;
    template.setMimeType("hkt/product") ;
    template.setDescription("cms template for hkt product") ;
    template.setTemplate("{}") ;
    service.addTemplate(template) ;
    Template foundTemplate = service.getTemplate("hkt/product") ;
    assertEquals(template.getMimeType(), foundTemplate.getMimeType()) ;
    assertEquals(template.getTemplate(), foundTemplate.getTemplate()) ;
  }
}