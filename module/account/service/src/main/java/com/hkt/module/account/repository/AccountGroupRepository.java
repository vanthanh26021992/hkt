
package com.hkt.module.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hkt.module.account.entity.AccountGroup;

public interface AccountGroupRepository extends CrudRepository<AccountGroup, Long>, AccountGroupRepositoryCustom {
	AccountGroup getByCode(String code);
  
  @Query("select g from AccountGroup g where g.parentCode =:parentCode")
  List<AccountGroup> getAccountGroupByParentCode(@Param("parentCode") String parentCode);
  
  @Query("select g from AccountGroup g where g.responsible =:responsible")
  List<AccountGroup> getAccountGroupByResponsible(@Param("responsible") String responsible);
  
  @Query("select g from AccountGroup g where g.parentCode is null")
  List<AccountGroup> findRootGroup();
  
  @Query("select g from AccountGroup g where LCASE(g.name) like %:name%")
  List<AccountGroup> findByName(@Param("name") String name);
  
  @Query("select g from AccountGroup g where g.code in (select groupPath from AccountMembership " +
  		"where loginId =:loginId)")
  List<AccountGroup> getByLoginIds(@Param("loginId") String loginId);
  
  @Modifying
  @Query("DELETE FROM AccountGroup WHERE label like %:test%")
  public void deleteTest(@Param("test") String test);
}
