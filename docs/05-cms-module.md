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
