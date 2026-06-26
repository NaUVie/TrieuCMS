import React, { useState } from 'react';
import authService from '../services/authService';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
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
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetData, setResetData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (!isOpen) return null;

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleResetChange = (e) => {
        setResetData({ ...resetData, [e.target.name]: e.target.value });
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            setMessage({ text: 'Vui lòng điền Email trước khi bấm Quên mật khẩu!', type: 'error' });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const result = await authService.forgotPassword(forgotEmail);
            setMessage({ text: result.message || 'Mã OTP đã được gửi tới Email của bạn.', type: 'success' });
            setResetData((prev) => ({ ...prev, email: forgotEmail }));
            setTimeout(() => {
                setView('reset');
                setMessage({ text: 'Vui lòng nhập mã OTP và mật khẩu mới.', type: 'success' });
            }, 1200);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra lại Email.';
            setMessage({ text: errMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (resetData.newPassword !== resetData.confirmPassword) {
            setMessage({ text: 'Mật khẩu mới và xác nhận mật khẩu không khớp!', type: 'error' });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const result = await authService.resetPassword({
                email: resetData.email,
                otp: resetData.otp,
                newPassword: resetData.newPassword
            });
            setMessage({ text: result.message || 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.', type: 'success' });
            setTimeout(() => {
                setView('login');
                setLoginData({ email: resetData.email, password: '' });
                setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
                setMessage({ text: 'Vui lòng nhập mật khẩu mới của bạn để đăng nhập.', type: 'success' });
            }, 1500);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP.';
            setMessage({ text: errMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
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
                setView('login');
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

                {/* Tabs / Headers depending on View */}
                {['login', 'register'].includes(view) && (
                    <div className="auth-tabs">
                        <button 
                            className={`auth-tab-btn ${view === 'login' ? 'active' : ''}`}
                            onClick={() => { setView('login'); setMessage({ text: '', type: '' }); }}
                        >
                            Đăng Nhập
                        </button>
                        <button 
                            className={`auth-tab-btn ${view === 'register' ? 'active' : ''}`}
                            onClick={() => { setView('register'); setMessage({ text: '', type: '' }); }}
                        >
                            Đăng Ký
                        </button>
                    </div>
                )}

                {view === 'forgot' && (
                    <div className="auth-tabs">
                        <span className="auth-tab-btn active" style={{ cursor: 'default', width: '100%', textAlign: 'center' }}>
                            Quên Mật Khẩu
                        </span>
                    </div>
                )}

                {view === 'reset' && (
                    <div className="auth-tabs">
                        <span className="auth-tab-btn active" style={{ cursor: 'default', width: '100%', textAlign: 'center' }}>
                            Đặt Lại Mật Khẩu
                        </span>
                    </div>
                )}

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

                {/* Login View */}
                {view === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="auth-form" autoComplete="off">
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-envelope mr-1"></i> Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Nhập địa chỉ email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                autoComplete="off"
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
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setForgotEmail(loginData.email);
                                    setView('forgot');
                                    setMessage({ text: '', type: '' });
                                }} 
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
                )}

                {/* Register View */}
                {view === 'register' && (
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

                {/* Forgot Password View */}
                {view === 'forgot' && (
                    <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-envelope mr-1"></i> Nhập Email tài khoản</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="example@gmail.com"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang gửi OTP...</>
                            ) : (
                                'Gửi Mã OTP Xác Thực'
                            )}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                            <button 
                                type="button" 
                                onClick={() => { setView('login'); setMessage({ text: '', type: '' }); }}
                                style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại Đăng nhập
                            </button>
                        </div>
                    </form>
                )}

                {/* Reset Password View */}
                {view === 'reset' && (
                    <form onSubmit={handleResetSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-envelope mr-1"></i> Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={resetData.email}
                                disabled
                                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-key mr-1"></i> Nhập mã OTP</label>
                            <input 
                                type="text" 
                                name="otp" 
                                placeholder="Mã OTP 6 chữ số"
                                value={resetData.otp}
                                onChange={handleResetChange}
                                required
                                maxLength={6}
                                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: 'bold' }}
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-lock mr-1"></i> Mật khẩu mới</label>
                            <input 
                                type="password" 
                                name="newPassword" 
                                placeholder="Nhập mật khẩu mới"
                                value={resetData.newPassword}
                                onChange={handleResetChange}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label><i className="fa-solid fa-lock mr-1"></i> Xác nhận mật khẩu mới</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                placeholder="Xác nhận mật khẩu mới"
                                value={resetData.confirmPassword}
                                onChange={handleResetChange}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang đặt lại...</>
                            ) : (
                                'Đặt Lại Mật Khẩu'
                            )}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                            <button 
                                type="button" 
                                onClick={() => { setView('forgot'); setMessage({ text: '', type: '' }); }}
                                style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                <i className="fa-solid fa-arrow-left mr-1"></i> Nhập lại Email gửi OTP
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
