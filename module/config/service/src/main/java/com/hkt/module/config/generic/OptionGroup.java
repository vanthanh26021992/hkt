package com.hkt.module.config.generic;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;

public class OptionGroup {
  private String module;
  private String service;
  private String name;
  private String description;
  private List<Option> options;
  private List<Option> optionsOld;

  public String getModule() {
    return module;
  }

  public void setModule(String module) {
    this.module = module;
  }

  public String getService() {
    return service;
  }

  public void setService(String service) {
    this.service = service;
  }

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

  public List<Option> getOptions() {
    for (int i = 0; i < options.size();) {
      if (options.get(i).isRecycleBin()) {
        options.remove(i);
      } else {
        i++;
      }
    }
    Collections.sort(options, new Comparator<Option>() {
      @Override
      public int compare(Option it1, Option it2) {
        if (it1.getPriority() > it2.getPriority()) {
          return 1;
        } else {
          if (it1.getPriority() < it2.getPriority()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return options;
  }

  public void setOptions(List<Option> options) {
    this.options = options;
    this.optionsOld = options;
  }

  public Option getOption(String code) {
    if (optionsOld == null)
      return null;
    for (Option opt : optionsOld) {
      if (code.equals(opt.getCode()))
        return opt;
    }
    return null;
  }

  public String generateId() {
    return generateId(module, service, name);
  }

  public List<Option> findOptions(String exp) {
    List<Option> holder = new ArrayList<Option>();
    Pattern p = Pattern.compile(".*" + exp + ".*", Pattern.CASE_INSENSITIVE);
    for (Option sel : options) {
      if (!sel.isRecycleBin()) {
        if (exp.length() < 3 && p.matcher(sel.getCode()).matches()) {
          holder.add(sel);
        } else if (exp.length() >= 3) {
          if (p.matcher(sel.getCode()).matches() || p.matcher(sel.getLabel()).matches()
              || p.matcher(sel.getDescription()).matches()) {
            holder.add(sel);
          }
        }
      }
    }
    Collections.sort(holder, new Comparator<Option>() {
      @Override
      public int compare(Option it1, Option it2) {
        if (it1.getPriority() > it2.getPriority()) {
          return 1;
        } else {
          if (it1.getPriority() < it2.getPriority()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  static public String generateId(String module, String service, String name) {
    return module + "/" + service + "/" + name;
  }
}
