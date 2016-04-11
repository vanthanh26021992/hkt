package com.hkt.module.account.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.hkt.module.core.entity.AbstractPersistable;

@Entity
@Table
public class AccountGroup extends AbstractPersistable<Long> {
  private static final long serialVersionUID = 1L;


  private String name;
  
  private String parentCode;
  
  private String parentName;
  
  private String responsible; //Người chịu trách nhiệm
  

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public String getParentCode() {
		return parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}

	private String owner ;
  private String description ;
//  private int priority;
  
  public AccountGroup() { }


  
  
  public String getResponsible() {
	return responsible;
}

public void setResponsible(String responsible) {
	this.responsible = responsible;
}

public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  

  
  public String getOwner() { return this.owner ; }
  public void   setOwner(String owner) { this.owner = owner ; }
  
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  @Override
  public String toString() {return name ;}
}