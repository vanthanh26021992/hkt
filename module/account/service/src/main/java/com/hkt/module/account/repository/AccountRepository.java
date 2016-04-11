package com.hkt.module.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hkt.module.account.entity.Account;
import com.hkt.module.account.entity.Account.Type;

public interface AccountRepository extends CrudRepository<Account, Long>, AccountRepositoryCustom {

  Account getByLoginId(String loginId);
  
  @Query("select a from Account a where (LCASE(a.loginId) like %:loginId% or LCASE(a.name) like %:loginId%) and a.type = :type and a.recycleBin = 0")
  List<Account> findByLoginId(@Param("loginId") String loginId, @Param("type") Type type);
  
  @Query("select a from Account a where (LCASE(a.loginId) like %:loginId% or LCASE(a.name) like %:loginId%) and a.recycleBin = 0")
  List<Account> findAccountByName(@Param("loginId") String loginId);

  @Query("SELECT a FROM Account a WHERE  a.recycleBin = :value")
  List<Account> findByValueRecycleBin(@Param("value") boolean value); 
  
  Account getByEmail(String email);
  
  @Query("select a from Account a where a.type = :type and a.loginId != 'admin' ORDER BY a.id DESC")
  List<Account> findAccountByType(@Param("type") Type type);
  
  @Modifying
  @Query("DELETE FROM Account WHERE loginId like %:test%")
  public void deleteTest(@Param("test") String test);
}
