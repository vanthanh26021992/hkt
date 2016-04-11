#Accounting Module#
===================

Accounting module dùng để quản lý chi tiêu của một doanh nghiệp. Accounting module được 
thiết kế để hoạt động độc lập hoặc liên kết với các module khác của doanh nghiệp như quản 
lý tiền lương mua hoặc bán hàng hóa. 

##Yêu Cầu##
------------

Invoice module dùng để quản lý các thong tin nghiệp vụ phát sinh, quản lý dòng tiền 
(trong mục 9 trên tài liệu basic). Một hóa đơn có thể có sản phẩm/dịch vụ/ tài sản. 
Với khách hàng/nhà cung ứng hoặc không (một phiếu thu chi như thất thoát tiền, lãi tiền gửi ngân hàng)

Trả lương, thưởng cũng là 1 hóa đơn (để tập trung quản lý dòng tiền về một mối)
Một hóa đơn có thể gắn trực tiếp với 1 doanh nghiệp; 1 phòng ban, 1 dự án, 1 nhân viên
Có 2 loại cơ bản là: mua, bán, và nội bộ
Mỗi loại trên có thể được phân làm nhiều loại khác nhau (user tự thêm; xem version hiện tại)
Một hóa đơn có 1 hoặc nhiều payments ở các thời điểm khác nhau


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


