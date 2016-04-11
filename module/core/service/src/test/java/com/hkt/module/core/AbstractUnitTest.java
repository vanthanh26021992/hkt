package com.hkt.module.core;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
  locations = {
    "classpath:META-INF/spring/module.core.service.xml"
  }
)
@TransactionConfiguration(defaultRollback=true)
abstract public class AbstractUnitTest {
}
