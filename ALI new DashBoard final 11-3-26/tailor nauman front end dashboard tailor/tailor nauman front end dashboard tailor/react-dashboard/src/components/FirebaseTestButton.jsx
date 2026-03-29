import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const FirebaseTestButton = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleTestWrite = async () => {
        setLoading(true);
        setMessage('Testing...');
        
        try {
            console.log('Test: attempting to write to Firestore');
            console.log('Test: db object =', db);
            
            const docRef = await addDoc(collection(db, 'test_messages'), {
                msg: 'Halloali! Firebase test successful!',
                timestamp: new Date(),
                testTime: new Date().toLocaleString()
            });
            
            console.log('Test: Document written with ID:', docRef.id);
            setMessage(`✅ Success! Doc ID: ${docRef.id}`);
        } catch (error) {
            console.error('Test: Write failed:', error);
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            padding: '16px', 
            background: '#f0f7ff', 
            borderRadius: '12px', 
            marginBottom: '20px',
            border: '2px solid #4F46E5'
        }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1e40af' }}>
                🔥 Firebase Connection Test
            </div>
            
            <button 
                onClick={handleTestWrite}
                disabled={loading}
                style={{
                    background: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                }}
            >
                {loading ? 'Testing...' : 'Click to Test Firebase'}
            </button>

            {message && (
                <div style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    background: message.includes('Success') ? '#dcfce7' : '#fee2e2',
                    color: message.includes('Success') ? '#166534' : '#991b1b',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FirebaseTestButton;
