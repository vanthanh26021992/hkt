package com.hkt.module.cms.entity;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class NodeAttributes extends LinkedHashMap<String, NodeAttribute> {
  
  public NodeAttributes() {
  }
  
  public NodeAttributes(List<NodeAttribute> attrs) {
    if (attrs != null) {
      for (int i = 0; i < attrs.size(); i++) {
        NodeAttribute attr = attrs.get(i);
        put(attr.getName(), attr);
      }
    }
  }
  
  public Map<String, NodeAttribute> getAttrituteWithPrefix(String prefix) {
    Map<String, NodeAttribute> map = new LinkedHashMap<String, NodeAttribute>() ;
    for(Map.Entry<String, NodeAttribute> entry : entrySet()) {
      String key = entry.getKey() ;
      if(key.startsWith(prefix)) {
        map.put(key, entry.getValue()) ;
      }
    }
    return map ;
  }
  
  public NodeAttribute getAttritute(String name) { return get(name) ; }
  
  public void addAttribute(NodeAttribute attr) {
    put(attr.getName(), attr) ;
  }
  
  public void merge(NodeAttributes attrs) {
    //TODO
  }
}
