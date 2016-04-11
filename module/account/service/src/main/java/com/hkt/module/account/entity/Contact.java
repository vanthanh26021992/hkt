package com.hkt.module.account.entity;

import com.hkt.module.core.entity.AbstractPersistable;


public class Contact extends AbstractPersistable<Long> {
  private static final long serialVersionUID = 1L;

  private String            label;
  private String            addressNumber;
  private String            street;
  private String            district;
  private String            city;
  private String			nameCity;
  private String            country;
  private String			nameCountry;
  private String            postalCode;
  private String[]          email;
  private String[]          phone;
  private String[]          mobile;
  private String[]          fax;
  private String[]          website;

  public String getLabel() { return label; }

  public void setLabel(String label) { this.label = label; }

  public String getAddressNumber() { return addressNumber; }

  public void setAddressNumber(String addressNumber) { this.addressNumber = addressNumber; }

  public String getStreet() { return street; }

  public void setStreet(String street) { this.street = street; }

  public String getDistrict() { return district; }

  public void setDistrict(String district) { this.district = district; }

  public String getCity() { return city; }

  public void setCity(String city) { this.city = city; }

  public String getCountry() { return country; }

  public void setCountry(String country) { this.country = country; }

  public String getPostalCode() { return postalCode; }

  public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

  public String[] getEmail() { return email; }

  public void setEmail(String[] email) { this.email = email; }

  public String[] getPhone() { return phone; }

  public void setPhone(String[] phone) { this.phone = phone; }

  public String[] getMobile() { return mobile; }

  public void setMobile(String[] mobile) { this.mobile = mobile; }

  public String[] getFax() { return fax; }

  public void setFax(String[] fax) { this.fax = fax; }

  public String[] getWebsite() { return website; }
  
  public void setWebsite(String[] website) { this.website = website; }

public String getNameCity() {
	return nameCity;
}

public void setNameCity(String nameCity) {
	this.nameCity = nameCity;
}

public String getNameCountry() {
	return nameCountry;
}

public void setNameCountry(String nameCountry) {
	this.nameCountry = nameCountry;
}

}