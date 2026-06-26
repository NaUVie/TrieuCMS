import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import customerService from '../services/customerService';

const Profile = ({ onOpenAuth, onProfileUpdate, onLogout }) => {
    const navigate = useNavigate();
    const [subTab, setSubTab] = useState('info'); // 'info' | 'security'
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' }); // success or error
    
    // User credentials from local storage
    const customerId = localStorage.getItem('customerId');
    const isLoggedIn = !!customerId;

    // Vietnam open-api provinces states
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [useDropdownAddress, setUseDropdownAddress] = useState(false);
    const [selectedProv, setSelectedProv] = useState('');
    const [selectedDist, setSelectedDist] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [street, setStreet] = useState('');

    // Form inputs state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // To restore original data if user cancels editing
    const [originalData, setOriginalData] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    // Fetch Provinces list once on component load
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/p/');
                if (res.ok) {
                    const data = await res.json();
                    setProvinces(data);
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách tỉnh thành:", err);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch Districts when Province changes
    useEffect(() => {
        if (!selectedProv) {
            setDistricts([]);
            setWards([]);
            setSelectedDist('');
            setSelectedWard('');
            return;
        }
        const fetchDistricts = async () => {
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProv}?depth=2`);
                if (res.ok) {
                    const data = await res.json();
                    setDistricts(data.districts || []);
                    setSelectedDist('');
                    setWards([]);
                    setSelectedWard('');
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách quận huyện:", err);
            }
        };
        fetchDistricts();
    }, [selectedProv]);

    // Fetch Wards when District changes
    useEffect(() => {
        if (!selectedDist) {
            setWards([]);
            setSelectedWard('');
            return;
        }
        const fetchWards = async () => {
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/d/${selectedDist}?depth=2`);
                if (res.ok) {
                    const data = await res.json();
                    setWards(data.wards || []);
                    setSelectedWard('');
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách phường xã:", err);
            }
        };
        fetchWards();
    }, [selectedDist]);

    // Sync generated dropdown address with formData address field
    useEffect(() => {
        if (!useDropdownAddress) return;

        const provObj = provinces.find(p => p.code === parseInt(selectedProv));
        const distObj = districts.find(d => d.code === parseInt(selectedDist));
        const wardObj = wards.find(w => w.code === parseInt(selectedWard));

        const provName = provObj ? provObj.name : '';
        const distName = distObj ? distObj.name : '';
        const wardName = wardObj ? wardObj.name : '';

        const parts = [];
        if (street.trim()) parts.push(street.trim());
        if (wardName) parts.push(wardName);
        if (distName) parts.push(distName);
        if (provName) parts.push(provName);

        const fullAddr = parts.join(', ');
        setFormData(prev => ({ ...prev, address: fullAddr }));
    }, [selectedProv, selectedDist, selectedWard, street, useDropdownAddress, provinces, districts, wards]);

    useEffect(() => {
        if (!isLoggedIn) {
            setFetching(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const profile = await customerService.getProfile(customerId);
                const data = {
                    fullName: profile.fullName || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
                setFormData(data);
                setOriginalData({
                    fullName: profile.fullName || '',
                    phone: profile.phone || '',
                    address: profile.address || ''
                });
            } catch (error) {
                console.error("Lỗi khi tải thông tin cá nhân:", error);
                setMessage({ text: 'Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.', type: 'error' });
            } finally {
                setFetching(false);
            }
        };

        loadProfile();
    }, [customerId, isLoggedIn]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancelEdit = () => {
        setFormData(prev => ({
            ...prev,
            fullName: originalData.fullName,
            phone: originalData.phone,
            address: originalData.address
        }));
        setUseDropdownAddress(false);
        setSelectedProv('');
        setSelectedDist('');
        setSelectedWard('');
        setStreet('');
        setIsEditingInfo(false);
        setMessage({ text: '', type: '' });
    };

    const handleUpdateInfoSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!formData.fullName.trim()) {
            setMessage({ text: 'Họ và tên không được để trống.', type: 'error' });
            return;
        }

        if (formData.phone) {
            const phoneRegex = /^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/;
            if (!phoneRegex.test(formData.phone)) {
                setMessage({ text: 'Số điện thoại không đúng định dạng Việt Nam (10 số, ví dụ: 0912345678)!', type: 'error' });
                return;
            }
        }

        setLoading(true);
        try {
            const updatePayload = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                oldPassword: null,
                newPassword: null
            };

            const result = await customerService.updateProfile(customerId, updatePayload);
            
            // Save updated info in localStorage
            localStorage.setItem('customerName', result.customer.fullName);
            localStorage.setItem('customerPhone', result.customer.phone || '');
            localStorage.setItem('customerAddress', result.customer.address || '');

            // Notify parent App component to update state immediately
            if (onProfileUpdate) {
                onProfileUpdate(result.customer.fullName);
            }

            setOriginalData({
                fullName: result.customer.fullName || '',
                phone: result.customer.phone || '',
                address: result.customer.address || ''
            });

            setMessage({ text: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
            setUseDropdownAddress(false);
            setIsEditingInfo(false);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Có lỗi xảy ra trong quá trình cập nhật.';
            setMessage({ text: errMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!formData.oldPassword) {
            setMessage({ text: 'Vui lòng nhập mật khẩu cũ để xác thực.', type: 'error' });
            return;
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
            setMessage({ text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.', type: 'error' });
            return;
        }
        if (formData.newPassword === formData.oldPassword) {
            setMessage({ text: 'Mật khẩu mới không được trùng với mật khẩu cũ.', type: 'error' });
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ text: 'Mật khẩu xác nhận không khớp.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const updatePayload = {
                fullName: originalData.fullName,
                phone: originalData.phone,
                address: originalData.address,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            };

            await customerService.updateProfile(customerId, updatePayload);
            
            setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.';
            setMessage({ text: errMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="loading-spinner" style={{ minHeight: '400px' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x text-primary"></i>
                <span className="text-muted fw-semibold">Đang tải thông tin tài khoản...</span>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ maxWidth: '600px', margin: '4rem auto' }}>
                <div className="card border-0 shadow-lg text-center p-5" style={{ borderRadius: '24px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
                    <div style={{ fontSize: '4.5rem', background: 'linear-gradient(135deg, #4f46e5, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem' }}>
                        <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <h3 className="fw-bold mb-3" style={{ color: '#1e1b4b' }}>Yêu Cầu Đăng Nhập</h3>
                    <p className="text-muted mb-4">Bạn cần đăng nhập tài khoản để truy cập trang quản lý thông tin khách hàng.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-primary px-4 py-2 fw-semibold" onClick={onOpenAuth} style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #4f46e5, #db2777)', border: 'none', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' }}>
                            Đăng Nhập Ngay
                        </button>
                        <button className="btn btn-outline-secondary px-4 py-2 fw-semibold" onClick={() => navigate('/')} style={{ borderRadius: '15px' }}>
                            Về Trang Chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '850px', margin: '2rem auto' }}>
            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)' }}>
                <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h3 className="fw-bold" style={{ color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <i className="fa-solid fa-circle-user" style={{ color: '#4f46e5' }}></i>
                            Tài Khoản Của Tôi
                        </h3>
                        <p className="text-muted mb-0 mt-1">Xem, cập nhật thông tin cá nhân và thiết lập bảo mật.</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {/* View My Orders Link Button */}
                        <Link 
                            to="/my-orders" 
                            className="btn btn-primary d-flex align-items-center gap-2"
                            style={{ 
                                borderRadius: '12px', 
                                padding: '10px 16px', 
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #4f46e5, #db2777)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                                fontSize: '0.9rem'
                            }}
                        >
                            <i className="fa-solid fa-clipboard-list"></i> Đơn hàng của tôi
                        </Link>
                        {/* Logout Button */}
                        <button 
                            type="button"
                            onClick={onLogout} 
                            className="btn btn-outline-danger d-flex align-items-center gap-2"
                            style={{ 
                                borderRadius: '12px', 
                                padding: '10px 16px', 
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                        </button>
                    </div>
                </div>
                
                <div className="card-body p-4">
                    {/* Tabs */}
                    <div className="d-flex border-bottom mb-4" style={{ gap: '15px' }}>
                        <button
                            type="button"
                            className="btn pb-3 px-3 fw-bold"
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                borderBottom: subTab === 'info' ? '3px solid #4f46e5' : '3px solid transparent',
                                color: subTab === 'info' ? '#4f46e5' : '#6b7280',
                                borderRadius: '0',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => { setSubTab('info'); setMessage({ text: '', type: '' }); }}
                        >
                            <i className="fa-solid fa-user-gear me-2"></i> Thông Tin Cá Nhân
                        </button>
                        <button
                            type="button"
                            className="btn pb-3 px-3 fw-bold"
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                borderBottom: subTab === 'security' ? '3px solid #4f46e5' : '3px solid transparent',
                                color: subTab === 'security' ? '#4f46e5' : '#6b7280',
                                borderRadius: '0',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => { setSubTab('security'); setMessage({ text: '', type: '' }); }}
                        >
                            <i className="fa-solid fa-shield-halved me-2"></i> Bảo Mật & Đổi Mật Khẩu
                        </button>
                    </div>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`} style={{ borderRadius: '16px', gap: '10px' }}>
                            {message.type === 'success' ? (
                                <i className="fa-solid fa-circle-check fs-5"></i>
                            ) : (
                                <i className="fa-solid fa-circle-exclamation fs-5"></i>
                            )}
                            <span className="fw-semibold">{message.text}</span>
                        </div>
                    )}

                    {/* Personal Info Tab */}
                    {subTab === 'info' && (
                        <form onSubmit={handleUpdateInfoSubmit}>
                            <div className="row g-4">
                                {/* Họ và tên */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold"><i className="fa-solid fa-user me-2 text-muted"></i> Họ và Tên</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className={`form-control ${!isEditingInfo ? 'bg-light text-muted' : ''}`}
                                        placeholder="Nhập họ và tên đầy đủ"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                        readOnly={!isEditingInfo}
                                        required
                                    />
                                </div>

                                {/* Email (Always Readonly) */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">
                                        <i className="fa-solid fa-envelope me-2 text-muted"></i> Địa Chỉ Email
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control bg-light text-muted"
                                            value={formData.email}
                                            style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)', cursor: 'not-allowed' }}
                                            readOnly
                                        />
                                        <span className="input-group-text bg-white" style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.12)', borderLeft: 'none' }}>
                                            <span className="badge bg-secondary" style={{ fontSize: '0.75rem', borderRadius: '8px' }}>
                                                <i className="fa-solid fa-lock me-1"></i> Cố định
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Số điện thoại */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold"><i className="fa-solid fa-phone me-2 text-muted"></i> Số Điện Thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className={`form-control ${!isEditingInfo ? 'bg-light text-muted' : ''}`}
                                        placeholder="Nhập số điện thoại của bạn"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                        readOnly={!isEditingInfo}
                                    />
                                </div>

                                {/* Địa chỉ */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold"><i className="fa-solid fa-location-dot me-2 text-muted"></i> Địa Chỉ Giao Hàng</label>
                                    
                                    {!useDropdownAddress ? (
                                        <input
                                            type="text"
                                            name="address"
                                            className={`form-control ${!isEditingInfo ? 'bg-light text-muted' : ''}`}
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                            value={formData.address}
                                            onChange={handleChange}
                                            style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                            readOnly={!isEditingInfo}
                                            required
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="street"
                                            className="form-control"
                                            placeholder="Số nhà, số căn hộ, tên đường..."
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                            required
                                        />
                                    )}

                                    {isEditingInfo && (
                                        <div className="form-check mt-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="useDropdownAddress" 
                                                checked={useDropdownAddress}
                                                onChange={(e) => {
                                                    setUseDropdownAddress(e.target.checked);
                                                    if (!e.target.checked) {
                                                        // Reset dropdown selection states
                                                        setSelectedProv('');
                                                        setSelectedDist('');
                                                        setSelectedWard('');
                                                        setStreet('');
                                                        setFormData(prev => ({ ...prev, address: originalData.address }));
                                                    }
                                                }}
                                            />
                                            <label className="form-check-label small fw-semibold text-muted" htmlFor="useDropdownAddress" style={{ cursor: 'pointer' }}>
                                                Chọn địa chỉ từ danh sách Tỉnh/Quận/Xã (Bộ lọc tự động)
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Vietnam Provinces Dropdowns Section */}
                                {useDropdownAddress && isEditingInfo && (
                                    <div className="col-md-12 bg-light p-3 rounded-4 border mt-3 mb-2" style={{ borderStyle: 'dashed !important' }}>
                                        <span className="badge bg-primary mb-3" style={{ fontSize: '0.8rem' }}><i className="fa-solid fa-map-location-dot me-1"></i> Định vị địa lý</span>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-slate">Tỉnh / Thành phố *</label>
                                                <select 
                                                    className="form-select" 
                                                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                                                    value={selectedProv}
                                                    onChange={(e) => setSelectedProv(e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Chọn Tỉnh / Thành phố --</option>
                                                    {provinces.map(p => (
                                                        <option key={p.code} value={p.code}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-slate">Quận / Huyện *</label>
                                                <select 
                                                    className="form-select" 
                                                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                                                    value={selectedDist}
                                                    onChange={(e) => setSelectedDist(e.target.value)}
                                                    disabled={!selectedProv}
                                                    required
                                                >
                                                    <option value="">-- Chọn Quận / Huyện --</option>
                                                    {districts.map(d => (
                                                        <option key={d.code} value={d.code}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-slate">Phường / Xã *</label>
                                                <select 
                                                    className="form-select" 
                                                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                                                    value={selectedWard}
                                                    onChange={(e) => setSelectedWard(e.target.value)}
                                                    disabled={!selectedDist}
                                                    required
                                                >
                                                    <option value="">-- Chọn Phường / Xã --</option>
                                                    {wards.map(w => (
                                                        <option key={w.code} value={w.code}>{w.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {formData.address && (
                                            <div className="mt-3 text-muted small">
                                                <strong>Địa chỉ tạo ra:</strong> <span className="text-dark fw-semibold">{formData.address}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons for Info editing */}
                            <div className="d-flex justify-content-end gap-3 mt-5">
                                {!isEditingInfo ? (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary px-4 py-2.5 fw-semibold d-flex align-items-center gap-2"
                                        onClick={() => setIsEditingInfo(true)}
                                        style={{ borderRadius: '12px', borderWidth: '2px' }}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                        Chỉnh Sửa Thông Tin
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-4 py-2.5 fw-semibold"
                                            onClick={handleCancelEdit}
                                            style={{ borderRadius: '12px' }}
                                        >
                                            Hủy Bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-5 py-2.5 fw-semibold d-flex align-items-center gap-2"
                                            disabled={loading}
                                            style={{
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #4f46e5, #db2777)',
                                                border: 'none',
                                                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                    Đang Lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-floppy-disk"></i>
                                                    Lưu Thay Đổi
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Security Tab */}
                    {subTab === 'security' && (
                        <form onSubmit={handleUpdatePasswordSubmit}>
                            <h5 className="fw-bold mb-3" style={{ color: '#1e1b4b' }}>
                                <i className="fa-solid fa-key me-2 text-muted"></i> Đổi Mật Khẩu Đăng Nhập
                            </h5>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', marginTop: '-10px' }}>
                                Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh bao gồm chữ cái, chữ số và ký tự đặc biệt.
                            </p>

                            <div className="row g-4">
                                {/* Mật khẩu cũ */}
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Mật Khẩu Hiện Tại (Mật khẩu cũ)</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu hiện tại của bạn"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                        style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                        required
                                    />
                                </div>

                                {/* Mật khẩu mới */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Mật Khẩu Mới</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        className="form-control"
                                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                        required
                                    />
                                </div>

                                {/* Xác nhận mật khẩu mới */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Xác Nhận Mật Khẩu Mới</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        style={{ borderRadius: '12px', padding: '10px 15px', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Action buttons for Security update */}
                            <div className="d-flex justify-content-end gap-3 mt-5">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4 py-2.5 fw-semibold"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            oldPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        }));
                                        setMessage({ text: '', type: '' });
                                    }}
                                    style={{ borderRadius: '12px' }}
                                >
                                    Làm Mới Nhập liệu
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary px-5 py-2.5 fw-semibold d-flex align-items-center gap-2"
                                    disabled={loading}
                                    style={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4f46e5, #db2777)',
                                        border: 'none',
                                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                            Đang Cập Nhật...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-shield-halved"></i>
                                            Cập Nhật Mật Khẩu
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
