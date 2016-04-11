package com.hkt.module.cms.util;

import java.util.List;

import com.hkt.module.cms.entity.NodeDetail;
import com.hkt.util.IOUtil;
import com.hkt.util.json.JSONReader;

public class CMSScenario {
  private List<NodeDetail> nodes;

  public CMSScenario() {
  }

  public List<NodeDetail> getNodes() {
    return nodes;
  }

  public void setNodes(List<NodeDetail> nodes) {
    this.nodes = nodes;
  }
  
  static public CMSScenario load(String res) throws Exception {
    JSONReader reader = new JSONReader(IOUtil.loadRes(res)) ;
    CMSScenario scenario = reader.read(CMSScenario.class) ;
    return scenario ;
  }
  
  static public CMSScenario loadTest() throws Exception {
    return load("classpath:scenario/cms.json") ;
  }
}