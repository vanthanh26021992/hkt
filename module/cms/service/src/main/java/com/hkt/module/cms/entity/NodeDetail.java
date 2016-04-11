package com.hkt.module.cms.entity;

import java.io.Serializable;
import java.util.List;

public class NodeDetail implements Serializable {
  
  private Node node;
  private NodeAttributes attributes;
  private List<Node> children;
  
  public NodeDetail() {
  }

  public NodeDetail(Node node, List<NodeAttribute> attributes, List<Node> children) {
    this.node = node;
    this.attributes = new NodeAttributes(attributes);
    this.children = children ;
  }

  public Node getNode() {
    return node;
  }

  public void setNode(Node node) {
    this.node = node;
  }

  public NodeAttributes getAttributes() {
    return attributes;
  }

  public void setAttributes(NodeAttributes attributes) {
    this.attributes = attributes;
  }
  
  public List<Node> getChildren() {
    return children;
  }

  public void setChildren(List<Node> children) {
    this.children = children;
  }
}
