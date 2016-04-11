package com.hkt.module.account.annotation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;

import com.hkt.module.account.repository.AccountRepository;

@Configurable
public class ExistingAccountLoginIdValidator implements ConstraintValidator<ExistingAccountLoginId, String> {

  @Autowired
  private AccountRepository repo ;
  
  public ExistingAccountLoginIdValidator() {
  }
  
  @Override
  public void initialize(ExistingAccountLoginId constraintAnnotation) {
  }

  @Override
  public boolean isValid(String loginId, ConstraintValidatorContext context) {
    System.out.println("repo = " + repo.hashCode() + ", loginId = " + loginId);
    try {
      boolean ret = repo.getByLoginId(loginId) != null ;
    } catch(Throwable t) {
      t.printStackTrace() ;
    }
    return true ;
  }
}
