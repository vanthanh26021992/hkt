package com.hkt.client.web.rest;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.RestTemplate;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/test-beans.xml" })
public class ControllerIntegrationTest {

  @Autowired
  @Qualifier("restTemplate")
  private RestTemplate restTemplate;

  @Test
  public void testMethodCall() {
    ServiceDescription sd = new ServiceDescription();
    sd.setName("My Service");
    sd.setDescription("My custom service help") ;
    ServiceDescription ret = restTemplate.postForObject("http://localhost:7080/rest/add.json", sd, ServiceDescription.class);
    System.out.println(ret.getName());
    
    @SuppressWarnings("unchecked")
	List<ServiceDescription> serviceDescs= 
      restTemplate.getForObject("http://localhost:7080/rest/help.json", List.class);
    Assert.assertNotNull(serviceDescs);
    Assert.assertTrue(serviceDescs.size() > 0);
  }
}
