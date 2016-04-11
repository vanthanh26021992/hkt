package com.hkt.module.cms.rest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.cms.AbstractUnitTest;
import com.hkt.module.cms.CMSService;
import com.hkt.module.cms.entity.Node;
import com.hkt.module.cms.util.CMSScenario;
import com.hkt.module.core.ServiceCallback;
import com.hkt.module.core.rest.Request;
import com.hkt.module.core.rest.Response;
import com.hkt.module.core.rest.RestService;
import com.hkt.util.json.JSONSerializer;

public class CMSServiceDispatcherUnitTest extends AbstractUnitTest {
  static ServiceCallback<CMSService> FAIL_CALLBACK = new ServiceCallback<CMSService>() {
    public void callback(CMSService service) {
      throw new RuntimeException("Fail. Expect a rollback if method annotate with the Transactionnal");
    }
  };

  @Autowired
  RestService restService;

  @Autowired
  CMSService service;

  @Before
  public void setup() throws Exception {
    CMSScenario scenario = CMSScenario.loadTest();
    service.createScenario(scenario) ;
  }

  @After
  public void tearDown() {
    service.deleteAll();
  }

  @Test
  public void testRestService() throws Exception {
    Request req = new Request("cms", "CMSService", "getNodeByPath");
    req.addParam("path", "home");
    Response res = restService.dispatch(req);
    System.out.println(JSONSerializer.INSTANCE.toString(res));
    Node node = res.getDataAs(Node.class);
    assertNotNull(node);
    assertEquals("home", node.getName());
  }

  @Test
  public void testPing() throws Exception {
    Request req = new Request("cms", "CMSService", "ping");
    Response res = restService.dispatch(req);
    System.out.println(JSONSerializer.INSTANCE.toString(res));
  }

}
