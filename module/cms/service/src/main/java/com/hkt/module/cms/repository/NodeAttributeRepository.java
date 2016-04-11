package com.hkt.module.cms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hkt.module.cms.entity.NodeAttribute;

public interface NodeAttributeRepository extends CrudRepository<NodeAttribute, Long> {
  List<NodeAttribute> findByNodePath(String nodePath);
  
  Page<NodeAttribute> findByNodePath(String nodePath, Pageable pageable);
  
    
  @Modifying
  @Query("DELETE FROM NodeAttribute WHERE nodePath LIKE :nodePath%")
  public void cascadeDelete(@Param("nodePath") String nodePath);
}
