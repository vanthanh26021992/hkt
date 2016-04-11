Thiết Kế Chung
===============

Các module chính
----------------

1. Core module sẽ dùng để quản lý các chức năng căn bản của một phần mềm như database monitor, 
server monitor, server configuration, jvm monitor. Sau này các chức năng như ngôn ngữ, tiền tệ... 
cũng có thể được quản lý ở đây.
  
2. Account module dùng để quản lý việc đăng nhập và thiết lập nhóm cũng như phân quyền. 
Khái niệm account khác với khái niệm user. Một user thường là một người trong khi một account có 
thể là một người hay một tổ chức. Dùng với hệ thống HKT, một account có thể là một nhân viên, một 
tổ chức doanh nghiệp, một khách hàng hay doanh nghiệp đối tác... tùy theo account đó ở trong nhóm 
nào hoặc được phân quyền gì. Ví dụ một người có một account để đăng nhập, người này vừa là nhân 
viên của công ty, vừa là khách hàng của công ty. Như vậy người này sẽ vừa ở trong nhóm employee 
và nhà nhóm customer.

3. Module Accounting module là module dùng để quản lý tất cả các việc thu chi của một tổ chức hoặc 
một doanh nghiệp. Các module khác như hr salary, mua bán hàng hóa xuất nhập kho hàng... sẽ được liên kết với 
module accounting cho từng nghiệp vụ thu chi chuyên biệt. 

4. Module cms dùng để quản lý content(nội dung). Thông thường các nội dung mà một tổ chức hay một doanh 
nghiệp cần quản lý bao gồm các hóa đơn, chứng từ, hợp đồng được scan lưu trữ dưới dạng images. Các nội dung 
như các bài viết , bài báo mô tả một sản phẩm, hợp đồng ký kết với nhân viên hay đối tác được chuẩn bị theo 
một mẫu sẵn... các bình luận(comment), phản hồi... liên quan đến một công việc...

5. Module HR(Human resource) dùng để quản lý nhân sự tiền lương... Module này sẽ được dùng với module 
account cho các chức năng phân quyền và nhóm. Ví dụ một công ty sẽ được tổ chức theo các nhóm như employee,
employee/hr, employee/sale, employee/developer, mỗi nhóm sẽ có manager hay leader với quyền hành khác nhau.

6. Warehouse module dùng để quản lý xuất nhập hàng hóa.
  
7. Service module dùng để quản lý việc mua bán các dịch vụ. Khác với wahouse module, service không 
cần việc xuất nhập lưu kho mà thường chỉ quản lý các hợp đồng chi tiêu. Các dịch vụ như spa, phòng mạch, 
nha khoa, văn phòng luật dùng module này sẽ thích hợp hơn là module warehouse. Một doanh nghiệp bán hàng 
cũng có thể dùng module này để quản lý các dịch vụ như vận chuyển, thuê luật sư...
  
8. Property module dùng để quản lý mua sắm và khấu hao tài sản như kho bãi, văn phòng, 
thiết bị văn phòng...
  
9. Customer module dùng để quản lý thông tin và các activities của khách hàng, module này sẽ được sử 
dụng với module account cho các chức năng phân nhóm và phân quyền.
  
10. School Module dùng để quản lý các liên hệ giáo viên, học sinh, lớp học và bảng điểm.

11. XYZ

Webui And REST
--------------

Để người dùng có thể giao tiếp và quản trị các module, các dữ liệu phải được hiện thị dươi dạng text , bảng và hình ảnh.
HKT sử dụng mô hình web client server để người cho phép người dùng có thể giao tiếp và quản trị các ERP module.

Mô hình web client server

    --------------------                                                                  
    |Web Browser       |                                   -------------------------------
    |------------------|                                   |Module                       |
    |                  |                                   |-----------------------------|
    |                  |<--\                               |                             |
    --------------------   |                               |                             |
                           |       ------------------      |      AccountService         |
    --------------------   \------>|Webui Controller|      |      HRService              |
    |Rest Client       |           |----------------|      |      WarehouseService       |
    |------------------|<--------> |Web Server      |----->|      CMSService             |
    |                  |           |(Tomcat, Jetty) |<-----|      SchoolService          |
    |                  |   /------>|                |      |                             |
    --------------------   |       ------------------      |                             |
    --------------------   |                               |                             |
    |Mobile Web Browser|   |                               |                             |
    --------------------   |                               -------------------------------
    |                  |<--/                                                              
    --------------------      



Các Khái Niệm Chính Trong Thiết Kế Và Tổ Chức Code
--------------------------------------------------

###Entity###

Một entity có thể được hiểu là môt object chứa các thuộc tích đại diện cho người, động vật, hoặc đồ vật...
Một entity được map tới một bảng trong database.

###Repository(DAO)###

Repository là phần logic để quản lý việc lưu trữ, truy xuất và cập nhât một entity. Mỗi Entity sẽ có môt 
repository tương ứng. Một Repository gồm 3 thành phần:
  
Repository interface dùng để customize các standard query cho một entity, ví dụ entity Account 
có AccountRepository với các custom query
  
    public interface AccountRepository extends CrudRepository<Account, Long>, AccountRepositoryCustom {
      @Query("select a from Account a where a.loginId = ?")
      Account findByTheLoginId(String loginId);
    
      List<Account> findByLastName(String lastName);
    
      @Query("select a from Account a where a.firstName = ?")
      List<Account> findByFirstName(String firstname);

      @Query("select a from Account a where a.firstName = :name or a.lastName = :name")
      List<Account> findByFirstNameOrLastName(@Param("name") String name);
    }
  
Repository Custom interface dùng để customize các trường hợp đặc biệt cần có sự hiểu biết về hệ thống 
hoặc tôi ưu các query. ví dụ như load theo trang khi một bảng quá lớn hoặc như khi xóa một account 
hay group cần phải xóa các memberhip của account hoặc group.  
    
     interface AccountRepositoryCustom {
       public List<Account> findByRange(int from, int size) ;
       public List<Account> jdbcFindByAll();
     }
  
Repository Custom Impl la class với các logic code cho các hàm trong interface Custom.

###Service###

Service là một class chứa các logic cho một unit task hoàn chỉnh. Ví dụ login task sẽ cần check xem 
loginId và password có valid, account có nằm trong group bị cấm hay không. Hay như việc xóa một account
sẽ phải xóa account và các membership của account và sẽ gọi các hàm xóa trong Account và Membership 
trong Repository. Nếu có vấn để giữa trừng, hàm xóa account trong service sẽ được rollback trở lại 
trạng thái ban đầu. Thường mỗi một hàm hay unit task trong service sẽ được annotate với Transactional 
để database rollback lại trạng thái trước khi một hàm hay unit task được execute.  

Core Module
============

TODO: cập nhật sau

Account Module
===============

Account module dùng để quản lý việc đăng nhập và thiết lập nhóm cũng như phân quyền. Account module 
bao gồm các thành phần chính:

    |-------------------|             |--------------------|             |------------------|
    | Account           |             | AccountMember      |             | AccountGroup     |
    |-------------------|             |--------------------|             |------------------|
    | id                |-- 1 - M --> | id                 | <-- M - 1-- | id               |
    | accountLoginId    |             | accountLoginId     |             | name             |
    | contact           |---          | groupPath          |             | path             |
    |___________________|  |          | capability         |             | parentId         |
                           |          |____________________|             |__________________|
                           |
                           |
                           |          |--------------------|
                           |          | Contact            |
                           |- 1 - M ->|--------------------|
                                      | id                 |
                                      | accountLoginId     |
                                      |                    |
                                      |____________________|
                    
Quan hệ giữa Account và AccountGroup thông qua membership là quan hệ Many To Many

Entity
------
  
###Account Entity###

Bao gồm các thuộc tính
  
* id: là một số long number được sinh tự đông cho mỗi object. 
* accountLoginId: là một string bao gồm các ký tự letter, digit, '-' và '_'
  contact: là một array được tính toán và load từ Contact table dựa vào field accountLoginId ở bảng Contact
    
###AccountGroup Entity###

Được tổ chức theo dạng hình cây nên một group sẽ có parent group và children. AccountGroup bao gồm các 
thuộc tính
  
* id: là một số long number được sinh tự đông cho mỗi object.
* name: là một string là một string bao gồm các ký tự letter, digit, '-' và '_' đại diện cho một group.
* groupPath: là id string có cấu chúc parent-name/parent-name/name. Ví dụ group employee và employee/hr. 
group path tương đương với id của một group nhưng thiết kế để người dùng có thể đọc và hiểu cấu chúc của
một group. Group path cũng được sử dụng để tối ưu cho các sql operation. 
* parentId:  tùy theo thiết kế có thể là parent path hoặc parent id.
    
###AccountMember Entity###

Dùng để kết nối một account với một group và quyền hạn của một account trong một group. AccountMember 
bao gồm các thuộc tính:

* id: là một số long number được sinh tự đông cho mỗi object.
* accountLoginId: là accountLoginId refer tới một account. 
* groupPath:      là group id refer tới một group.
* capability:     là quyện hạn của một account trong một group. Có 3 loại capability là READ, WRITE và ADMIN. 
READ chỉ cho phép một account xem các tài nguyên liên quan đến một nhóm. WRITE cho phép một account vừa 
xem vừa sửa đổi. ADMIN có cả quyền READ, WRITE và thêm quyền sửa quyền READ/WRITE của một account khác
trong cùng một nhóm.
  
###Contact Entity###

Dùng để lưu trữ các thông tin như tên, tuổi, địa chỉ, email, phone. Một account có thể có nhiều contact.

* id: là một số long number được sinh tự đông cho mỗi object.
* accountLoginId: là accountLoginId refer tới một account.
  
Repository
----------

###Các hàm chính trong AccountRepository###

* findById:
* save: 
* delete:
* findAll:

###Các hàm chính trong AccountGroupRepository###

* findById:
* save: 
* delete:
* findAll:


###Các hàm chính trong AccountMembershipRepository###

* findById:
* save: 
* delete:
* findAll:

Service
-------

###Các hàm chính trong AccountService###

* getAccount(id): get the account object by id 
* getAccountDetail(id):  get the account detail object. AccountDetail object bao gồm các thành phần Account, Memberships và Contact
* deleteAccount(id): Hàm delete sẽ xóa account và các memberships

CMS Module
===========

Cms module được dùng để quản lý tất cả các nội dung của một tổ chức hay một doanh nghiệp. Nội dung có thể được lưu trữ 
dưới các dạng text như xml , txt... hay các nội dung được lưu trữ dưới dạng binary như doc, pdf, images, video...

Cms module sẽ được tổ chức dưới dạng hình cây như hệ thống file system, mỗi node của cms module tương ứng với một file hay
một folder của file system. ngoài khả năng lưu trữ nội dung như một file mỗi node còn có khả năng lưu trữ các thuộc 
tính(Attribute) cho mỗi node như description, permission, owner, ngày tháng... và các node chuyen biệt như như hợp đồng, 
comment... sẽ có thể có các thuộc tính chuyên biệt cho từng node.

Ví dụ của một mô hình quản lý nội dung của một tổ chức.

    /Root
      - users/
        - admin   // các node dành riêng cho admin user như avatar
          - avartar.png
            ...........
      - contracts/
        - hopdong1.doc
          - hopdong2.doc
          - ............
      - products/
        - mobile/
          - iphone/
            - iphone4/
              - baiviet1.txt
              - baiviet2.txt
            - iphone5/
              - baiviet1.html
                - images/       // các images liên quan trong bài viết.
                  ..........
                - comments/
                   ........
Từ Vựng
--------

**Node** là một là một điểm trong cấu trúc hình cây của hệ thống cms, mỗi node có thể có 1 cha và nhiều con. Dữ liệu và
các thuộc tính được lưu trữ trong các property của node. Để tối ưu hệ thống, các dữ liệu lớn hay dữ liệu đặc biệt sẽ được 
lưu trữ trên file system thay vì lưu trữ trong database, trong trường hợp này , node chỉ lưu trữ các thông tin mô tả và 
reference tới dữ liệu trên file system.
 

Cấu Trúc Bảng Dữ Liệu Quan Hệ
------------------------------

        -----------------                  --------------------------
        |Node           |                  |NodeAttribute           |
        |---------------|                  |------------------------|
        |id             |----------------->|nodeId                  |
        |parentId       |                  |name                    |
        |name           |                  |value                   |
        |path           |                  --------------------------
        -----------------                                            


###Node###

Bảng Node có các trường

* id là một số long được sinh tự nhiên
* parentId là một số long được chỏ đến id của node cha.
* name là tên của node
* path là một string có cấu chúc  /parentName/parentName/name

Bảng NodeAttribute

* nodeId là id của node mà các attribute thuộc về.
* name là tên của attribute
* value là nội dung của attribute.

HR Module
=========

    |----------------|             |-----------------|              |------------------|
    | Employee       |             | Salary          |              | Salary Payment   |
    |----------------|             |-----------------|              |------------------|
    | accountLoginId |             | accountLoginId  |-- 1 - M -->  | accountLoginId   |
    |                |-- 1 - M --> |                 |              | salaryId         |
    |----------------|             |_________________|              |__________________|
    
TODO: 

Yêu cầu:

1. Liên hệ giữa nhân viên và Salary là One to Many. Một nhân viên có thể có nhiều salary entry theo 
thời gian như mỗi lần lên lương, lên chức... nhân viên sẽ có các mức lương, thuế thay đổi.
2. Liên hệ giữa Salary và Salary Payment là One To Many. Mỗi một nhân viên sẽ có một mức lương theo
chu kỳ và được trả theo tuần , theo tháng...
3. Nói chuyện với Tú về các yêu cầu của các bảng và các trường và các yêu cầu khác.
4. Trước mắt dựng các Entity căn bản, các Repository tương ứng với các Entity. Dựng các service như 
EmployeeService, SalaryService và các hàm cơ bản như xóa một employee sẽ phải xóa các salary và salary
 payment.

Accounting Module
=================

Accounting module dùng để quản lý chi tiêu của một doanh nghiệp. Accounting module được thiết kế để hoạt động
độc lập hoặc liên kết với các module khác của doanh nghiệp như quản lý tiền lương mua hoặc bán hàng hóa. 

Từ Vựng
--------

1. Invoice có nghĩa là hóa đơn dùng để chỉ một hoạt động thu chi của một doanh nghiệp
2. Invoice Payment có nghĩa là một hoạt động chi trả bằng tiền, chuyển khoản hoặc thể tín dụng. Tiền thu chi
được rút hoặc nhập vào một tài khoản ngân hàng. Một invoice có thể có nhiều payment.

Cấu Trúc Bảng Dữ Liệu Quan Hệ
------------------------------

Cấu trúc bảng dữ liệu quan hệ gồm hai bảng chính là Invoice và InvoicePayment.

     -----------------------                   --------------------
     |Invoice              |                   |InvoicePayment    |
     |---------------------|                   |------------------|
     |id                   |                   |id                |
     |type                 | ----------------> |invoiceId         |
     |activityType         |                   |amount            |
     |amount               |                   |currencyUnit      |
     |curencyUnit          |                   |paymentType       |
     |status               |                   |bankAccount       |
     |referTo              |                   |paymentDate       |
     |description          |                   |                  |
     -----------------------                   --------------------

###Invoice###

Bảng Invoice có các trường

* id là một số long unique được sinh tự động
* type dùng để chỉ loại invoice như bán hàng, nhập hàng, trả lương
* activityType là một string với hai giá trị là receipt và payment. Receip là khoản tiền doanh nghiệp sẽ 
nhận được và phải nhập vào tài khoản của công ty. Payment là khoản tiền doanh nghiệp phải trả.
* amount là tổng khoản tiền phải chi trả
* currencyUnit là loại tiền $,EU,VND...
* status chỉ trạng thái của invoice như đã thanh toán hết tiền hoặc vẫn cần chi trả
* referTo chỉ invoice liên quan đến các hoạt động nào như xuất nhập kho, trả lương nhân viên, mua sắm...
* description dùng để mô tả chi tiết lý do thu chi. Trong trường hợp một doanh nghiệp không có các module như
quản lý tiền lương, quản lý hàng hóa... phần mô tả sẽ được sử dụng để mô tả hoạt động thu chi. 

###Invoice Payment###

Bảng InvoicePayment có các trường

* id là một số long unique được sinh tự động
* invoiceId là id của invoice gốc
* amount khoản tiền được thanh toán
* currencyUnit là loại tiền dùng để thanh toán
* paymentType là phương thức thanh toán như trả tiền mặt, trả bằng chuyển khoản, bằng thẻ tín dụng...
* bankAccount là tài khoản được nhập hoặc rút cho hoạt động chi trả.
* paymentDate là ngày thực hiện thanh toán


Warehouse Module
=================

Warehouse module được thiết kế để dùng quản lý việc xuất nhập hàng hóa. 

Yêu cầu quản lý hàng của một doanh nghiệp
-----------------------------------------

1. Một doanh nghiệp có thể có nhiều kho hàng và nhiều sản phẩm. 
2. Một sản phẩm có thể phân theo nhóm và nằm trong nhiều nhóm khác nhau.
3. Một sản phẩm có thể nằm trong một hoặc nhiều kho hàng với số lượng khác nhau.
4. Một kho hàng có thể nhập theo hàng theo đơn vị(chiếc, lô...) từ nhiều doanh nghiệpt hoặc đại lý khác nhau
5. Một kho hàng có thể xuất hàng theo một phần hoặc nguyên lô đã nhập 

Từ Vựng
-------

-  **Warehouse** dùng để chỉ một nhà kho
-  **Inventory** dùng để chỉ hàng hóa trong kho
-  **Product**   dùng để chỉ một mặt hàng có thể cầm sờ mó được
-  **Tag**       dùng để chỉ một nhãn, hoặng một nhóm hàng.
-  **Receipt Inventory** dùng để chỉ hàng/phiếu nhập kho.
-  **Delivery Inventory** dùng để chỉ hàng/phiếu xuất kho. 

Thiết Kế Cơ Sở Dữ Liệu
----------------------

      -----------------           ---------------------           ---------------------
      |Warehouse      |           |ReceiptInventory   |           |DeliveryInventory  |
      |---------------|           |-------------------|           |-------------------|
      |id             |           |id                 |           |id                 |
      |companyId      | --------> |warehouseId        | --------> |receiptInventoryId |
      |location       |   /-----> |productId          |           |warehouseId        |
      |               |   |       |quantity           |           |productId          |
      |               |   |       |unit               |           |quantity           |
      |               |   |       |validFromDate      |           |unit               |
      |               |   |       |expireDate         |           |invoiceRef         |
      -----------------   |       |invoiceRef         |           |                   |
                          |       |                   |           |                   |
                          |       ---------------------           ---------------------
                          |                                                            
                          |                                                            
     ------------------   |       --------------------         -------------------     
     |Product         |---/       |ProductTagJoin    |         |ProductTag       |     
     |----------------|           |--o---------------|         |-----------------|     
     |id              | --------> |productId         | <------ |id               |     
     |name            |           |productTagId      |         |parentId         |     
     |maker           |           --------------------         |name             |     
     |productTag[]    |                                        |                 |     
     |attributes      |                                        |                 |     
     |                |                                        |                 |     
     ------------------                                        -------------------     

###Warehouse###

Bảng Warehouse gồm các trường

* id là một số long sinh tự động.
* companyId là id của doanh nghiệp sở hữu kho hàng.
* location là địa chỉ , vị trí của kho hàng.

###Product###

Bảng Product gồmg các trường

* id là một số long sinh tự động.
* name là tên của sản phẩm
* maker là tên hãng sản xuất sản mặt hàng.
* productTag là một array của các product tag mà product nằm trong.
* attributes là một số trường đặc biệt cho mỗi mặt hàng. 

###ProductTag###

Bảng ProductTag dùng để phân nhóm cho các mặt hàng, các nhóm được quản lý theo mô hình hình cây. 
Bảng bao gồm các trường

* id là một số long sinh tự động.
* name là tên hoặc nhãn của một nhóm
* parentId là id của một tag hoặc nhóm cha.

###ReceiptInventory###

Bảng ReceiptInventory dùng để quản lý quy trình nhập hàng vào kho. Bảng bao gồm các trường

* id là một số long sinh tự động.
* warehouseId là id của kho hàng mà product dược nhập vào
* productId là id của product
* quantity là số lượng được nhập
* unit là đơn vị của số lượng như chiếc, lô, thùng...
* validFromDate là chỉ ngày bắt đầu mặt hàng có giá trị sử dụng
* expireDate là chỉ ngày cuối cùng mặt hàng có thể sử dụng. Khi xuất kho, thường thì các hàng gần hết hạn
sử dụng sẽ được ưu tiên xuất trước.
* invoiceRef dùng để chỉ việc nhập hàng liên quan đến invoice nào.

###DeliveryInventory###

Bảng DeliveryInventory dùng để quản lý quy trình xuất hàng khỏi kho. Bảng bao gồm các trường

* id là một số long sinh tự động.
* receiptInventoryId là id của lô hàng được nhập vào kho
* warehouseId là id của kho hàng mà product dược nhập vào
* productId là id của product
* quantity là số lượng được xuất, số lượng không thể nhiều hơn số lượng lô hàng được nhập còn lại trong kho
* unit là đơn vị của số lượng như chiếc, lô, thùng...
* invoiceRef  dùng để chỉ việc xuất hàng liên quan đến invoice nào

Service Module
==============

Property Module
===============

School Module
=============

