package com.hkt.module.config.generic;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hkt.module.cms.CMSService;
import com.hkt.module.cms.entity.Node;
import com.hkt.module.cms.entity.NodeAttribute;
import com.hkt.module.cms.entity.NodeAttributes;
import com.hkt.module.cms.entity.NodeDetail;
import com.hkt.module.kpi.KpiService;
import com.hkt.util.json.JSONSerializer;

@Service("GenericOptionService")
public class GenericOptionService {
  @Autowired
  private CMSService cmsService;
  private OptionGroupPlugin[] plugins;
  private KpiService kpiService;

  private Map<String, OptionGroup> optionGroups = new HashMap<String, OptionGroup>();
  private String configLoc = "system/config/generic";

  @PostConstruct
  public void onInit() {
    try {
      if (cmsService.getNodeByPath(configLoc) == null) {
        cmsService.createIfNotExists(configLoc);
        for (OptionGroupPlugin plugin : plugins) {
          for (OptionGroup sel : plugin.getOptionGroups()) {
            save(sel);
          }
        }
      }
      for (OptionGroupPlugin plugin : plugins) {
        for (OptionGroup sel : plugin.getOptionGroups()) {
          fromJSONCountry(getJSONConfig(getNodeName(sel)));
        }
      }


    } catch (Exception e) {
      //e.printStackTrace();
    }

  }

  public void fromJSONCountry(String json) throws IOException {
    OptionGroup sel = JSONSerializer.INSTANCE.fromString(json, OptionGroup.class);
    optionGroups.put(sel.generateId(), sel);

  }

  String getJSONConfig(String name) {
    String path = this.configLoc + "/" + name;
    NodeDetail nDetail = cmsService.getNodeDetail(path);
    if (nDetail == null)
      return null;
    NodeAttributes attrs = nDetail.getAttributes();
    String data = attrs.getAttritute("data").getValue();
    return data;
  }

  @Autowired
  public void setPlugins(OptionGroupPlugin[] plugins) {
    this.plugins = plugins;
  }

  public OptionGroup getOptionGroup(String module, String service, String name) {
    OptionGroup optionGroup = optionGroups.get(OptionGroup.generateId(module, service, name));
    try {
      fromJSONCountry(getJSONConfig(getNodeName(optionGroup)));
    } catch (Exception e) {
    }
    return optionGroups.get(OptionGroup.generateId(module, service, name));
  }

  public OptionGroup saveOptionGroup(OptionGroup optionGroup) {
    optionGroups.put(optionGroup.generateId(), optionGroup);
    save(optionGroup);
    return optionGroup;
  }

  public List<OptionGroup> getOptionGroups() {
    return new ArrayList<OptionGroup>(optionGroups.values());
  }

  public List<Option> findOptions(String module, String service, String name, String exp) {
    OptionGroup optGroup = optionGroups.get(OptionGroup.generateId(module, service, name));
    if (optGroup == null)
      return null;
    return optGroup.findOptions(exp);
  }

  public boolean deleteOption(OptionGroup optionGroup, int index) throws Exception {
    optionGroup.getOptions().get(index).setRecycleBin(true);
    saveOptionGroup(optionGroup);
    return true;
  }

  void save(OptionGroup optGroup) {
    String name = getNodeName(optGroup);
    String path = this.configLoc + "/" + name;
    String data = JSONSerializer.INSTANCE.toString(optGroup);
    NodeDetail nDetail = cmsService.getNodeDetail(path);
    if (nDetail == null) {
      Node node = new Node(name);
      node.setMimeType("application/json");
      NodeAttributes attrs = new NodeAttributes();
      attrs.addAttribute(new NodeAttribute("description", "string", optGroup.getDescription()));
      attrs.addAttribute(new NodeAttribute("data", "string", data));
      cmsService.createNode(configLoc, node, attrs);
    } else {
      Node node = nDetail.getNode();
      NodeAttributes attrs = nDetail.getAttributes();
      attrs.addAttribute(new NodeAttribute("description", "string", optGroup.getDescription()));
      attrs.addAttribute(new NodeAttribute("data", "string", data));
      cmsService.updateNode(node, attrs);
    }
  }

  private String getNodeName(OptionGroup optGroup) {
    return optGroup.getModule() + "_" + optGroup.getService() + "_" + optGroup.getName() + ".json";
  }
}