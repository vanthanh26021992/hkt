package com.hkt.module.account.annotation;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ElementType.PARAMETER, ElementType.FIELD, ElementType.METHOD})
@Retention(RUNTIME)
@Documented
@Inherited
@Constraint(validatedBy = ExistingAccountLoginIdValidator.class)
public @interface ExistingAccountLoginId {
  String message() default "Expect an existed account";
  Class<?>[] groups() default { };
  Class<? extends Payload>[] payload() default {};
}

