package com.hkt.module.account.entity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.type.TypeReference;

import com.hkt.module.core.entity.AbstractPersistable;
import com.hkt.util.json.JSONSerializer;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = { "loginId", "email" }))
public class Account extends AbstractPersistable<Long> {
	private static final long	serialVersionUID	= 1L;

	public enum Type {
		USER, ORGANIZATION
	}

	@NotNull
	@Column(unique = true)
	private String				loginId;

	@NotNull
	private String				password;

	@Enumerated(EnumType.STRING)
	private Type					type = Type.USER;
	
	private String				email;

	private Date					lastLoginTime;
	private Date					birthday;
	@Transient
	private List<Contact>	contacts;
	@Transient
	private Profiles			profiles;
	
	private String name;
	private String mobile;
	private String address;

	public Account() {
	}

	public Account(Long id) {
		this.setId(id);
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Type getType() {
		return type;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	@JsonIgnore
	@Column(length = 64000)
	@Lob
	@Access(AccessType.PROPERTY)
	public String getContactData() throws IOException {
		if (contacts == null)
			return null;
		return JSONSerializer.INSTANCE.toString(contacts);
	}

	public void setContactData(String data) throws IOException {
		if (data == null || data.length() == 0)
			return;
		contacts = JSONSerializer.INSTANCE.fromString(data, new TypeReference<List<Contact>>() {
		});
	}

	@Transient
	public List<Contact> getContacts() {
		return contacts;
	}

	public void setContacts(List<Contact> contacts) {
		this.contacts = contacts;
	}

	public void addContact(Contact contact) {
		if (contacts == null)
			contacts = new ArrayList<Contact>();
		contacts.add(contact);
	}

	@JsonIgnore
	@Column(length = 64000)
	@Lob
	@Access(AccessType.PROPERTY)
	public String getProfilesData() throws IOException {
		if (profiles == null)
			return null;
		return JSONSerializer.INSTANCE.toString(profiles);
	}

	public void setProfilesData(String data) throws IOException {
		if (data == null || data.length() == 0)
			return;
		profiles = JSONSerializer.INSTANCE.fromString(data, new TypeReference<Profiles>() {
		});
	}

	@Transient
	public Profiles getProfiles() {
		return profiles;
	}

	public void setProfiles(Profiles profiles) throws IOException {
		this.profiles = profiles;
		if (profiles == null)
			setProfilesData(null);
		else
			setProfilesData(JSONSerializer.INSTANCE.toString(profiles));
	}

	@Override
	public String toString() {
		try {
			return name;
		} catch (Exception ex) {
			return loginId;
		}
	}
}
