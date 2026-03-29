import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sendMessage, listenForAllMessages } from './sellerdatabase';
import { saveHeadings } from '../../services/saveHeadings';

const UserChat = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name') || 'User';
    const type = searchParams.get('type') || 'user';

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messageContainerRef = useRef(null);

    useEffect(() => {
        const unsubscribe = listenForAllMessages((allMessages, err) => {
            if (err) {
                setMessages([]);
                return;
            }
            const filtered = allMessages.filter(msg =>
                (msg.sender === 'Seller' && (msg.receiver === name || msg.recipient === name)) ||
                ((msg.sender === name || msg.sender === 'tailor') && (msg.receiver === 'Seller' || msg.recipient === 'Seller'))
            );
            setMessages(filtered);
        });

        return () => unsubscribe();
    }, [name]);

    useEffect(() => {
        const headings = [name, 'Chat'];
        saveHeadings('UserChat', headings).catch(() => { });
    }, [name]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const text = inputText.trim();
        setInputText('');

        try {
            await sendMessage({
                text: text,
                sender: 'Seller',
                receiver: name,
                recipient: name,
                chatType: type
            });
        } catch (error) {
            console.error("Failed to send:", error);
            setInputText(text);
            alert("Failed to send message. Please check your connection.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="seller-page" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="seller-header" style={{ margin: 0, padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', sticky: 'top', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate(`/seller/messages?tab=${type}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-main)', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: type === 'tailor' ? 'var(--secondary)' : 'var(--primary)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 600 }}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>{name}</div>
                    </div>
                </div>
            </header>

            <div ref={messageContainerRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px', fontSize: '13px' }}>No messages yet. Say hi!</div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} style={{
                            maxWidth: '80%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            fontSize: '14px',
                            lineHeight: 1.5,
                            alignSelf: msg.sender === 'Seller' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'Seller' ? 'var(--primary)' : 'white',
                            color: msg.sender === 'Seller' ? 'white' : 'var(--text-main)',
                            borderBottomRightRadius: msg.sender === 'Seller' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.sender === 'Seller' ? '16px' : '4px',
                            boxShadow: msg.sender === 'Seller' ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.05)'
                        }}>
                            {msg.text}
                        </div>
                    ))
                )}
            </div>

            <div style={{ background: 'white', padding: '12px 16px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border)' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border)', outline: 'none', background: '#f8fafc', fontSize: '14px' }}
                />
                <button onClick={handleSend} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                    <span className="material-icons-round">send</span>
                </button>
            </div>
        </div>
    );
};

export default UserChat;
