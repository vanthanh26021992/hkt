package com.hkt.module.config;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
  locations = {
    "classpath:META-INF/spring/module.core.service.xml",
    "classpath:META-INF/spring/module.account.service.xml",
    "classpath:META-INF/spring/module.cms.service.xml",
    "classpath:META-INF/spring/module.config.service.xml"
  }
)
@TransactionConfiguration(defaultRollback=true)
abstract public class AbstractUnitTest {
}
