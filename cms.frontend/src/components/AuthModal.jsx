import React, { useState } from 'react';
import authService from '../services/authService';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

    // Form inputs state
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });

    if (!isOpen) return null;

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleForgotPassword = () => {
        if (!loginData.email) {
            setMessage({ text: 'Vui lòng điền Email trước khi bấm Quên mật khẩu!', type: 'error' });
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setMessage({ text: `Yêu cầu đặt lại mật khẩu đã được gửi tới ${loginData.email}! Vui lòng kiểm tra hộp thư điện tử của bạn.`, type: 'success' });
            setLoading(false);
        }, 1000);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const result = await authService.login(loginData);
            setMessage({ text: result.message || 'Đăng nhập thành công!', type: 'success' });
            
            // Save token and user details to localStorage
            localStorage.setItem('customerToken', result.token);
            localStorage.setItem('customerId', result.customerId);
            localStorage.setItem('customerName', result.fullName);
            localStorage.setItem('customerEmail', result.email);
            localStorage.setItem('customerPhone', result.phone || '');
            localStorage.setItem('customerAddress', result.address || '');

            setTimeout(() => {
                onAuthSuccess(result.fullName);
                onClose();
            }, 1200);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
            setMessage({ text: errMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const result = await authService.register(registerData);
            setMessage({ text: result.message || 'Đăng ký thành công! Hãy đăng nhập.', type: 'success' });
            
            // Auto switch to login tab and prefill email
            setTimeout(() => {
                setLoginData({ email: registerData.email, password: '' });
                setIsLoginTab(true);
                setMessage({ text: 'Đăng ký thành công! Vui lòng nhập mật khẩu để đăng nhập.', type: 'success' });
            }, 1500);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Đăng ký thất bại. Email đã tồn tại hoặc dữ liệu không hợp lệ!';
            setMessage({ text: errMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="auth-close-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button 
                        className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
                        onClick={() => { setIsLoginTab(true); setMessage({ text: '', type: '' }); }}
                    >
                        Đăng Nhập
                    </button>
                    <button 
                        className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
                        onClick={() => { setIsLoginTab(false); setMessage({ text: '', type: '' }); }}
                    >
                        Đăng Ký
                    </button>
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`auth-alert ${message.type}`}>
                        {message.type === 'success' ? (
                            <i className="fa-solid fa-circle-check mr-2"></i>
                        ) : (
                            <i className="fa-solid fa-circle-exclamation mr-2"></i>
                        )}
                        {message.text}
                    </div>
                )}

                {/* Forms */}
                {isLoginTab ? (
                    <form onSubmit={handleLoginSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-envelope mr-1"></i> Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Nhập địa chỉ email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-lock mr-1"></i> Mật khẩu</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Nhập mật khẩu"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <button 
                                type="button" 
                                onClick={handleForgotPassword} 
                                style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang xử lý...</>
                            ) : (
                                'Đăng Nhập Ngay'
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="auth-form scrollable-form">
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-user mr-1"></i> Họ và Tên</label>
                            <input 
                                type="text" 
                                name="fullName" 
                                placeholder="Nhập họ và tên đầy đủ"
                                value={registerData.fullName}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-envelope mr-1"></i> Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="example@gmail.com"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-phone mr-1"></i> Số điện thoại</label>
                            <input 
                                type="text" 
                                name="phone" 
                                placeholder="Nhập số điện thoại"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-location-dot mr-1"></i> Địa chỉ</label>
                            <input 
                                type="text" 
                                name="address" 
                                placeholder="Nhập địa chỉ của bạn"
                                value={registerData.address}
                                onChange={handleRegisterChange}
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-lock mr-1"></i> Mật khẩu</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Tạo mật khẩu bảo mật"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang đăng ký...</>
                            ) : (
                                'Đăng Ký Tài Khoản'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
