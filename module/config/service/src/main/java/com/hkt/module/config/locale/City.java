package com.hkt.module.config.locale;

import java.io.IOException;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Lob;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.type.TypeReference;

import com.hkt.util.json.JSONSerializer;

public class City {
	private int index;
	private int priority;
	private String name;
	private String code;
	private String description;
	private CityImage cityImage;
	private boolean recycleBin;
	
	

	public boolean isRecycleBin() {
    return recycleBin;
  }

  public void setRecycleBin(boolean recycleBin) {
    this.recycleBin = recycleBin;
  }

  public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	@JsonIgnore
	@Column(length = 64000)
	@Lob
	@Access(AccessType.PROPERTY)
	public String getProfilesData() throws IOException {
		if (cityImage == null)
			return null;
		return JSONSerializer.INSTANCE.toString(cityImage);
	}

	public void setProfilesData(String data) throws IOException {
		if (data == null || data.length() == 0)
			return;
		cityImage = JSONSerializer.INSTANCE.fromString(data, new TypeReference<CityImage>() {
		});
	}

	@Transient
	public CityImage getCityImage() {
		return cityImage;
	}

	public void setCityImage(CityImage cityImage) throws IOException {
		this.cityImage = cityImage;
		if (cityImage == null)
			setProfilesData(null);
		else
			setProfilesData(JSONSerializer.INSTANCE.toString(cityImage));
	}

	@Override
	public String toString() {
		return name;
	}

}