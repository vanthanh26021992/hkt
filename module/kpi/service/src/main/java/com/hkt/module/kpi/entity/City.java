package com.hkt.module.kpi.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.hkt.module.core.entity.AbstractPersistable;

@Entity
@Table
public class City extends AbstractPersistable<Long>{

	private static final long serialVersionUID = 1L;
	
	private String name;
	private String description;
	private String codeCountry;
	
	public City() {
		super();
	}
	public City(String name, String description, String codeCountry) {
		super();
		this.name = name;
		this.description = description;
		this.codeCountry = codeCountry;
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
	public String getCodeCountry() {
		return codeCountry;
	}
	public void setCodeCountry(String codeCountry) {
		this.codeCountry = codeCountry;
	}
	
	
}
