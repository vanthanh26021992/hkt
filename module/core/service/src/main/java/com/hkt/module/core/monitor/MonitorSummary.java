package com.hkt.module.core.monitor;

import java.util.ArrayList;
import java.util.List;

public class MonitorSummary {
  private String          name;
  private String          description;
  private List<Property> properties;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<Property> getProperties() {
    return properties;
  }

  public void setProperties(List<Property> properties) {
    this.properties = properties;
  }

  public void addProperty(String name, Object value) {
    if (properties == null) this.properties = new ArrayList<Property>();
    properties.add(new Property(name, value));
  }

  static public class Property {
    private String name;
    private Object value;

    public Property() {
    }

    public Property(String name, Object value) {
      this.name = name;
      this.value = value ;
    }

    public String getName() {
      return name;
    }

    public Object getValue() {
      return value;
    }
  }
}
