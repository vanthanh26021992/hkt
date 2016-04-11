package com.hkt.module.account.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.hkt.module.core.entity.AbstractPersistable;

@Table
@Entity
public class AccountMembership extends AbstractPersistable<Long> {
  private static final long serialVersionUID = 1L;
  
  public enum Capability { READ, WRITE, ADMIN }
  public enum Status     { ACTIVE, INACTIVE, SUSPENDED }

  @NotNull
  private String loginId;

  @NotNull
  private String groupPath;

  @NotNull
  private Capability capability = Capability.READ;

  @NotNull
  private Status status = Status.ACTIVE ;
  
  private String nameEmployee;
  
  private String nameDepartment;
  
  private String nameRole;

  private String role ;
  
  private String description;
  
  public AccountMembership() {}
  
  
  public String getNameRole() {
	return nameRole;
}

public void setNameRole(String nameRole) {
	this.nameRole = nameRole;
}

public String getNameEmployee() {
	return nameEmployee;
}

public void setNameEmployee(String nameEmployee) {
	this.nameEmployee = nameEmployee;
}

public String getNameDepartment() {
	return nameDepartment;
}

public void setNameDepartment(String nameDepartment) {
	this.nameDepartment = nameDepartment;
}

public String getLoginId() { return loginId; }
  public void setLoginId(String loginId) { this.loginId = loginId; }

  public String getGroupPath() { return groupPath; }
  public void setGroupPath(String groupPath) { this.groupPath = groupPath; }

  public Capability getCapability() { return capability; }
  public void setCapability(Capability capability) { this.capability = capability; }
  
  public Status getStatus() { return this.status ; }
  public void   setStatus(Status status) { this.status = status ; }

  public String getRole() { return this.role ; }
  public void   setRole(String role) { this.role = role ; }

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
} 
  
  
}
