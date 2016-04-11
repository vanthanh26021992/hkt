package com.hkt.module.account;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkt.module.account.entity.Account;
import com.hkt.module.account.entity.Account.Type;
import com.hkt.module.account.entity.AccountDetail;
import com.hkt.module.account.entity.AccountGroup;
import com.hkt.module.account.entity.AccountGroupDetail;
import com.hkt.module.account.entity.AccountMembership;
import com.hkt.module.account.entity.AccountMembership.Capability;
import com.hkt.module.account.entity.Profile;
import com.hkt.module.account.entity.Profiles;
import com.hkt.module.account.repository.AccountGroupRepository;
import com.hkt.module.account.repository.AccountMembershipRepository;
import com.hkt.module.account.repository.AccountRepository;
import com.hkt.module.account.util.AccountScenario;
import com.hkt.module.core.ServiceCallback;
import com.hkt.module.core.entity.AbstractPersistable.State;
import com.hkt.module.core.entity.FilterQuery;
import com.hkt.module.core.entity.FilterResult;
import com.hkt.module.core.search.FSSearchService;
import com.hkt.module.core.search.SearchQuery;
import com.hkt.module.core.search.SearchResult;
import com.hkt.module.kpi.KpiService;
import com.hkt.util.text.DateUtil;

@Service("AccountService")
public class AccountService {

	@Autowired
	private AccountRepository accountRepo;

	@Autowired
	private KpiService kpiService;
	

	@Autowired
	private AccountGroupRepository accountGroupRepo;

	@Autowired
	private AccountMembershipRepository membershipRepo;

	@Autowired
	private FSSearchService searchService;

	public AccountService() {
		super();
	}

	@Transactional(readOnly = true)
	public Account getAccountById(Long accoutId) {
		return accountRepo.findOne(accoutId);
	}
	
	

	@Transactional(readOnly = true)
	public Account getByEmail(String email) {
		return accountRepo.getByEmail(email);
	}

	@Transactional(readOnly = true)
	public Account getAccountByLoginId(String loginId) {
		return accountRepo.getByLoginId(loginId);
	}

	@Transactional(readOnly = true)
	public Account login(String loginId, String password) {
		Account account = accountRepo.getByLoginId(loginId);
		if (account != null) {
			if (account.getPassword().equals(password))
				account.setPassword(null);
			else
				account = null;
		}
		return account;
	}

	@Transactional
	public Account saveAccount(Account account) throws Exception {
		boolean isNew = account.isNew();
		try {
			if(account.getType()== Type.USER)
				account.setName(account.getProfiles().getBasic().get("lastName")
					.toString()
					+ " "+account.getProfiles().getBasic().get("firstName").toString());
			else
				account.setName(account.getProfiles().getBasic().get("name").toString());
		} catch (Exception e) {
			// TODO: handle exception
		}
		account = accountRepo.save(account);
		searchService.add(account.getId(), account, isNew);
		return account;
	}

	// khanhdd
	/** @param loginId */
	@Transactional
	public boolean deleteAccountByLoginId(String loginId) throws Exception {
		Account account = accountRepo.getByLoginId(loginId);
		if (account == null)
			return false;
		else
			return deleteAccountCallBack(account, null);
	}

	// khanhdd
	/**
	 * 
	 * @param account
	 * @param callback
	 */
	@Transactional
	public boolean deleteAccountCallBack(Account account,
			ServiceCallback<AccountService> callback) throws Exception {
		if (callback != null) {
			callback.callback(this);
		}
		membershipRepo.deleteByAccountLoginId(account.getLoginId());
		accountRepo.delete(account.getId());
		return true;

	}

	/**
	 * Bui Trong Hieu
	 * @Param businessInformation
	 */
	
	public Account getBusinessInformation() throws Exception{
		Account account = getAccountByLoginId("HKT");
		if(account == null){
			account = new Account();
			account.setLoginId("HKT");
			account.setPassword("hkt");
			account.setType(Type.ORGANIZATION);
			account.setEmail("hkt@gmail.com");
			account.setLastLoginTime(new Date());

			Profile profileOrgBasic = new Profile();
			profileOrgBasic.put("name", "HKT Consultant");
			profileOrgBasic.put("manager", "true");
			account.setName("HKT");
			Profiles profiles = new Profiles();
			profiles.setBasic(profileOrgBasic);
			account.setProfiles(profiles);
			saveAccount(account);
		}
		return account;

	}
	
	// khanhdd
	/**
	 * @param loginId
	 * @param groupPath
	 */
	@Transactional
	public boolean deleteMembershipByLoginIdAndGroupPath(String loginId, String groupPath) {
		membershipRepo.deleteByAccountLoginIdAndGroupPath(loginId, groupPath);
		return true;
	}

	@Transactional(readOnly = true)
	public List<Account> findAccountByLoginId(String loginId, Type type) {
		loginId = loginId.replace('*', '%').toLowerCase();
		return accountRepo.findByLoginId(loginId, type);
	}
	
	@Transactional(readOnly = true)
	public List<Account> findAccountByName(String loginId) {
		loginId = loginId.replace('*', '%').toLowerCase();
		return accountRepo.findAccountByName(loginId);
	}
	
	public FilterResult<Account> filterAccount(FilterQuery query) {
		if (query == null)
			query = new FilterQuery();
		return accountRepo.search(query);
	}

	public SearchResult<Account> searchAccounts(SearchQuery query)
			throws Exception {
		return this.searchService.query(Account.class, query);
	}

	@Transactional(readOnly = true)
	public AccountDetail getAccountDetail(Long accoutId) {
		Account account = accountRepo.findOne(accoutId);
		if (account == null)
			return null;
		List<AccountMembership> memberships = membershipRepo
				.findByAccountLoginId(account.getLoginId());
		AccountDetail detail = new AccountDetail(account, memberships);
		return detail;
	}

	@Transactional(readOnly = true)
	public AccountDetail getAccountDetail(String loginId) {
		Account account = accountRepo.getByLoginId(loginId);
		if (account == null)
			return null;
		List<AccountMembership> memberships = membershipRepo
				.findByAccountLoginId(account.getLoginId());
		AccountDetail detail = new AccountDetail(account, memberships);
		return detail;
	}

	@Transactional
	public void saveAccountDetail(AccountDetail accDetail) throws Exception {
		Account account = accDetail.getAccount();
		account = saveAccount(account);
		List<AccountMembership> memberships = accDetail.getMemberships();
		if (memberships != null) {
			for (AccountMembership m : memberships) {
				AccountGroup group = getAccountGroupByCode(m.getGroupPath());
				saveOrUpdateMembership(account, group, m.getCapability());
			}
		}
	}

	@Transactional(readOnly = true)
	public AccountGroup getGroupById(Long id) {
		return accountGroupRepo.findOne(id);
	}

	
	@Transactional(readOnly = true)
	public AccountGroup getAccountGroupByCode(String code) {
		return accountGroupRepo.getByCode(code);
	}
	
	@Transactional(readOnly = true)
	public List<AccountGroup> getAccountGroupByParentCode(String code) {
		if(code.isEmpty()){
			return accountGroupRepo.findRootGroup();
		}else{
			return accountGroupRepo.getAccountGroupByParentCode(code);
		}
		
	}


	@Transactional(readOnly = true)
	public List<AccountGroup> getByLoginIds(String loginId) {
		return accountGroupRepo.getByLoginIds(loginId);
	}

	@Transactional
	public AccountGroup saveGroup(AccountGroup group) throws Exception{
		if(group.getCode()==null){
			group.setCode(DateUtil.asCompactDateTimeId(new Date()));
		}
		return accountGroupRepo.save(group);
	}

	
	 @Transactional(readOnly = true)
	 public List<AccountGroup> getAccountGroupByResponsible(String code) {
	 return accountGroupRepo.getAccountGroupByResponsible(code);
	 }

	@Transactional
	public void saveGroups(List<AccountGroup> groups) {

	}

	/**
	 * @param id
	 */
	public boolean deleteAccountGroup(Long id) {
		AccountGroup group = accountGroupRepo.findOne(id);
		if (group != null)
			return deleteGroupCallBack(group, null);
		else
			return false;
	}

	/**
	 * @param group
	 */
	@Transactional
	public boolean deleteGroup(AccountGroup group) {
		return deleteGroupCallBack(group, null);
	}

	// khanhdd
	@Transactional
	public boolean deleteGroupCallBack(AccountGroup group,
			ServiceCallback<AccountService> callback) {
		if (callback != null)
			callback.callback(this);
		if (group == null) {
			return false;
		} else {
			accountGroupRepo.delete(group);
			membershipRepo.deleteByGroupPath(group.getCode());
			return true;
		}
	}

	@Transactional(readOnly = true)
	public AccountGroupDetail getGroupDetailById(Long id) {
		AccountGroup group = accountGroupRepo.findOne(id);
		if (group == null)
			return null;
		List<AccountMembership> memberships = membershipRepo
				.findByGroupPath(group.getCode());
		List<AccountGroup> children = accountGroupRepo.getAccountGroupByParentCode(group
				.getCode());
		AccountGroupDetail detail = new AccountGroupDetail(group, memberships,
				children);
		return detail;
	}

	@Transactional(readOnly = true)
	public AccountGroupDetail getGroupDetailByCode(String path) {
		if (path == null)
			return getRootGroupDetail();

		AccountGroup group = accountGroupRepo.getByCode(path);
		if (group == null)
			return null;
		List<AccountMembership> memberships = membershipRepo
				.findByGroupPath(group.getCode());
		List<AccountGroup> children = accountGroupRepo.getAccountGroupByParentCode(group
				.getCode());
		AccountGroupDetail detail = new AccountGroupDetail(group, memberships,
				children);
		return detail;
	}

	@Transactional(readOnly = true)
	public AccountGroupDetail getRootGroupDetail() {
		List<AccountMembership> memberships = new ArrayList<AccountMembership>();
		List<AccountGroup> children = accountGroupRepo.findRootGroup();
		AccountGroupDetail detail = new AccountGroupDetail(null, memberships,
				children);
		return detail;
	}
	
	
	
	@Transactional(readOnly = true)
	public AccountMembership getMembership(Long id) {
		return membershipRepo.findOne(id);
	}
	
	@Transactional(readOnly = true)
	public List<AccountMembership> getAllMemberShipByPath(String path) {
		return membershipRepo.getAllMemberShipByPath(path);
	}

	
	@Transactional
	public AccountMembership saveOrUpdateMembership(Account account,
			AccountGroup group, Capability cap) {
		return saveOrUpdateMembership(account.getLoginId(), group.getCode(),
				cap);
	}

	
	
	AccountMembership saveOrUpdateMembership(String loginId, String gpath,
			Capability cap) {
		AccountMembership membership = membershipRepo.getByAccountAndGroup(
				loginId, gpath);
		if (membership == null) {
			membership = new AccountMembership();
			membership.setLoginId(loginId);
			membership.setGroupPath(gpath);
		}
		membership.setCapability(cap);
		return membershipRepo.save(membership);
	}

	@Transactional
	public AccountMembership saveAccountMembership(
			AccountMembership accountMembership) {
		return membershipRepo.save(accountMembership);
	}

	@Transactional
	public void saveAccountMemberships(List<AccountMembership> list) {
		if (list == null)
			return;
		for (AccountMembership m : list) {
			if (m.getPersistableState() == State.DELETED) {
				if (!m.isNew())
					membershipRepo.delete(m);
			} else {
				saveOrUpdateMembership(m.getLoginId(), m.getGroupPath(),
						m.getCapability());
			}
		}
	}

	public AccountMembership createMembership(String loginId, String groupPath,
			Capability cap) {
		Account account = accountRepo.getByLoginId(loginId);
		AccountGroup group = this.accountGroupRepo.getByCode(groupPath);
		return saveOrUpdateMembership(account, group, cap);
	}

	// khanhdd
	@Transactional
	public boolean deleteMembership(AccountMembership accountMembership) {
		membershipRepo.delete(accountMembership);
		return true;
	}

	@Transactional(readOnly = true)
	public List<AccountMembership> findMembershipByAccountLoginId(String loginId) {
		return membershipRepo.findByAccountLoginId(loginId);
	}

	@Transactional(readOnly = true)
	public List<AccountMembership> findMembershipByGroupPath(String path) {
		return membershipRepo.findByGroupPath(path);
	}

	@Transactional(readOnly = true)
	public AccountMembership getMembershipByAccountAndGroup(String loginId,
			String gpath) {
		return membershipRepo.getByAccountAndGroup(loginId, gpath);
	}

	public void createScenario(AccountScenario scenario) throws Exception {
		saveGroups(scenario.getGroups());
		if (scenario.getAccounts() != null) {
			for (AccountDetail sel : scenario.getAccounts())
				saveAccountDetail(sel);
		}
	}

	public String ping() {
		return "AccountService alive!!!";
	}

	@Transactional
	public void deleteAll() throws Exception {
		accountRepo.deleteAll();
		accountGroupRepo.deleteAll();
		membershipRepo.deleteAll();
		searchService.delete(Account.class);
	}

	@Transactional(readOnly = true)
	public List<AccountGroup> findGroupByName(String name) {
		return accountGroupRepo.findByName(name.toLowerCase());
	}


	@Transactional(readOnly = true)
	public List<Account> getAccountByUser() {
		return accountRepo.findAccountByType(Type.USER);
	}
	
	@Transactional(readOnly = true)
	public List<Account> getAccountByDeparment(String code){
		List<AccountMembership> memberships = getAllMemberShipByPath(code);
		List<Account> accounts = new ArrayList<Account>();
		for(AccountMembership membership: memberships){
			String loginId = membership.getLoginId();
			Account account = getAccountByLoginId(loginId);
			accounts.add(account);
		}
		return accounts;
	}
	
	@Transactional(readOnly = true)
	public List<Account> findAccountByType(Type type) {
		return accountRepo.findAccountByType(type);
	}

	@Transactional(readOnly = true)
	public List<AccountGroup> findAllAccountGroup() {
		return (List<AccountGroup>) accountGroupRepo.findAll();
	}

	@Transactional
	public void deleteTest(String test) {
		accountRepo.deleteTest(test);
		membershipRepo.deleteTest(test);
		accountGroupRepo.deleteTest(test);
	}

}