package com.hkt.module.kpi.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.hkt.module.core.entity.AbstractPersistable;

@Entity
@Table
public class Country extends AbstractPersistable<Long>{

	private static final long serialVersionUID = 1L;
	private String name;
	private String description;
	
	
	
	public Country() {
		super();
	}
	public Country(String name, String description) {
		super();
		this.name = name;
		this.description = description;
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
	
	
}
