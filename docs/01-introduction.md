#Thiết Kế Chung#
===============

##Các module chính##
--------------------

###Core Module###
Core module sẽ dùng để quản lý các chức năng căn bản của một phần mềm như database monitor, 
server monitor, server configuration, jvm monitor. Sau này các chức năng như ngôn ngữ, tiền tệ... 
cũng có thể được quản lý ở đây.

###Account Module###
Account module dùng để quản lý việc đăng nhập và thiết lập nhóm cũng như phân quyền. 
Khái niệm account khác với khái niệm user. Một user thường là một người trong khi một account có 
thể là một người hay một tổ chức. Dùng với hệ thống HKT, một account có thể là một nhân viên, một 
tổ chức doanh nghiệp, một khách hàng hay doanh nghiệp đối tác... tùy theo account đó ở trong nhóm 
nào hoặc được phân quyền gì. Ví dụ một người có một account để đăng nhập, người này vừa là nhân 
viên của công ty, vừa là khách hàng của công ty. Như vậy người này sẽ vừa ở trong nhóm employee 
và nhà nhóm customer.

###Accountting Module###
Module Accounting module là module dùng để quản lý tất cả các việc thu chi của một tổ chức hoặc 
một doanh nghiệp. Các module khác như hr salary, mua bán hàng hóa xuất nhập kho hàng... sẽ được liên kết với 
module accounting cho từng nghiệp vụ thu chi chuyên biệt. 

###CMS Module###
Module cms dùng để quản lý content(nội dung). Thông thường các nội dung mà một tổ chức hay một doanh 
nghiệp cần quản lý bao gồm các hóa đơn, chứng từ, hợp đồng được scan lưu trữ dưới dạng images. Các nội dung 
như các bài viết , bài báo mô tả một sản phẩm, hợp đồng ký kết với nhân viên hay đối tác được chuẩn bị theo 
một mẫu sẵn... các bình luận(comment), phản hồi... liên quan đến một công việc...

###HR Module###
Module HR(Human resource) dùng để quản lý nhân sự tiền lương... Module này sẽ được dùng với module 
account cho các chức năng phân quyền và nhóm. Ví dụ một công ty sẽ được tổ chức theo các nhóm như employee,
employee/hr, employee/sale, employee/developer, mỗi nhóm sẽ có manager hay leader với quyền hành khác nhau.

###Warehouse Module###
Warehouse module dùng để quản lý xuất nhập hàng hóa.

###Service Module###  
Service module dùng để quản lý việc mua bán các dịch vụ. Khác với wahouse module, service không 
cần việc xuất nhập lưu kho mà thường chỉ quản lý các hợp đồng chi tiêu. Các dịch vụ như spa, phòng mạch, 
nha khoa, văn phòng luật dùng module này sẽ thích hợp hơn là module warehouse. Một doanh nghiệp bán hàng 
cũng có thể dùng module này để quản lý các dịch vụ như vận chuyển, thuê luật sư...

###Property Module###  
Property module dùng để quản lý mua sắm và khấu hao tài sản như kho bãi, văn phòng, 
thiết bị văn phòng...
  
###Customer Module###
Customer module dùng để quản lý thông tin và các activities của khách hàng, module này sẽ được sử 
dụng với module account cho các chức năng phân nhóm và phân quyền.

###SchoolModule###  
School Module dùng để quản lý các liên hệ giáo viên, học sinh, lớp học và bảng điểm.

##Các Khái Niệm Chính Trong Thiết Kế Và Tổ Chức Code##
------------------------------------------------------

###Webui And REST###

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

