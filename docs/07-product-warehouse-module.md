Warehouse Module
=================

Warehouse module được thiết kế để dùng quản lý việc xuất nhập hàng hóa. 

Thông tin hàng hóa (trong mục 6 trên tài liệu basic)

Mỗi hàng hóa có trong 1 hoặc nhiều hóa đơn mua bán (hiện chi tiết)
Mỗi hàng hóa có một số đặc điểm riêng
Mỗi hàng hóa có cách tính thuế riêng của nó
Có 3 loại hang hóa cần phân biệt:
Nguyên vật lieu: phục vụ quá trình chế biến sản xuất
Hàng mua về bán đi ngay
Thành phầm: do doanh nghiệp chế biến ra
hàng hóa được phần thành 2 loại: được lưu kho và không thể tồn kho (như món ăn làm ra phải bán đi ngày không để lại được)
hàng hóa được phân thành 2 loại: có bảo hành và không có bảo hành
Mỗi sản phẩm có 
danh sách các sản phẩm/dịch vụ bán kèm
danh sách các sản phẩm/dịch vụ phụ trợ/lien quan
Đơn vị sản phẩm (trong mục 1 trên tài liệu basic)
Mỗi sản phẩm có 1 đơn vị mặc đinh unit
Mỗi sản phẩm có thể có nhiều đơn vị (họp, thùng) có tỉ lệ quy đổi về đơn vị unit
Đơn vị gì do user tự nhập tự quy định
Nhóm hàng hóa: (trong mục 6 trên tài liệu basic)
Độc lập với payment (thực tế trả trước trả sau khi có invoice đều có cả)
có group và subgroup; 
Mỗi group có đặc điểm riêng cua nó
một hàng hóa có thể thuộc nhiều nhóm; hàng hóa nhóm nào thì có mọi đặc tính của nhóm đó cộng với đặc tình riêng của nó
Kho hàng: 1 cty có thể có nhiều kho
Lô hàng nhập: chỉ với loại tồn kho (trong mục 11 trên tài liệu basic)
Độc lập với payment (thực tế trả trước trả sau khi có invoice đều có cả)
Một lô hàng có thể đến từ nhiều hóa đơn mua hoặc không từ hóa đơn nào có (xử lý dư thừa chênh lêch thực tế)
Một lô hàng có thể được phân bổ về nhiều kho
Ngày sản xuất; ngày hết hạn sử dụng; nhà cung ứng …
Thông tin bảo hành của nhà cung cấp
Lô hàng xuất: chỉ với loại tồn kho (trong mục 11 trên tài liệu basic)
Một lô hàng xuất phải bắt đầu từ một hoặc nhiều lô hàng nhập
Một lo xuất không thể xuất từ nhiều kho; mỗi kho xuất có lô xuất riêng
Một lô hàng xuất có thể đến từ nhiều hóa đơn bán hoặc không từ hóa đơn nào có (xử lý hư hỏng)
Cơ chế xuất: có nhiều cách (nhập trước xuất trước, gần hạn xuất trước) user tự chọn
Bảo hành đối với khách hàng với từng đơn vị sản phẩm có bảo hành (khách mua, ngày mua, ngày bảo hành …)

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
      |Warehouse      |           |InInventory        |           |OutInventory       |
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

