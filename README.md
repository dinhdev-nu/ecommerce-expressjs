# ecommerce-shopbee

# timeline


## basic
1/ init project -> DONE
2/ connect dbs (mongodb) -> DONE
3.1/ Auth -> DONE
3.2/ Error, SUCCESS - RESPONSE Handle -> DONE
3.3/ Access & Shop -> DONE

#### **1. Product Management (Quan trọng nhất)**
- **Mục tiêu**: Quản lý sản phẩm là nền tảng của hệ thống ecommerce.
- Các chức năng cần làm:
  - Thêm/Sửa/Xóa sản phẩm.  -> DONE
  - Lấy danh sách sản phẩm. -> DONE
  - Tìm kiếm sản phẩm theo tên, danh mục, giá, v.v. -> DONE
  - Upload hình ảnh sản phẩm. (clouddinary, gg ...)
  - Bộ lọc sản phẩm. -> DONE

--- -> DONE 

#### **2. User Management (Auth)**
- **Mục tiêu**: Cần có người dùng để thực hiện các thao tác trong hệ thống.
- Các chức năng cần làm:
  - Đăng ký/Đăng nhập bằng email và mật khẩu.
  - Quản lý thông tin tài khoản (tên, email, địa chỉ).
  - Quên mật khẩu và đặt lại mật khẩu.
  - Vai trò (Customer, Admin).

---

#### **3. Cart Management**
- **Mục tiêu**: Xây dựng tính năng giỏ hàng để khách hàng có thể thêm sản phẩm và tính tổng tiền trước khi đặt hàng.
- Các chức năng cần làm:
  - Thêm sản phẩm vào giỏ hàng.
  - Xóa sản phẩm khỏi giỏ hàng.
  - Cập nhật số lượng sản phẩm.
  - Tính tổng tiền trong giỏ hàng.

---

#### **4. Order Management**
- **Mục tiêu**: Hỗ trợ khách hàng đặt hàng và theo dõi trạng thái đơn hàng.
- Các chức năng cần làm:
  - Đặt hàng từ giỏ hàng.
  - Lưu trạng thái đơn hàng (Pending, Processing, Shipped, Completed, Cancelled).
  - Lịch sử đơn hàng cho khách hàng.

---

#### **5. Payment Integration**
- **Mục tiêu**: Cần có tính năng thanh toán để đơn hàng được xác nhận.
- Các chức năng cần làm:
  - Tích hợp các cổng thanh toán (PayPal, Stripe, MoMo, COD).
  - Xử lý mã giảm giá khi thanh toán (nếu có).

---

#### **6. Review & Rating**
- **Mục tiêu**: Xây dựng sự tương tác và uy tín cho sản phẩm.
- Các chức năng cần làm:
  - Đánh giá và nhận xét sản phẩm.
  - Hiển thị đánh giá trung bình cho từng sản phẩm.
  - Báo cáo/Ẩn đánh giá không phù hợp.

---

#### **7. Wishlist**
- **Mục tiêu**: Tạo sự tiện lợi cho khách hàng khi muốn lưu các sản phẩm yêu thích.
- Các chức năng cần làm:
  - Thêm sản phẩm vào danh sách yêu thích.
  - Xóa sản phẩm khỏi danh sách yêu thích.
  - Xem danh sách yêu thích.

---

#### **8. Notification System**
- **Mục tiêu**: Cải thiện trải nghiệm người dùng qua việc gửi thông báo.
- Các chức năng cần làm:
  - Gửi email thông báo đơn hàng thành công.
  - Thông báo thay đổi trạng thái đơn hàng.

---

#### **9. Analytics & Admin Dashboard**
- **Mục tiêu**: Cung cấp dữ liệu và báo cáo để admin dễ dàng quản lý.
- Các chức năng cần làm:
  - Báo cáo doanh thu, số lượng đơn hàng.
  - Sản phẩm bán chạy nhất.
  - Tổng quan khách hàng (vùng địa lý, số lượng).
  - Hiển thị logs hoạt động của hệ thống.

---

#### **10. Multi-language Support**
- **Mục tiêu**: Tăng phạm vi tiếp cận khách hàng quốc tế.
- Các chức năng cần làm:
  - Hỗ trợ dịch UI và các thông báo hệ thống.
  - API trả dữ liệu tương ứng với ngôn ngữ khách hàng chọn.

---

#### **11. Shipping Management**
- **Mục tiêu**: Quản lý vận chuyển là một phần quan trọng trong hoàn thiện đơn hàng.
- Các chức năng cần làm:
  - Tính phí vận chuyển theo địa điểm hoặc trọng lượng.
  - Tích hợp API của các đơn vị vận chuyển (GHTK, GHN).

---

#### **12. Security & Optimization**
- **Mục tiêu**: Đảm bảo hệ thống an toàn và hiệu quả.
- Các chức năng cần làm:
  - Rate limiting và chống spam API.
  - Tối ưu cơ sở dữ liệu và truy vấn MongoDB.
  - Backup và phục hồi dữ liệu.
