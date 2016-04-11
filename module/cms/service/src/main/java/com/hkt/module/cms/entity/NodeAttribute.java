package com.hkt.module.cms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.hkt.module.core.entity.AbstractPersistable;

@Table
@Entity
public class NodeAttribute extends AbstractPersistable<Long> {
  private static final long serialVersionUID = 1L;

  private String            type;
  private String            name;
  @Column(length = 1000000) @Lob
  private String            value;
  private String            note;
  @NotNull
  private String            nodePath;
 
  public NodeAttribute() { }
  
  public NodeAttribute(String name, String type, String value) { 
    this.name = name;
    this.type = type ;
    this.value = value ;
  }
  
  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public String getNodePath() {
    return nodePath;
  }

  public void setNodePath(String nodePath) {
    this.nodePath = nodePath;
  }
  
}
