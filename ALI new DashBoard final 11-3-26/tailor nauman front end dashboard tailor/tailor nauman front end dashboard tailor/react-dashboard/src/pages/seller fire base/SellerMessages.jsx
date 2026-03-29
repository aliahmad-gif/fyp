import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenForAllMessages } from './sellerdatabase';
import { saveHeadings } from '../../services/saveHeadings';

const SellerMessages = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('user-chats');
    const [messages, setMessages] = useState([]);
    const [userChats, setUserChats] = useState([]);
    const [tailorChats, setTailorChats] = useState([]);

    useEffect(() => {
        const unsubscribe = listenForAllMessages((allMessages, err) => {
            if (err) {
                setMessages([]);
                setUserChats([]);
                setTailorChats([]);
                return;
            }
            setMessages(allMessages);
            processMessages(allMessages);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const headings = ['Messages', 'Tailors', 'Users'];
        saveHeadings('SellerMessages', headings).catch(() => { });
    }, []);

    const processMessages = (allMessages) => {
        // Group messages by the "Other Person" (not 'Seller')
        const latestMessages = {};
        allMessages.forEach(msg => {
            const isFromMe = msg.sender === 'Seller';
            const otherPerson = isFromMe ? (msg.receiver || msg.recipient || 'Unknown') : (msg.sender || 'Unknown');

            if (otherPerson === 'Seller') return;

            if (!latestMessages[otherPerson] || (msg.timestamp && msg.timestamp.toDate() > latestMessages[otherPerson].timestamp.toDate())) {
                latestMessages[otherPerson] = msg;
            }
        });

        // Convert back to array and sort by time
        const sortedChats = Object.entries(latestMessages).sort((a, b) => {
            const timeA = a[1].timestamp ? a[1].timestamp.toDate() : 0;
            const timeB = b[1].timestamp ? b[1].timestamp.toDate() : 0;
            return timeB - timeA;
        });

        const users = [];
        const tailors = [];

        sortedChats.forEach(([personName, chat]) => {
            const type = chat.chatType || 'user';
            const chatObj = {
                name: personName,
                text: chat.text || '',
                time: chat.timestamp ? chat.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
                initial: personName.charAt(0).toUpperCase(),
                type: type,
                unread: 0 // In a real app, this would be calculated
            };

            if (type === 'tailor') {
                tailors.push(chatObj);
            } else {
                users.push(chatObj);
            }
        });

        // Add dummy data if empty to match original look if no firebase data
        if (users.length === 0) {
            users.push(
                { name: 'Farhan Butt', text: '[Order card]', time: '17/08', initial: 'F', type: 'user' },
                { name: 'malikiqraa951', text: 'asa bn jayega?', time: '13/08', initial: 'M', type: 'user', unread: 1 },
                { name: 'sadia naveed', text: '???', time: '12/08', initial: 'S', type: 'user', unread: 3 }
            );
        }

        if (tailors.length === 0) {
            tailors.push(
                { name: 'Master Tailor Ahmed', text: 'Measurements confirmed for order #4521', time: 'Just now', initial: 'A', type: 'tailor', unread: 'NEW' },
                { name: 'Expert Stitch Studio', text: 'Sir, your fabric has been sourced.', time: 'Yesterday', initial: 'E', type: 'tailor' },
                { name: 'Royal Fabrics & Tailors', text: 'We are ready to start processing.', time: '15/08', initial: 'R', type: 'tailor' }
            );
        }

        setUserChats(users);
        setTailorChats(tailors);
    };

    const openChat = (name, type) => {
        navigate(`/seller/chat?name=${encodeURIComponent(name)}&type=${type || 'user'}`);
    };

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Messages</div>
                </div>
            </header>

            {/* Tabs */}
            <div className="seller-tabs-container" style={{ background: 'white', padding: '0 1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex' }}>
                    <button className={`seller-tab-btn ${activeTab === 'user-chats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('user-chats')}
                        style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', fontWeight: 700, color: activeTab === 'user-chats' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                        Tailors
                        {activeTab === 'user-chats' && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '3px 3px 0 0' }}></div>}
                    </button>
                    <button className={`seller-tab-btn ${activeTab === 'tailor-chats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tailor-chats')}
                        style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', fontWeight: 700, color: activeTab === 'tailor-chats' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                        Users
                        {activeTab === 'tailor-chats' && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '3px 3px 0 0' }}></div>}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: '#f7f8fb' }}>
                <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                        <span style={{ fontWeight: 700 }}>{activeTab === 'user-chats' ? 'All' : 'Active Requests'}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }}>{activeTab === 'user-chats' ? 'Select' : 'Filter'}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(activeTab === 'user-chats' ? userChats : tailorChats).map((chat, i) => (
                            <div key={i} className="seller-message-tile" onClick={() => openChat(chat.name, chat.type)} style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: chat.type === 'tailor' ? 'var(--secondary)' : '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 500, fontSize: '18px', flexShrink: 0 }}>
                                    {chat.initial}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.name}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.text}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{chat.time}</span>
                                    {chat.unread && (
                                        <div style={{ background: 'var(--primary)', color: 'white', fontSize: '12px', fontWeight: 500, padding: '2px 8px', borderRadius: '12px', minWidth: '20px', textAlign: 'center' }}>
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerMessages;
