package com.hkt.module.cms;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkt.module.cms.entity.Node;
import com.hkt.module.cms.entity.NodeAttribute;
import com.hkt.module.cms.entity.NodeAttributes;
import com.hkt.module.cms.entity.NodeDetail;
import com.hkt.module.cms.entity.Template;
import com.hkt.module.cms.repository.NodeAttributeRepository;
import com.hkt.module.cms.repository.NodeRepository;
import com.hkt.module.cms.util.CMSScenario;
import com.hkt.module.core.ServiceCallback;
import com.hkt.module.core.entity.AbstractPersistable.State;

@Service("CMSService")
public class CMSService {
  @Autowired
  NodeRepository          nodeRepo;

  @Autowired
  NodeAttributeRepository attrRepo;

  String                  templateLoc = "system/cms/templates";

  @PostConstruct
  public void onInit() {
    try {
      createIfNotExists(templateLoc);
    } catch (Exception e) {
    }
   
  }

  @Transactional(readOnly = true)
  public Node getNodeByPath(String path) {
    if (path == null) return null;
    return nodeRepo.findByPath(path);
  }

  @Transactional
  public Node updateNode(Node node, NodeAttributes attrs) {
    if (node == null) {
      throw new RuntimeException("Node cannot be bull");
    }
    Node nodeSave = nodeRepo.save(node);
    if (attrs != null) {
      for (NodeAttribute attribute : attrs.values()) {
        if (attribute.getPersistableState() == State.DELETED) {
          attrRepo.delete(attribute);
        } else {
          attribute.setNodePath(nodeSave.getPath());
          attrRepo.save(attribute);
        }
      }
    }
    return nodeSave;
  }

  @Transactional
  public Node createNode(String parentPath, Node node, NodeAttributes attributes) {
    Node parent = null;
    if (parentPath != null) {
      parent = nodeRepo.findByPath(parentPath);
      if (parent == null)
        throw new RuntimeException("CMSService Cannot find NodeParent " + parentPath);
    }
    node.setParent(parent);
    node = nodeRepo.save(node);
    if (attributes != null) {
      for (NodeAttribute attribute : attributes.values()) {
        if (attribute.getPersistableState() == State.DELETED) {
          attrRepo.delete(attribute);
        } else {
          attribute.setNodePath(node.getPath());
          attrRepo.save(attribute);
        }
      }
    }
    return node;
  }

  @Transactional
  public void deleteNodeByPath(String path) {
    Node node = getNodeByPath(path);
    deleteNode(node, null);
  }

  @Transactional
  public void deleteNode(Node node) {
    deleteNode(node, null);
  }

  @Transactional
  public void deleteNode(Node node, ServiceCallback<CMSService> callback) {
    attrRepo.cascadeDelete(node.getPath());
    nodeRepo.cascadeDelete(node);
    if (callback != null) {
      callback.callback(this);
    }
  }

  @Transactional(readOnly = true)
  public List<Node> getNodeChildren(Node node) {
    return nodeRepo.findChildren(node.getId());
  }

  @Transactional(readOnly = true)
  public List<Node> getNodeChildrenByParentPath(String parentPath) {
    Node node = getNodeByPath(parentPath);
    if (node == null)
      return new ArrayList<Node>();
    return nodeRepo.findChildren(node.getId());
  }

  @Transactional(readOnly = true)
  public NodeDetail getRootNodeDetail() {
    List<Node> children = nodeRepo.findRootGroup();
    List<NodeAttribute> attributes = new ArrayList<NodeAttribute>();
    NodeDetail detail = new NodeDetail(null, attributes, children);
    return detail;
  }

  @Transactional(readOnly = true)
  public NodeDetail getNodeDetail(String path) {
    if (path == null)
      return getRootNodeDetail();
    Node node = nodeRepo.findByPath(path);
    if (node == null)
      return null;
    List<NodeAttribute> attrs = attrRepo.findByNodePath(path);
    List<Node> children = nodeRepo.findChildren(node.getId());
    NodeDetail detail = new NodeDetail(node, attrs, children);
    return detail;
  }

  @Transactional
  public void createNodeDetail(String parentPath, NodeDetail nodeDetail) {
    NodeAttributes attributes = nodeDetail.getAttributes();
    createNode(parentPath, nodeDetail.getNode(), attributes);
  }

  public Template getTemplate(String mimeType) {
    String name = mimeType.replace('/', '_');
    String path = this.templateLoc + "/" + name;
    NodeDetail nDetail = this.getNodeDetail(path);
    if (nDetail == null)
      return null;
    NodeAttributes attrs = nDetail.getAttributes();
    Template template = new Template();
    template.setMimeType(attrs.getAttritute("mimeType").getValue());
    template.setDescription(attrs.getAttritute("description").getValue());
    template.setTemplate(attrs.getAttritute("template").getValue());
    return template;
  }

  @Transactional
  public void addTemplate(Template template) {
    String name = template.getMimeType().replace('/', '_');
    String path = this.templateLoc + "/" + name;
    NodeDetail nDetail = this.getNodeDetail(path);
    if (nDetail == null) {
      Node node = new Node(name);
      node.setMimeType("cms/template");
      NodeAttributes attrs = new NodeAttributes();
      attrs.addAttribute(new NodeAttribute("mimeType", "string", template.getMimeType()));
      attrs.addAttribute(new NodeAttribute("description", "string", template.getDescription()));
      attrs.addAttribute(new NodeAttribute("template", "string", template.getTemplate()));
      createNode(templateLoc, node, attrs);
    } else {
      Node node = nDetail.getNode();
      NodeAttributes attrs = nDetail.getAttributes();
      attrs.addAttribute(new NodeAttribute("mimeType", "string", template.getMimeType()));
      attrs.addAttribute(new NodeAttribute("description", "string", template.getDescription()));
      attrs.addAttribute(new NodeAttribute("template", "string", template.getTemplate()));
      updateNode(node, attrs);
    }
  }

  @Transactional
  public void addTemplates(List<Template> template) {
    for (Template sel : template)
      addTemplate(sel);
  }

  @Transactional
  public Node createIfNotExists(String path) {
    String[] seg = path.split("/");
    String pPath = null;
    Node node = null;
    for (int i = 0; i < seg.length; i++) {
      String cpath = seg[i];
      if (pPath != null)
        cpath = pPath + "/" + seg[i];
      node = getNodeByPath(cpath);
      if (node != null) {
        if (!"sys/folder".equals(node.getMimeType())) {
          throw new RuntimeException("Node " + node.getPath() + " is already existed, but not sys/folder mime type");
        }
      } else {
        node = new Node();
        node.setName(seg[i]);
        node.setMimeType("sys/folder");
        node = createNode(pPath, node, null);
      }
      pPath = cpath;
    }
    return node;
  }

  @Transactional
  public void createScenario(CMSScenario scenario) {
    for (NodeDetail nodeDetail : scenario.getNodes()) {
      NodeAttributes attributes = nodeDetail.getAttributes();
      if (attributes != null) {
        for (Map.Entry<String, NodeAttribute> entry : attributes.entrySet()) {
          entry.getValue().setName(entry.getKey());
        }
      }
      createNodeDetail(nodeDetail.getNode().getParentPath(), nodeDetail);
    }
  }

  @Transactional
  public void deleteAll() {
    nodeRepo.deleteAll();
    attrRepo.deleteAll();
    onInit();
  }

  public String ping() {
    return "CMSService alive!!!";
  }
}
