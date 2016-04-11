HR Module
=========
    
Yêu cầu Chung
-------------

###Employee###

* **Employee** là một cá nhân(nhân viên) làm việc cho một tổ chức. 

###Salary And Payment

* Nhân viên được nhận làm việc với mức lương theo từng chu kỳ hàng quý hàng năm. 
* Lương được trả cho nhân viên theo tuần, theo tháng.
* Ngoài lương nhân viên còn được nhận các khoản thưởng, trợ cấp, hoặc bị phạt nếu vi phạm các quy định hay gây thiệt hại.


1 phòng ban có thể có nhiều phong ban con hay trực thuộc
Vị trí làm việc trong phòng ban: user tự tạo danh sách các vị trí có thẻ và chọn các ví trị tương thích cho môi phòng ban

Mỗi phòng ban có các tài khoản gắn liền với nó và phân quyền chỉ tác động đến các transactions thuộc phòng ban đó và 
các phòng ban con của nó; 1 user có thể tham gia nhiều phòng ban


Dự án Project: hiện nay có nhiều doanh nghiệp vận hành theo mô hình quản lý dự án, tức tách quản lý từng dự án độc lập 
trong 1 khoảng thời gian (trong mục 5 trên tài liệu basic)

Chỉ gắn với 1 cty được quản lý; có thể thuộc 1 phòng ban hoặc trực thuộc thẳng doanh nghiệp
1 dự án có thể có nhiều dự án con hay trực thuộc

Vị trí trong dự án: user tự tạo danh sách các vị trí có thẻ và chọn các ví trị tương thích cho môi dự án

Các vị trí trong dự án được phân bổ theo tầm quan trọng gọi là % đòng góp của mỗi thành viên (có nhiều cách phân bổ mà 
user có thể chọn cho mỗi dự án; tỏng % có thể cố định là 100% hoặc tự do)

Các dự án có thể độc lập; hoặc quan hệ với nhau dạng processes xong một hoặc nhiều dự án này mới đến một hoặc nhiều dự 
án kia hoặc xong dự án này có điều kiện mới bắt đầu làm dự án kia

Mỗi dự án có các tài khoản gắn liền với nó và phân quyền chỉ tác động đến các transactions thuộc dự án đó và các dự án 
con của nó; 1 user có thể tham gia nhiều phòng ban và dự án

employee/developer, mỗi nhóm sẽ có manager hay leader với quyền hành khác nhau. (trong mục 4 trên tài liệu basic)

Hợp đồng: cá nhân trở thành nhân viên của 1 cty quản lý trong database khi có hợp đồng với cty đó
Có nhiều loại hợp động: full, part, seasonal
Có các thông tin về lương và cách tính lương theo giờ, ngày, tháng…

1 cá nhân có thể có hợp đồng với nhiều cty; tức là nhân viên của nhiều cty
1 nhân viên lại có thể có nhiều hợp đồng với 1 cty; mỗi hợp đồng có thời hạn khác nhau; có một hoặc nhiều vị trí làm việc khác nhau (1 người có thể kiêm nhiệm nhiều vị trí)
1 nhân viên có thể ký trước hợp đồng mới, trong khi hợp động hiện tại vẫn có hiệu lực, đến ngày activate của hợp đồng mới lúc đó sẽ mới chuyển áp dụng hợp đồng mới
Các hợp đồng của 1 cá nhân sẽ tự được cập nhật vào CV của họ + với các thông tin trong CV mà user tự nhập vào


1. Liên hệ giữa nhân viên và Salary là One to Many. Một nhân viên có thể có nhiều salary entry theo 
thời gian như mỗi lần lên lương, lên chức... nhân viên sẽ có các mức lương, thuế thay đổi.
2. Liên hệ giữa Salary và Salary Payment là One To Many. Mỗi một nhân viên sẽ có một mức lương theo
chu kỳ và được trả theo tuần , theo tháng...
3. Nói chuyện với Tú về các yêu cầu của các bảng và các trường và các yêu cầu khác.
4. Trước mắt dựng các Entity căn bản, các Repository tương ứng với các Entity. Dựng các service như 
EmployeeService, SalaryService và các hàm cơ bản như xóa một employee sẽ phải xóa các salary và salary
 payment.



    |----------------|             |-----------------|              |------------------|
    | Employee       |             | Salary          |              | Salary Payment   |
    |----------------|             |-----------------|              |------------------|
    | accountLoginId |             | accountLoginId  |-- 1 - M -->  | accountLoginId   |
    |                |-- 1 - M --> |                 |              | salaryId         |
    |----------------|             |_________________|              |__________________|

