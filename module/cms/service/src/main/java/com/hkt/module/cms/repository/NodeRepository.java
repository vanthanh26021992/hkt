package com.hkt.module.cms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hkt.module.cms.entity.Node;

public interface NodeRepository extends CrudRepository<Node, Long>, NodeRepositoryCustom {
  @Query("select n from Node n where n.parentId=:parentId")
  List<Node> findChildren(@Param("parentId") long parentId);

  Node findByPath(String path);
  
  @Query("select n from Node n where n.parentId <  0")
  List<Node> findRootGroup();
}