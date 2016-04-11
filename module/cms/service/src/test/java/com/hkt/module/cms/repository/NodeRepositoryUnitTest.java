package com.hkt.module.cms.repository;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.cms.AbstractUnitTest;
import com.hkt.module.cms.entity.Node;


public class NodeRepositoryUnitTest extends AbstractUnitTest{
  @Autowired
  NodeRepository repository;
  
  @Before
  public void setup() {
    repository.deleteAll();
  }
  
  @Test
  public void testCrud() {
    Node node = repository.save(create(null, "Nodename", "type"));
    assertEquals(node, repository.findOne(node.getId()));
    assertEquals("Nodename", repository.findByPath("Nodename").getName());
    repository.delete(node);
    assertEquals(0, repository.count());
  }

  @Test
  public void testFind() {
    Node node = repository.save(create(null, "Nodename", "type"));
    for (int i = 0; i < 5; i++) {
      repository.save(create(node, "Nodename" + i, "type"));
    }
    assertEquals(5, repository.findChildren(node.getId()).size());
    assertEquals(6, repository.findByRange(0, 10).size());
    assertEquals(3, repository.findByRange(0, 3).size());
  }

  public Node create(Node nodeParent, String name, String mineType) {
    Node node = new Node();
    node.setName(name);
    node.setMimeType(mineType);
    node.setParent(nodeParent);
    return node;
  }
}
