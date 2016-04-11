package com.hkt.module.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hkt.module.account.entity.AccountMembership;

public interface AccountMembershipRepository extends CrudRepository<AccountMembership, Long> {
	
  @Query("SELECT m FROM AccountMembership m WHERE m.loginId = :loginId and m.recycleBin = 0 ORDER BY m.id DESC")
  List<AccountMembership> findByAccountLoginId(@Param("loginId") String loginId);

	  @Query("SELECT m FROM AccountMembership m WHERE m.groupPath = :path")
	  List<AccountMembership> getAllMemberShipByPath(@Param("path") String path);
	
  @Query("SELECT m FROM AccountMembership m WHERE m.groupPath = :groupPath and m.recycleBin = 0")
  List<AccountMembership> findByGroupPath(@Param("groupPath") String groupPath);

  @Query("SELECT m FROM AccountMembership m WHERE m.loginId =:loginId AND m.groupPath = :groupPath")
  AccountMembership getByAccountAndGroup(@Param("loginId") String loginId, @Param("groupPath") String groupPath);
  
  @Query("SELECT m FROM AccountMembership m WHERE  m.recycleBin = :value")
  List<AccountMembership> findByValueRecycleBin(@Param("value") boolean value); 
  
  @Modifying
  @Query(value = "DELETE FROM AccountMembership a WHERE a.groupPath LIKE %:groupPath%")
  public void deleteByGroupPath(@Param("groupPath") String groupPath);
  
  @Modifying
  @Query(value = "DELETE FROM AccountMembership a WHERE a.loginId = :loginId")
  public void deleteByAccountLoginId(@Param("loginId") String loginId);
  
  @Modifying
  @Query(value = "DELETE FROM AccountMembership a WHERE a.loginId = :loginId AND groupPath = :groupPath")
  public void deleteByAccountLoginIdAndGroupPath(@Param("loginId") String loginId, @Param("groupPath") String groupPath);
  
  @Modifying
  @Query("DELETE FROM AccountMembership WHERE loginId like %:test%")
  public void deleteTest(@Param("test") String test);
}
