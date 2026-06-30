import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import chatbotService from '../services/chatbotService';

function AIChatBot({ onAddToCart }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Load chat history from localStorage on initialization
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('trieucms_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi khi khôi phục lịch sử chat:", e);
      }
    }
    return [
      {
        id: 1,
        text: "Xin chào! Tôi là trợ lý ảo AI của TrieuCMS. Tôi có thể giúp gì cho bạn hôm nay?",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trieucms_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSuggestClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?")) {
      const initial = [
        {
          id: Date.now(),
          text: "Đã xóa lịch sử chat. Tôi có thể giúp gì thêm cho bạn?",
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initial);
      localStorage.setItem('trieucms_chat_history', JSON.stringify(initial));
    }
  };

  const handleBuyNow = (prod, e) => {
    e.stopPropagation();
    const added = onAddToCart(prod, 1);
    if (added) {
      setIsOpen(false); // Close chatbot window
      navigate('/checkout'); // Redirect to checkout
    }
  };

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: textToSend,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Map history for the payload, excluding the welcome message (id: 1) for brevity
      const apiHistory = messages
        .filter(m => m.id !== 1)
        .map(m => ({
          text: m.text,
          isBot: m.isBot
        }));

      const response = await chatbotService.chat(textToSend, apiHistory);

      const botMsg = {
        id: Date.now(),
        text: response.reply,
        isBot: true,
        products: response.products, // Save dynamic matched products
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Lỗi khi kết nối với AI Chatbot:", error);
      const botMsg = {
        id: Date.now(),
        text: "Xin lỗi, kết nối hệ thống gặp sự cố. Bạn vui lòng thử lại hoặc liên hệ hotline: 0973 651 140.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(inputText);
    }
  };

  return (
    <div style={{ zIndex: 9999, position: 'relative' }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #db2777)',
            color: '#fff',
            border: 'none',
            outline: 'none',
            boxShadow: '0 8px 30px rgba(79, 70, 229, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            animation: 'pulseChat 2s infinite'
          }}
          title="Trò chuyện với AI"
        >
          <i className="fa-solid fa-robot"></i>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '520px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #4f46e5, #db2777)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>NaUCMS.TechGear AI Assistant</h6>
                <span style={{ fontSize: '0.725rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Hoạt động
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleClearHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  opacity: 0.8,
                  padding: '4px',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                title="Xóa lịch sử chat"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  opacity: 0.8,
                  padding: '4px',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div
            style={{
              flex: 1,
              padding: '16px 20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#f8fafc'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end'
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: msg.isBot ? '#ffffff' : 'linear-gradient(135deg, #4f46e5, #db2777)',
                    color: msg.isBot ? '#1e293b' : '#ffffff',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    border: msg.isBot ? '1px solid #e2e8f0' : 'none',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>

                {/* Render Matched Products */}
                {msg.isBot && msg.products && msg.products.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    width: '100%',
                    minWidth: '260px'
                  }}>
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => navigate(`/product/${prod.id}`)}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '8px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          style={{
                            width: '54px',
                            height: '54px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #f1f5f9'
                          }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200'; }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{
                              fontSize: '0.775rem',
                              fontWeight: '600',
                              color: '#1e293b',
                              lineHeight: '1.3',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '2px'
                            }} title={prod.name}>
                              {prod.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.isOnSale ? prod.salePrice : prod.price)}
                              </span>
                              {prod.isOnSale && (
                                <span style={{ fontSize: '0.675rem', color: '#94a3b8', textDecorationLine: 'line-through' }}>
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(prod, 1);
                              }}
                              style={{
                                flex: 1,
                                padding: '4px 0',
                                fontSize: '0.7rem',
                                color: '#4f46e5',
                                background: '#f5f3ff',
                                border: '1px solid #e0dcfc',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => e.target.style.background = '#e0dcfc'}
                              onMouseOut={(e) => e.target.style.background = '#f5f3ff'}
                            >
                              Thêm giỏ hàng
                            </button>
                            <button
                              onClick={(e) => handleBuyNow(prod, e)}
                              style={{
                                flex: 1,
                                padding: '4px 0',
                                fontSize: '0.7rem',
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, #4f46e5, #db2777)',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                              }}
                              onMouseOver={(e) => e.target.style.opacity = '0.9'}
                              onMouseOut={(e) => e.target.style.opacity = '1'}
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <span style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: '4px', marginHorizontal: '4px' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid #e2e8f0',
                  alignSelf: 'flex-start',
                  width: 'fit-content'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'typingDot 1.4s infinite 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'typingDot 1.4s infinite 0.4s' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'typingDot 1.4s infinite 0.6s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div
            style={{
              padding: '8px 16px',
              background: '#f8fafc',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}
          >
            {[
              "Tay cầm chơi game",
              "Địa chỉ cửa hàng",
              "Chính sách bảo hành",
              "Thời gian giao hàng"
            ].map((suggest, index) => (
              <button
                key={index}
                onClick={() => handleSuggestClick(suggest)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#4f46e5',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#4f46e5';
                  e.currentTarget.style.background = '#f5f3ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div
            style={{
              padding: '12px 16px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#1e293b'
              }}
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputText.trim() ? 'linear-gradient(135deg, #4f46e5, #db2777)' : '#f1f5f9',
                color: inputText.trim() ? '#ffffff' : '#94a3b8',
                border: 'none',
                cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <i className="fa-solid fa-paper-plane" style={{ fontSize: '0.9rem' }}></i>
            </button>
          </div>
        </div>
      )}

      {/* Global CSS Styles */}
      <style>{`
        @keyframes pulseChat {
          0% { transform: scale(1); box-shadow: 0 8px 30px rgba(79, 70, 229, 0.45); }
          50% { transform: scale(1.05); box-shadow: 0 8px 35px rgba(79, 70, 229, 0.65); }
          100% { transform: scale(1); box-shadow: 0 8px 30px rgba(79, 70, 229, 0.45); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default AIChatBot;
