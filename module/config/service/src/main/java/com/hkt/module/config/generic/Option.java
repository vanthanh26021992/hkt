package com.hkt.module.config.generic;

public class Option {
  private String label;
  private String code;
  private int priority;
  private String description;
  private boolean recycleBin;
  private boolean permission;
  
  
  
  
  public boolean isPermission() {
	return permission;
}

public void setPermission(boolean permission) {
	this.permission = permission;
}

public Option() {
    this.label = "";
    this.code = "";
    this.description = "";
  }

  public boolean isRecycleBin() {
    return recycleBin;
  }

  public void setRecycleBin(boolean recycleBin) {
    this.recycleBin = recycleBin;
  }

  public String getLabel() { return label; }
  
  public void setLabel(String label) { this.label = label; }
  
  public String getCode() { return code; }
  
  public void setCode(String code) { this.code = code; }
  
  public int getPriority() { return priority; }
  
  public void setPriority(int priority) { this.priority = priority; }
  
  public String getDescription() { return description; }
  
  public void setDescription(String description) { this.description = description; }
  
  @Override
  public String toString() { return label; }
  
}