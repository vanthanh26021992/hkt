package com.hkt.module.cms.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.hkt.module.cms.entity.Node;

class NodeRepositoryImpl extends JdbcDaoSupport implements NodeRepositoryCustom {
  @PersistenceContext
  EntityManager em;

  @Autowired
  public NodeRepositoryImpl(DataSource dataSource) {
    setDataSource(dataSource);
  }

  public void setEntityManager(EntityManager em) {
    this.em = em;
  }

  @Override
  public List<Node> findByRange(int from, int size) {
    CriteriaQuery<Node> criteriaQuery = em.getCriteriaBuilder().createQuery(Node.class);
    criteriaQuery = criteriaQuery.select(criteriaQuery.from(Node.class));
    TypedQuery<Node> tquery = em.createQuery(criteriaQuery);
    tquery.setFirstResult(from);
    tquery.setMaxResults(size);
    return tquery.getResultList();
  }

  @Override
  public int cascadeDelete(Node node) {
    String query = "DELETE FROM Node WHERE path LIKE ?";
    String path = node.getPath() + "%";
    int count = getJdbcTemplate().update(query, path);
    return count;
  }
}
