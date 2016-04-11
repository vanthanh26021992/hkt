package com.hkt.module.kpi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.hkt.module.kpi.entity.City;

public interface CityRepository extends CrudRepository<City, Long> {
	public City getByCode(String code);
	
	@Query("select c from City c where c.codeCountry=:codeCountry")
	List<City>getByCodeCountry(@Param("codeCountry")String codeCountry);
	
	
	
}
