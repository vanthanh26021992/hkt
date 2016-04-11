package com.hkt.module.config.locale;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hkt.module.config.AbstractUnitTest;

public class LocalServiceUnitTest extends AbstractUnitTest {
  @Autowired
  private LocaleService lservice;
  
  @Test
  public void testCountries() throws Exception {
    assertEquals(3, lservice.getCurrencies().size());
    assertEquals(3, lservice.getProductUnits().size());
    assertEquals(1, lservice.findCountryByName("Việt Nam").size());
    assertEquals(1, lservice.findCountryByName("việt Nam").size());
    
    assertEquals(1, lservice.findProvinces("Bắc Giang").size());
    assertEquals(1, lservice.findProvinces("bắc giang").size());
    assertEquals(1, lservice.findProvinces("Việt Nam", "bắc giang").size());
    
    assertEquals(1, lservice.findCities("Việt Nam", "Hà").size());
    assertEquals(1, lservice.findCities("Việt Nam", "hà").size());
    
    assertEquals(1, lservice.findCities("Việt Nam", "Bắc Giang", "Bắc").size());
    assertEquals(1, lservice.findCities("Việt Nam", "Bắc Giang", "bắc").size());
    
    Country country = new Country();
    country.setName("Japan");
    country.setFlag("Nhật bản");
    country.setDescription("Nước Nhật");
    
    country = lservice.saveCountry(country);
    assertEquals(2, lservice.getCountries().size());
    assertEquals(country, lservice.getCountry(country.getName()));
    
    assertEquals(true, lservice.deleteCountry(country));
    assertEquals(1, lservice.getCountries().size());
    
    Country vietNam = lservice.getCountries().get(0);
    List<Province> provinces = vietNam.getProvinces();
    
    List<City> cities = provinces.get(0).getCities();
    
    City test = new City();
    test.setName("test");
    test.setDescription("test");
    
    cities.add(test);
    
    vietNam = lservice.saveCountry(vietNam);
    
    provinces = vietNam.getProvinces();
    cities = provinces.get(0).getCities();
    
    assertEquals(2, cities.size());
    List<Currency> currencies = lservice.getCurrencies();
    System.out.println(currencies);
  }
  
}
