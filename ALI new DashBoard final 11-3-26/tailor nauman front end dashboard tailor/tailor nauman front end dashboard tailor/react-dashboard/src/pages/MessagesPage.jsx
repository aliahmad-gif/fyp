import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, listenForAllMessages, listenForChatMessages } from './tailor firebase';

const MessagesPage = () => {
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [activeRole, setActiveRole] = useState('User');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [firebaseError, setFirebaseError] = useState(null);
    const messagesEndRef = useRef(null);
    const MY_ROLE = 'tailor';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setFirebaseError(null);
        const unsubscribe = listenForAllMessages((allMessages, err) => {
            if (err) {
                setFirebaseError(err.message || 'Firebase error');
                setContacts([]);
                return;
            }
            const contactsMap = {};
            allMessages.forEach(msg => {
                let contactName = null;
                let contactRole = 'User';

                const isFromMe = msg.sender === MY_ROLE || msg.sender === 'Seller';
                const recipient = msg.receiver || msg.recipient;
                const sender = msg.sender;

                if (isFromMe) {
                    contactName = recipient;
                } else {
                    contactName = sender;
                    contactRole = msg.senderRole || 'User';
                }

                if (contactName) {
                    if (!contactsMap[contactName] || (msg.timestamp?.toMillis?.() || 0) > (contactsMap[contactName].time?.toMillis?.() || 0)) {
                        contactsMap[contactName] = {
                            name: contactName,
                            role: contactRole,
                            lastMsg: msg.text,
                            time: msg.timestamp
                        };
                    }
                }
            });
            const sortedContacts = Object.values(contactsMap).sort((a, b) => (b.time?.toMillis?.() || 0) - (a.time?.toMillis?.() || 0));
            setContacts(sortedContacts);

            if (!activeContact && sortedContacts.length > 0) {
                setActiveContact(sortedContacts[0].name);
                setActiveRole(sortedContacts[0].role);
            }
        });
        return () => unsubscribe();
    }, [activeContact]);

    useEffect(() => {
        if (!activeContact) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const unsubscribe = listenForChatMessages(activeContact, MY_ROLE, (msgs, err) => {
            if (err) {
                setFirebaseError(err.message || 'Firebase error');
                setMessages([]);
            } else {
                setMessages(msgs);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [activeContact]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || !activeContact) return;

        const text = inputText;
        setInputText('');

        await sendMessage({
            text: text,
            sender: MY_ROLE,
            receiver: activeContact,
            recipient: activeContact,
            senderRole: 'Seller'
        });
    };

    const getAvatarColor = (name) => {
        const colors = ['#059669', '#D97706', '#4F46E5', '#7c3aed', '#db2777'];
        return colors[name.length % colors.length];
    };

    return (
        <section className="view-section active" style={{ padding: 0, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            {firebaseError && (
                <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>error</span>
                    Messages not loading. Open Firebase Console → Firestore → Rules and allow read/write for collection <strong>Tailor_messages</strong>.
                </div>
            )}
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <div className="messages-sidebar">
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {contacts.map((contact) => (
                        <div
                            key={contact.name}
                            className={`msg-tile ${activeContact === contact.name ? 'active' : ''}`}
                            onClick={() => {
                                setActiveContact(contact.name);
                                setActiveRole(contact.role);
                            }}
                        >
                            <div className="tile-avatar" style={{ background: getAvatarColor(contact.name) }}>
                                {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="tile-content">
                                <div className="tile-top">
                                    <div className="tile-name">{contact.name}</div>
                                </div>
                                <div className="tile-label">
                                    <span className={`badge-role ${contact.role === 'Seller' ? 'role-tailor' : 'role-user'}`}>
                                        {contact.role}
                                    </span>
                                </div>
                                <div className="tile-msg">{contact.lastMsg}</div>
                            </div>
                        </div>
                    ))}
                    {contacts.length === 0 && !firebaseError && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'gray' }}>No messages yet. Send one from the chat.</div>
                    )}
                </div>
            </div>

            <div className="chat-area" style={{ flex: 1 }}>
                <div style={{ padding: '1.25rem 2rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '12px', height: '12px', background: '#10B981', border: '2px solid white', borderRadius: '50%', boxShadow: '0 0 0 2px #10B981' }}></div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div id="activeChatName" style={{ fontWeight: 700 }}>{activeContact || 'Select a chat'}</div>
                                {activeContact && (
                                    <span className={`badge-role ${activeRole === 'Seller' ? 'role-tailor' : 'role-user'}`}>
                                        {activeRole}
                                    </span>
                                )}
                            </div>
                            <div style={{ font: '0.8rem', color: 'gray' }}>Working on Order #ORD-2025-001</div>
                        </div>
                    </div>
                </div>

                <div className="chat-msgs" id="chatContainer">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', color: 'gray', padding: '1rem' }}>Loading...</div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`chat-bubble ${msg.sender === MY_ROLE ? 'bubble-mine' : 'bubble-other'}`}
                            >
                                {msg.text}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-footer">
                    <input
                        type="text"
                        className="msg-input"
                        placeholder="Type a message..."
                        id="msgInput"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={() => handleSend()}>Send</button>
                </div>
            </div>
            </div>
        </section>
    );
};

export default MessagesPage;
