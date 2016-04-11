package com.hkt.module.account.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.hkt.module.account.AbstractUnitTest;
import com.hkt.module.account.entity.Account;
import com.hkt.module.core.entity.FilterQuery;
import com.hkt.module.core.entity.FilterResult;
import com.hkt.util.json.JSONSerializer;

@Transactional
public class AccountRepositoryUnitTest extends AbstractUnitTest {
  @Autowired AccountRepository repository;
  
  @Test
  public void testCrud() {
    Account account = repository.save(createAccount("admin"));
    assertEquals(account, repository.findOne(account.getId()));
    repository.delete(account) ;
    assertEquals(0, repository.count());
  }

  //khanhdd
  @Test
  public void testCrud1() {
	  Account account = new Account();
	  
	  account = createAccount("admin");
	  account.setRecycleBin(true);
	  account =  repository.save(account);
    
      assertNotNull(account);
      assertEquals(1, repository.findByValueRecycleBin(true).size());
  }
  
  @Test
  public void testfillterQuerry() {
	  Account account = repository.save(createAccount("admin"));
	   
	    FilterQuery fq = new FilterQuery();
	    fq.add("loginId", FilterQuery.Operator.EQUAL, "admin");
	    System.out.print(repository.search(fq).getData());
	    
	    repository.delete(account);
	    System.out.print(repository.search(fq).getData());
  }
  
  @Test
  public void saveAndFindByLastNameAndFindByUserName() {
    Account a = repository.save(createAccount("admin"));
    Account reference = repository.getByLoginId(a.getLoginId());
    assertEquals(a, reference);
  }

  @Test
  public void testSearch() throws IOException {
    repository.save(createAccount("tuấn"));
    repository.save(createAccount("UPPERCASE"));

    FilterQuery query = new FilterQuery() ;
    query.add("loginId", FilterQuery.Operator.LIKE, "Upper%") ;
    FilterResult<Account> result = repository.search(query) ;
    assertEquals(1, result.getData().size()) ;
    
//    query = new FilterQuery() ;
//    query.add("loginId", FilterQuery.Operator.LIKE, "tuan") ;
//    result = repository.search(query) ;
//    assertEquals(1, result.getData().size()) ;
    
    
    for(int i = 0 ; i < 5; i++) {
      repository.save(createAccount("admin" + i));
    }
    query = new FilterQuery() ;
    query.add("loginId", FilterQuery.Operator.LIKE, "admin%") ;
    result = repository.search(query) ;
    
    assertEquals(5, result.getData().size()) ;
    query.add("type", FilterQuery.Operator.EQUAL, "USER") ;
    
    assertEquals(5, result.getData().size()) ;
    query.add("email", FilterQuery.Operator.LIKE, "admin1%") ;
    result = repository.search(query) ;
    assertEquals(1, result.getData().size()) ;
    
    String json = JSONSerializer.INSTANCE.toString(query) ;
    query = JSONSerializer.INSTANCE.fromString(json, FilterQuery.class) ;
    System.out.println(json);
    
  }
}