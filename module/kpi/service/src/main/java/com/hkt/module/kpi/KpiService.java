package com.hkt.module.kpi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkt.module.kpi.entity.City;
import com.hkt.module.kpi.repository.CityRepository;

@Service("KpiService")
public class KpiService {

	@Autowired
	private CityRepository cityRepository;
	
	public KpiService() {
		super();
	}

	@Transactional(readOnly = true)
	public City getCityByCode(String code) {
		return cityRepository.getByCode(code);
	}

	@Transactional(readOnly = true)
	public List<City> getCityByCodeCountry(String codeCountry) {
		return cityRepository.getByCodeCountry(codeCountry);
	}

	@Transactional(readOnly = true)
	public List<City> getAllCity() {
		return (List<City>) cityRepository.findAll();
	}
	@Transactional
	public City saveCity(City city)
	{
		return cityRepository.save(city);
	}
	@Transactional
	public void deleteCity(City city)
	{
		System.out.println(city);
		cityRepository.delete(city);
	}

}
