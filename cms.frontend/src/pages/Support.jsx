import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Support = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('guides');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
    window.scrollTo(0, 0);
  }, [location]);

  const tabs = [
    { id: 'guides', label: 'Hướng dẫn mua hàng', icon: 'fa-solid fa-cart-shopping' },
    { id: 'warranty', label: 'Chính sách bảo hành', icon: 'fa-solid fa-shield-halved' },
    { id: 'returns', label: 'Đổi trả trong 30 ngày', icon: 'fa-solid fa-rotate-left' },
    { id: 'privacy', label: 'Chính sách bảo mật', icon: 'fa-solid fa-user-lock' }
  ];

  return (
    <div className="support-page-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Page Header */}
      <div 
        className="support-header text-center" 
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#ffffff',
          padding: '3rem 2rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Trung tâm hỗ trợ NaUCMS.TechGear
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: '#ffffff' }}>
          Trung Tâm Hỗ Trợ & Chính Sách
        </h1>
        <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #6366f1, #d946ef)', margin: '1rem auto 0 auto', borderRadius: '2px' }}></div>
      </div>

      {/* Main Grid Layout */}
      <div className="row g-4">
        {/* Sidebar Selector */}
        <div className="col-md-4">
          <div 
            className="card border-0 shadow-sm" 
            style={{ borderRadius: '20px', padding: '15px', background: '#ffffff', position: 'sticky', top: '100px' }}
          >
            <div className="list-group list-group-flush">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3 px-4 ${activeTab === tab.id ? 'active-tab-custom' : ''}`}
                  style={{
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #d946ef)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#4b5563',
                    marginBottom: '8px'
                  }}
                >
                  <i className={tab.icon} style={{ fontSize: '1.1rem', width: '20px', textAlign: 'center' }}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic content screen */}
        <div className="col-md-8">
          <div 
            className="card border-0 shadow-sm" 
            style={{ borderRadius: '20px', padding: '2.5rem', background: '#ffffff', minHeight: '400px' }}
          >
            {activeTab === 'guides' && (
              <div>
                <h3 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                  <i className="fa-solid fa-cart-shopping text-primary me-2"></i> Hướng Dẫn Mua Hàng Trực Tuyến
                </h3>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                  Tại NaUCMS.TechGear, việc sở hữu các sản phẩm công nghệ cao cấp trở nên dễ dàng và nhanh chóng hơn bao giờ hết chỉ với 4 bước đơn giản:
                </p>
                <div className="mt-4">
                  <div className="d-flex gap-3 mb-4">
                    <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>1</span>
                    <div>
                      <h5 style={{ fontWeight: '700', color: '#1e293b' }}>Tìm kiếm & Lựa chọn Sản phẩm</h5>
                      <p className="text-muted">Sử dụng thanh tìm kiếm hoặc duyệt qua menu ngành hàng để xem chi tiết thông số kỹ thuật, giá khuyến mãi và trạng thái tồn kho của sản phẩm mong muốn.</p>
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-4">
                    <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>2</span>
                    <div>
                      <h5 style={{ fontWeight: '700', color: '#1e293b' }}>Thêm vào giỏ hàng & Điều chỉnh số lượng</h5>
                      <p className="text-muted">Nhấp chọn số lượng cần mua (hệ thống sẽ tự động đối chiếu không vượt quá số lượng hàng tồn sẵn trong kho) và bấm "Thêm giỏ" hoặc chọn "Mua ngay" để sang thẳng bước tiếp theo.</p>
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-4">
                    <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>3</span>
                    <div>
                      <h5 style={{ fontWeight: '700', color: '#1e293b' }}>Tiến hành Thanh toán & Đặt hàng</h5>
                      <p className="text-muted">Điền chính xác thông tin giao hàng gồm Họ tên, Số điện thoại, Địa chỉ nhận hàng và tiến hành hoàn tất Đặt hàng trực tuyến.</p>
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>4</span>
                    <div>
                      <h5 style={{ fontWeight: '700', color: '#1e293b' }}>Xác nhận và Nhận Email thông báo</h5>
                      <p className="text-muted">Sau khi đặt đơn hàng thành công, hệ thống máy chủ sẽ ngay lập tức gửi một thư điện tử (Email) xác nhận chi tiết đơn hàng đến hòm thư đăng ký của quý khách.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div>
                <h3 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                  <i className="fa-solid fa-shield-halved text-success me-2"></i> Chính Sách Bảo Hành Chính Hãng
                </h3>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                  NaUCMS.TechGear cam kết mang lại sự an tâm tuyệt đối cho quý khách hàng bằng chính sách bảo hành tiêu chuẩn quốc tế:
                </p>
                <table className="table table-bordered mt-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ fontWeight: '700' }}>Nhóm sản phẩm</th>
                      <th style={{ fontWeight: '700' }}>Thời hạn bảo hành</th>
                      <th style={{ fontWeight: '700' }}>Hình thức áp dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Điện thoại di động & Máy tính bảng</td>
                      <td>12 Tháng</td>
                      <td>Bảo hành chính hãng tại TTBH ủy quyền</td>
                    </tr>
                    <tr>
                      <td>Laptop & Thiết bị tin học</td>
                      <td>24 Tháng</td>
                      <td>Bảo hành phần cứng toàn diện</td>
                    </tr>
                    <tr>
                      <td>Tay cầm chơi game & Phụ kiện kỹ thuật số</td>
                      <td>12 Tháng</td>
                      <td>1-đổi-1 nếu lỗi nhà sản xuất</td>
                    </tr>
                  </tbody>
                </table>
                <h5 className="mt-4" style={{ fontWeight: '700', color: '#1e293b' }}>Điều kiện được bảo hành miễn phí:</h5>
                <ul className="text-muted ps-3" style={{ lineHeight: '1.8' }}>
                  <li>Sản phẩm còn trong thời hạn bảo hành của hãng tính từ ngày mua hàng.</li>
                  <li>Sản phẩm không có dấu hiệu va đập, nứt vỡ, rơi nước hoặc can thiệp sửa chữa ngoài.</li>
                  <li>Tem bảo hành và mã số định danh thiết bị (IMEI/Serial Number) còn nguyên vẹn, không mờ xước.</li>
                </ul>
              </div>
            )}

            {activeTab === 'returns' && (
              <div>
                <h3 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                  <i className="fa-solid fa-rotate-left text-warning me-2"></i> Chính Sách Đổi Trả Độc Quyền Trong 30 Ngày
                </h3>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                  Nếu sản phẩm phát sinh bất kỳ lỗi kỹ thuật nào từ nhà sản xuất trong vòng **30 ngày đầu tiên** sử dụng, quý khách được quyền đổi trả hàng hoàn toàn miễn phí.
                </p>
                <div className="card p-3 border-0 mt-4" style={{ background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '10px' }}>
                  <h6 style={{ fontWeight: '700', color: '#b45309' }}><i className="fa-solid fa-triangle-exclamation"></i> Quy trình đổi trả nhanh gọn:</h6>
                  <p className="text-muted mb-0 small" style={{ lineHeight: '1.6' }}>
                    1. Khách hàng liên hệ hotline 0973 651 140 hoặc mang máy đến cửa hàng gần nhất.<br/>
                    2. Chuyên viên kỹ thuật thẩm định nhanh lỗi sản phẩm trong vòng 30 phút.<br/>
                    3. Tiến hành đổi ngay thiết bị mới nguyên seal tương đương cho khách hàng.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h3 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                  <i className="fa-solid fa-user-lock text-info me-2"></i> Chính Sách Bảo Mật Thông Tin
                </h3>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                  NaUCMS.TechGear tôn trọng quyền riêng tư của quý khách hàng và bảo mật dữ liệu tuyệt đối theo quy chuẩn quốc tế:
                </p>
                <h5 className="mt-4" style={{ fontWeight: '700', color: '#1e293b' }}>1. Dữ liệu chúng tôi thu thập:</h5>
                <p className="text-muted">Chỉ bao gồm các thông tin cần thiết phục vụ cho việc gửi hàng và gửi hóa đơn xác nhận đơn hàng như: Họ tên, Số điện thoại, Địa chỉ giao nhận, và Email liên hệ.</p>
                
                <h5 className="mt-4" style={{ fontWeight: '700', color: '#1e293b' }}>2. Cam kết bảo mật tuyệt đối:</h5>
                <p className="text-muted">Hệ thống áp dụng công nghệ mã hóa truyền tin SSL/TLS giúp thông tin tài khoản của quý khách không bị lộ lọt. Chúng tôi cam kết không mua bán, không trao đổi thông tin khách hàng cho bất cứ bên thứ ba nào ngoại trừ các đơn vị logistics đối tác (Giao Hàng Nhanh, Viettel Post) để giao nhận hàng hóa.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
