package com.hkt.module.config.locale;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hkt.module.cms.CMSService;
import com.hkt.module.cms.entity.Node;
import com.hkt.module.cms.entity.NodeAttribute;
import com.hkt.module.cms.entity.NodeAttributes;
import com.hkt.module.cms.entity.NodeDetail;
import com.hkt.module.config.generic.Option;
import com.hkt.util.IOUtil;
import com.hkt.util.json.JSONSerializer;

@Service("LocaleService")
public class LocaleService {
  @Autowired
  private CMSService cmsService;

  final static public String FILE_NAME_COUNTRY = "countries.json";
  final static public String FILE_NAME_CURRENCY = "currencies.json";
  final static public String FILE_NAME_UNIT = "unit.json";

  private Map<String, Country> countries = new HashMap<String, Country>();
  private Map<String, Currency> currencies = new HashMap<String, Currency>();
  private Map<String, ProductUnit> units = new HashMap<String, ProductUnit>();

  private String configLoc = "system/config/locale";

  @PostConstruct
  public void onInit() {
    try {
      if (cmsService.getNodeByPath(configLoc) == null) {
        cmsService.createIfNotExists(configLoc);
        save(FILE_NAME_COUNTRY, IOUtil.loadResAsString("classpath:locale/countries.json"), "countries configuration");
        save(FILE_NAME_CURRENCY, IOUtil.loadResAsString("classpath:locale/currencies.json"), "currencies configuration");
        save(FILE_NAME_UNIT, IOUtil.loadResAsString("classpath:locale/unit.json"), "unit configuration");
      }
      fromJSONCountry(getJSONConfig(FILE_NAME_COUNTRY));
      fromJSONCurrency(getJSONConfig(FILE_NAME_CURRENCY));
      fromJSONUnit(getJSONConfig(FILE_NAME_UNIT));
    } catch (Exception e) {
    }

  }

  public void fromJSONCountry(String json) throws IOException {
    List<Country> holder = JSONSerializer.INSTANCE.fromString(json, new TypeReference<List<Country>>() {
    });
    for (Country sel : holder) {
      if (!sel.isRecycleBin()) {
        countries.put(sel.getCode(), sel);
      }
    }
  }

  public void fromJSONCurrency(String json) throws IOException {
    List<Currency> holder = JSONSerializer.INSTANCE.fromString(json, new TypeReference<List<Currency>>() {
    });
    for (Currency sel : holder) {
      if (!sel.isRecycleBin()) {
        currencies.put(sel.getCode(), sel);
      }
    }
  }

  public void fromJSONUnit(String json) throws IOException {
    List<ProductUnit> holder = JSONSerializer.INSTANCE.fromString(json, new TypeReference<List<ProductUnit>>() {
    });
    for (ProductUnit sel : holder) {
      if (!sel.isRecycleBin()) {
        units.put(sel.getCode(), sel);
      }
    }
  }

  public List<Country> findCountryByName(String exp) {
    List<Country> holder = new ArrayList<Country>();
    Pattern pattern = Pattern.compile(".*" + exp + ".*", Pattern.CASE_INSENSITIVE);
    for (Country sel : countries.values()) {
      if (pattern.matcher(sel.getName()).matches()) {
        if (!sel.isRecycleBin()) {
          holder.add(sel);
        }
      }
    }
    Collections.sort(holder, new Comparator<Country>() {
      @Override
      public int compare(Country it1, Country it2) {
        if (it1.getIndex() > it2.getIndex()) {
          return 1;
        } else {
          if (it1.getIndex() < it2.getIndex()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  public List<Region<Province>> findProvinces(String exp) {
    List<Region<Province>> holder = new ArrayList<Region<Province>>();
    Pattern pattern = Pattern.compile(".*" + exp + ".*", Pattern.CASE_INSENSITIVE);
    for (Country sel : countries.values()) {
      List<Region<Province>> result = sel.findProvinces(pattern);
      holder.addAll(result);
    }
    return holder;
  }

  public List<Region<Province>> findProvinces(String countryCode, String exp) {
    Country country = countries.get(countryCode);
    if (country != null) {
      Pattern pattern = Pattern.compile(".*" + exp + ".*", Pattern.CASE_INSENSITIVE);
      return country.findProvinces(pattern);
    }
    return new ArrayList<Region<Province>>();
  }

  public List<Region<City>> findCities(String countryName, String exp) {
    Country country = countries.get(countryName);
    if (country != null) {
      Pattern pattern = Pattern.compile(".*" + exp + ".*", Pattern.CASE_INSENSITIVE);
      return country.findCities(pattern);
    }
    return new ArrayList<Region<City>>();
  }

  public List<Region<City>> findCities(String countryName, String provinceName, String exp) {
    Country country = countries.get(countryName);
    if (country != null) {
      Pattern pattern = Pattern.compile(".*" + exp + ".*", Pattern.CASE_INSENSITIVE);
      return country.findCities(provinceName, pattern);
    }
    return new ArrayList<Region<City>>();
  }

  public List<Country> getCountries() {
    List<Country> holder = new ArrayList<Country>();
    for (Country c : countries.values()) {
      if (!c.isRecycleBin()) {
        holder.add(c);
      }
    }
    Collections.sort(holder, new Comparator<Country>() {
      @Override
      public int compare(Country it1, Country it2) {
        if (it1.getIndex() > it2.getIndex()) {
          return 1;
        } else {
          if (it1.getIndex() < it2.getIndex()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  public Country getCountry(String code) {
    return countries.get(code);
  }

  public Country saveCountry(Country country) throws Exception {
    countries.put(country.getCode(), country);
    saveCountryToJSON();
    return getCountry(country.getCode());
  }

  public boolean deleteCountry(Country country) throws Exception {
    if (countries.containsKey(country.getCode())) {
      if(country.isRecycleBin()){
      countries.remove(country.getCode());
      }else {
        countries.get(country.getCode()).setRecycleBin(true);
      }
      saveCountryToJSON();
      return true;
    }
    return false;
  }

  public List<City> findCityByName(String name) {
    List<City> holder = new ArrayList<City>();
    Pattern pattern = Pattern.compile(".*" + name + ".*", Pattern.CASE_INSENSITIVE);
    for (Country sel : countries.values()) {
      List<Province> provinces = sel.getProvinces();
      for (Province province : provinces) {
        List<City> citys = province.getCities();
        for (City city : citys) {
          if (pattern.matcher(city.getName()).matches()) {
            if (!city.isRecycleBin()) {
              holder.add(city);
            }
          }
        }
      }

      List<City> city1 = sel.getCities();
      for (City city : city1) {
        if (pattern.matcher(city.getName()).matches()) {
          holder.add(city);
        }
      }
    }
    Collections.sort(holder, new Comparator<City>() {
      @Override
      public int compare(City it1, City it2) {
        if (it1.getIndex() > it2.getIndex()) {
          return 1;
        } else {
          if (it1.getIndex() < it2.getIndex()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  public List<City> findCityByCountryAndName(String country, String name) {
    List<City> holder = new ArrayList<City>();
    Pattern pattern = Pattern.compile(".*" + name + ".*", Pattern.CASE_INSENSITIVE);
    Country sel = getCountry(country);
    List<Province> provinces = sel.getProvinces();
    for (Province province : provinces) {
      List<City> citys = province.getCities();
      for (City city : citys) {
        if (pattern.matcher(city.getName()).matches()) {
          if (!city.isRecycleBin()) {
            holder.add(city);
          }
        }
      }
    }

    List<City> city1 = sel.getCities();
    for (City city : city1) {
      if (pattern.matcher(city.getName()).matches()) {
        if (!city.isRecycleBin()) {
          holder.add(city);
        }
      }
    }
    Collections.sort(holder, new Comparator<City>() {
      @Override
      public int compare(City it1, City it2) {
        if (it1.getIndex() > it2.getIndex()) {
          return 1;
        } else {
          if (it1.getIndex() < it2.getIndex()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  void saveCountryToJSON() throws Exception {
    List<Country> holder = new ArrayList<Country>(countries.values());
    save(FILE_NAME_COUNTRY, JSONSerializer.INSTANCE.toString(holder), "countries configuration");
  }

  public List<Currency> getCurrencies() {
    List<Currency> holder = new ArrayList<Currency>();
    for (Currency c : currencies.values()) {
      if (!c.isRecycleBin()) {
        if (holder.size() > 0) {
          if (holder.get(holder.size() - 1).getPriority() > c.getPriority()) {
            holder.add(holder.size() - 1, c);
          } else {
            holder.add(c);
          }
        } else {
          holder.add(c);
        }
      }

    }
    Collections.sort(holder, new Comparator<Currency>() {
      @Override
      public int compare(Currency it1, Currency it2) {
        if (it1.getPriority() > it2.getPriority()) {
          return 1;
        } else {
          if (it1.getPriority() < it2.getPriority()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  public Currency getCurrency(String code) {
    return currencies.get(code);
  }

  public Currency saveCurrency(Currency currency) throws Exception {
    currencies.put(currency.getCode(), currency);
    saveCurrencyToJSON();
    return getCurrency(currency.getCode());
  }

  public boolean deleteCurrency(Currency country) throws Exception {
    if (currencies.containsKey(country.getCode())) {
      if(country.isRecycleBin()){
      currencies.remove(country.getCode());
      }else {
        currencies.get(country.getCode()).setRecycleBin(true);
      }
      saveCurrencyToJSON();
      return true;
    }
    return false;
  }

  void saveCurrencyToJSON() throws Exception {
    List<Currency> holder = new ArrayList<Currency>(currencies.values());
    save(FILE_NAME_CURRENCY, JSONSerializer.INSTANCE.toString(holder), "currencies configuration");
  }

  public List<ProductUnit> getProductUnits() {
    List<ProductUnit> holder = new ArrayList<ProductUnit>();
    for (ProductUnit c : units.values()) {
      if (!c.isRecycleBin()) {
        holder.add(c);
      }
    }
    Collections.sort(holder, new Comparator<ProductUnit>() {
      @Override
      public int compare(ProductUnit it1, ProductUnit it2) {
        if (it1.getPriority() > it2.getPriority()) {
          return 1;
        } else {
          if (it1.getPriority() < it2.getPriority()) {
            return -1;
          } else {
            return 0;
          }
        }

      }
    });
    return holder;
  }

  public ProductUnit getProductUnit(String code) {
    return units.get(code);
  }

  public ProductUnit saveProductUnit(ProductUnit productUnit) throws Exception {
    units.put(productUnit.getCode(), productUnit);
    saveProductUnitToJSON();
    return getProductUnit(productUnit.getCode());
  }

  public boolean deleteProductUnit(ProductUnit productUnit) throws Exception {
    if (units.containsKey(productUnit.getCode())) {
      if(productUnit.isRecycleBin()){
        units.remove(productUnit.getCode());
      }else {
        units.get(productUnit.getCode()).setRecycleBin(true);
      }
      
      saveProductUnitToJSON();
      return true;
    }
    return false;
  }

  void saveProductUnitToJSON() throws Exception {
    List<ProductUnit> holder = new ArrayList<ProductUnit>(units.values());
    save(FILE_NAME_UNIT, JSONSerializer.INSTANCE.toString(holder), "units configuration");
  }

  void save(String name, String data, String desc) {
    String path = this.configLoc + "/" + name;
    NodeDetail nDetail = cmsService.getNodeDetail(path);
    if (nDetail == null) {
      Node node = new Node(name);
      node.setMimeType("application/json");
      NodeAttributes attrs = new NodeAttributes();
      attrs.addAttribute(new NodeAttribute("description", "string", desc));
      attrs.addAttribute(new NodeAttribute("data", "string", data));
      cmsService.createNode(configLoc, node, attrs);
    } else {
      Node node = nDetail.getNode();
      NodeAttributes attrs = nDetail.getAttributes();
      attrs.addAttribute(new NodeAttribute("description", "string", desc));
      attrs.addAttribute(new NodeAttribute("data", "string", data));
      cmsService.updateNode(node, attrs);
    }
  }

  String getJSONConfig(String name) {
    String path = this.configLoc + "/" + name;
    NodeDetail nDetail = cmsService.getNodeDetail(path);
    if (nDetail == null)
      return null;
    NodeAttributes attrs = nDetail.getAttributes();
    String data = attrs.getAttritute("data").getValue();
    return data;
  }

}