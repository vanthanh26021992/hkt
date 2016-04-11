package com.hkt.module.account.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.ParameterizedRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.hkt.module.account.entity.Account;
import com.hkt.module.core.entity.FilterQuery;
import com.hkt.module.core.entity.FilterResult;

class AccountRepositoryImpl extends JdbcDaoSupport implements AccountRepositoryCustom {
  
  final static public ParameterizedRowMapper<Account> ACCOUNT_MAPPER = new ParameterizedRowMapper<Account>() {
    public Account mapRow(ResultSet rs, int rowNum) throws SQLException {
      try {
        Account account = new Account(rs.getLong("id"));
        account.setLoginId(rs.getString("loginId"));
        account.setPassword(rs.getString("password")) ;
        account.setType(Account.Type.valueOf(rs.getString("type"))) ;
      //  account.setEmail(rs.getString("email")) ;
        account.setProfilesData(rs.getString("profilesData")) ;
        account.setContactData(rs.getString("contactData")) ;
        return account;
      } catch(Throwable t) {
        throw new SQLException(t) ;
      }
    }
  } ;
  
  @PersistenceContext 
  private EntityManager em;
  
  @Autowired
  public AccountRepositoryImpl(DataSource dataSource) {
    setDataSource(dataSource);
  }
  

  public void setEntityManager(EntityManager em) {
    this.em = em;
  }
  
  public FilterResult<Account> search(FilterQuery query) {
    FilterQuery.Expression typeExp = query.getField("type") ;
    if(typeExp != null) {
      typeExp.setValue(Account.Type.valueOf((String)typeExp.getValue())) ;
    }
    FilterResult<Account> result = new FilterResult<Account>(query) ;
    
    CriteriaQuery<Account> criteriaQuery = query.createCriteriaQuery(em, Account.class);
    TypedQuery<Account> tquery = em.createQuery(criteriaQuery) ;
    
    tquery.setMaxResults(query.getMaxReturn()) ;
    result.setData(tquery.getResultList()) ;
    return result ;
  }
  
  public List<Account> jdbcFindByAll() {
    JdbcTemplate tmpl = getJdbcTemplate() ;
    return tmpl.query("SELECT * FROM Account", ACCOUNT_MAPPER);
  }
}