#Account Module#
================

Account module được dùng để quản lý các tài khoản, phân nhóm và phân quyền, và các profile của một 
cá nhân(user) hay một tổ chức(organization hoặc company).

##Yêu Cầu Chung##
-----------------

###Account### 

* **Account** chỉ một tài khoản, một tài khoản có thể thuộc về một người hay một tổ chức. Chức năng chính của account là 
dùng để quản lý identity của một người, hay một tổ chức và việc đăng nhập hệ thống.
* Account phải có các thuộc tính căn bản là loginId, password, email, last login time, status
* Khi một account được khởi tạo, status của account được set là INIT và một email được gửi đi. Chủ tài khoản phải 
mở email, click lên đường link để kiểm chứng và kích hoạt tài khoản. Khi tài khoản được kích hoạt sẽ có trạng thái là
active
* Một tài khoản có thể chuyển sang trạng thái passive, người dùng lâu không sử dụng, hay baned do có các hành vi sử 
dụng trái phép.

 
###Acount Group###
* **Account Group** dùng để tổ chức phân chia nhóm cho các account. Account Group được tổ chức theo 
nhóm hình cây, một nhóm có một nhóm cha và nhiều nhóm con.

###Membership###

* **Membership** dùng để chỉ quyền của một account trong một nhóm ví dụ như quyền admin...

###User Profile###

* **User Profile** dùng để mô tả thông tin đầy đủ cho một account(tài khoản) loại cá nhân
 
* Các thông tin căn bản cho một user profile bao gồm tên, tuổi, ngày sinh, giới tính, contact

* Các profile đặc biệt có thể bao gồm các thông tin như quá trình học tập, làm việc, sinh sống 
của một cá nhân. 

* Cơ chế tự sinh mã đặc biệt cho một user, có nhiều chuẩn sinh mã mà user có thể tự chọn, 
mặc định tang từ 1 đến n như id (trong mục 2 trên tài liệu basic)

* Kết hợp với cms module, một profile có thể bao gồm cả CV, avatar...

* Kết hợp với cms module, người sử dụng cũng có thể lưu các thông tin preferences cho hệ thống 
như ngôn ngữ, các install module hay customization cho dashboard. 

###Organization Profile###

* **Organization Profile** dùng để mô tả thông tin đầy đủ cho một account loại tổ chức.

* Các thông tin căn bản cho một doanh nghiệp bao gồm ngày thành lập, địa chỉ, đại diện, 
lãnh vực , quy mô doanh nghiệp.

* Cần phân loại doanh nghiệp được quản lý và các doanh nghiệp khác không được 
quản lý(yêu cầu này có thê cân nhắc sử dụng với phân nhóm).

* Các doanh nghiệp được quản lý được phân theo logic cty mẹ con, quản lý được cả theo mô hình 
tập đoàn.

* Kết hợp với accounting module, mỗi doanh nghiệp có các tài khoản gắn liền với nó và 
phân quyền chỉ tác động đến các transactions thuộc doanh nghiệp đó. 

* Kết hợp với accounting module, quản lý lịch sử hình thành và vận hanh của doanh nghiệp theo 
thời gian, theo biến động sự kiện, theo doanh thu, lợi nhuận …

* 1 tài khoản cá nhân có thể tham gia nhiều doanh nghiệp

##Thiết Kế##
------------

Mô hình quan hệ cơ sở dữ liệu của account module dùng để quản lý việc đăng nhập và thiết lập 
nhóm cũng như phân quyền:

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
                           |          | UserProfile        |
                           |- 1 - 1 ->|--------------------|
                           |          | id                 |
                           |          | accountLoginId     |
                           |          |                    |
                           |          |____________________|
                           |           
                           |           
                           |          |--------------------|
                           |          | UserProfile        |
                           |- 1 - 1 ->|--------------------|
                                      | id                 |
                                      | accountLoginId     |
                                      |                    |
                                      |____________________|
                                      
                    
Quan hệ giữa Account và AccountGroup thông qua membership là quan hệ Many To Many

###Database Entity###
  
####Account Entity####

Bao gồm các thuộc tính
  
* id: là một số long number được sinh tự đông cho mỗi object. 
* accountLoginId: là một string bao gồm các ký tự letter, digit, '-' và '_'
  contact: là một array được tính toán và load từ Contact table dựa vào field accountLoginId ở bảng Contact
    
####AccountGroup Entity####

Được tổ chức theo dạng hình cây nên một group sẽ có parent group và children. AccountGroup bao gồm các 
thuộc tính
  
* id: là một số long number được sinh tự đông cho mỗi object.

* name: là một string là một string bao gồm các ký tự letter, digit, '-' và '_' 
đại diện cho một group.

* groupPath: là id string có cấu chúc parent-name/parent-name/name. Ví dụ group employee và 
employee/hr. group path tương đương với id của một group nhưng thiết kế để người dùng có 
thể đọc và hiểu cấu chúc của một group. Group path cũng được sử dụng để tối ưu cho các 
sql operation. 

* parentId:  tùy theo thiết kế có thể là parent path hoặc parent id.
    
####AccountMember Entity####

Dùng để kết nối một account với một group và quyền hạn của một account trong một group. AccountMember 
bao gồm các thuộc tính:

* id: là một số long number được sinh tự đông cho mỗi object.
* accountLoginId: là accountLoginId refer tới một account. 
* groupPath:      là group id refer tới một group.
* capability:     là quyện hạn của một account trong một group. Có 3 loại capability là READ, WRITE và ADMIN. 
READ chỉ cho phép một account xem các tài nguyên liên quan đến một nhóm. WRITE cho phép một account vừa 
xem vừa sửa đổi. ADMIN có cả quyền READ, WRITE và thêm quyền sửa quyền READ/WRITE của một account khác
trong cùng một nhóm.
  
####Contact Entity####

Dùng để lưu trữ các thông tin như tên, tuổi, địa chỉ, email, phone. Một account có thể có nhiều contact.

* id: là một số long number được sinh tự đông cho mỗi object.
* accountLoginId: là accountLoginId refer tới một account.
  
###Service###

####AccountService####

* getAccount(id): get the account object by id 
* getAccountDetail(id):  get the account detail object. AccountDetail object bao gồm các thành phần Account, Memberships và Contact
* deleteAccount(id): Hàm delete sẽ xóa account và các memberships
