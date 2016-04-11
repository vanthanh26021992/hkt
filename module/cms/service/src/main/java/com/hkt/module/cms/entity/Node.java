package com.hkt.module.cms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.hkt.module.core.entity.AbstractPersistable;

@Entity
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"path"}))
public class Node extends AbstractPersistable<Long> {
  private static final long serialVersionUID = 1L;

  private String name;
  @NotNull
  @Column(unique = true)
  private String path;
  private String mimeType;
  @NotNull
  private long parentId = -1l;

  public Node() {
  }

  public Node(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }
  
  public void  setParentPath(String path){
  }
  
  public String getParentPath() {
    int idx = path.lastIndexOf('/') ;
    if(idx < 0) return null ;
    return path.substring(0, idx) ;
  }
  
  public void setParent(Node parent) {
    if (parent == null) {
      this.path = this.name;
    } else {
      if(parent.isNew()) throw new RuntimeException("Parent is not persisted: " + parent.getPath()) ;
      this.path = parent.getPath() + "/" + this.name;
      this.parentId = parent.getId();
    }
  }

  public String getMimeType() {
    return mimeType;
  }

  public void setMimeType(String mineType) {
    this.mimeType = mineType;
  }

  public long getParentId() {
    return parentId;
  }

  public void setParentId(long parentId) {
    this.parentId = parentId;
  }
}
