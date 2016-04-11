package com.hkt.module.config.locale;

public class ProductUnit {
  private String name;
  private String code;
  private int priority;
  private double rate;
  private String description;
  private boolean recycleBin;
  
  public boolean isRecycleBin() {
    return recycleBin;
  }

  public void setRecycleBin(boolean recycleBin) {
    this.recycleBin = recycleBin;
  }

  public String getName() { return name; }
  
  public void setName(String label) { this.name = label; }
  
  public String getCode() { return code; }
  
  public void setCode(String code) { this.code = code; }
  
  public int getPriority() { return priority; }
  
  public void setPriority(int priority) { this.priority = priority; }
  
  public String getDescription() { return description; }
  
  public void setDescription(String description) { this.description = description; }
  
  public double getRate() { return rate;  }

  public void setRate(double rate) { this.rate = rate; }

  @Override
  public String toString() { return name; }
  
}