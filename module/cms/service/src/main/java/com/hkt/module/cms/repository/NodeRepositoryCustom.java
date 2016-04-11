package com.hkt.module.cms.repository;

import java.util.List;

import com.hkt.module.cms.entity.Node;

interface NodeRepositoryCustom {
  public List<Node> findByRange(int from, int size);

  public int cascadeDelete(Node node);
}
