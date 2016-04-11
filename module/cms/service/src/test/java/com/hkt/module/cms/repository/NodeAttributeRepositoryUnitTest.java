package com.hkt.module.cms.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.hkt.module.cms.AbstractUnitTest;
import com.hkt.module.cms.entity.NodeAttribute;

public class NodeAttributeRepositoryUnitTest extends AbstractUnitTest {
  @Autowired
  NodeAttributeRepository repository;

  @Test
  public void testCrud() {
    NodeAttribute attribute = repository.save(create("name", "value", "path"));
    assertEquals(attribute, repository.findOne(attribute.getId()));
    repository.delete(attribute);
    assertEquals(0, repository.count());
  }

  @Test
  public void testFind() {
    for (int i = 0; i < 5; i++) {
      repository.save(create("name " + i, "value", "nodePath"));
    }
    assertEquals(5, repository.findByNodePath("nodePath").size());
    
    Pageable topTen = new PageRequest(0, 10);
    Page<NodeAttribute> page = repository.findByNodePath("nodePath", topTen);
    assertTrue(page.isFirstPage()) ;
    assertEquals(1, page.getTotalPages());
    assertEquals(5, page.getNumberOfElements());
    repository.deleteAll();
  }

  public NodeAttribute create(String name, String value, String nodePath) {
    NodeAttribute attribute = new NodeAttribute();
    attribute.setName(name);
    attribute.setValue(value);
    attribute.setNodePath(nodePath);
    return attribute;
  }
}
