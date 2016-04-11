package com.hkt.module.config.locale;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Lob;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.type.TypeReference;

import com.hkt.module.config.locale.City;
import com.hkt.module.config.locale.Province;
import com.hkt.module.config.locale.Region;
import com.hkt.util.json.JSONSerializer;

public class Country {
	private String name;
	private String code;
	private int priority;
	private String flag;
	private CountryImage countryImage;
	private int index;
	private String description;
	private List<Province> provinces;
	private List<City> cities;
	private boolean	recycleBin;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}
	
	public boolean isRecycleBin() {
		return recycleBin;
	}
	
	public void setRecycleBin(boolean recycleBin) {
		this.recycleBin = recycleBin;
	}

	@JsonIgnore
	@Column(length = 64000)
	@Lob
	@Access(AccessType.PROPERTY)
	public String getProfilesData() throws IOException {
		if (countryImage == null)
			return null;
		return JSONSerializer.INSTANCE.toString(countryImage);
	}

	public void setProfilesData(String data) throws IOException {
		if (data == null || data.length() == 0)
			return;
		countryImage = JSONSerializer.INSTANCE.fromString(data, new TypeReference<CountryImage>() {
		});
	}

	@Transient
	public CountryImage getCountryImage() {
		return countryImage;
	}

	public void setCountryImage(CountryImage countryImage) throws IOException {
		this.countryImage = countryImage;
		if (countryImage == null)
			setProfilesData(null);
		else
			setProfilesData(JSONSerializer.INSTANCE.toString(countryImage));
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Province> getProvinces() {
		return provinces;
	}

	public void setProvinces(List<Province> provinces) {
		this.provinces = provinces;
	}

	public List<City> getCities() {
		return cities;
	}

	public void setCities(List<City> cities) {
		this.cities = cities;
	}

	public List<Region<Province>> findProvinces(Pattern exp) {
		List<Region<Province>> holder = new ArrayList<Region<Province>>();
		for (Province sel : provinces) {
			if (exp.matcher(sel.getName()).matches()) {
				Region<Province> region = new Region<Province>();
				region.setType(Region.Type.Province);
				region.setCountry(getName());
				region.setProvince(sel.getName());
				region.setRegion(sel);
				holder.add(region);
			}
		}
		return holder;
	}

	public List<Region<City>> findCities(Pattern exp) {
		List<Region<City>> holder = new ArrayList<Region<City>>();
		if (cities != null) {
			for (City sel : cities) {
				if (exp.matcher(sel.getName()).matches()) {
					Region<City> region = new Region<City>();
					region.setType(Region.Type.City);
					region.setCountry(getName());
					region.setRegion(sel);
					holder.add(region);
				}
			}
		}
		for (Province p : provinces) {
			holder.addAll(p.findCities(this, exp));
		}
		return holder;
	}

	public List<Region<City>> findCities(String pName, Pattern exp) {
		Province province = getProvince(pName);
		if (province != null)
			return province.findCities(this, exp);
		return new ArrayList<Region<City>>();
	}

	public Province getProvince(String name) {
		for (Province sel : provinces) {
			if (name.equals(sel.getName()))
				return sel;
		}
		return null;
	}

	@Override
	public String toString() {
		return name;
	}

}
