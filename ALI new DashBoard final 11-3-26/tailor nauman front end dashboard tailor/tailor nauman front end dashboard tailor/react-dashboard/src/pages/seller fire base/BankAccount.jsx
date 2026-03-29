import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

const BankAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        accountTitle: 'AliAhmad',
        accountNumber: '14275642610**',
        bankCode: '8088',
        iban: 'PK40MUC***4261000939',
        branchName: ''
    });
    const [status, setStatus] = useState('Update Bank Info');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setStatus('Processing...');
        setTimeout(() => {
            setStatus('Updated Successfully!');
            setIsSuccess(true);
            setTimeout(() => {
                setStatus('Update Bank Info');
                setIsSuccess(false);
                alert("Bank details updated.");
            }, 1000);
        }, 800);
    };

    useEffect(() => {
        const headings = ['Bank Account', 'Account Title', 'Account Number', 'IBAN'];
        saveHeadings('BankAccount', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Bank Account</div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Account Title <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="accountTitle" value={formData.accountTitle} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Account Number <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Bank Code <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="bankCode" value={formData.bankCode} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>IBAN</label>
                            <input type="text" name="iban" value={formData.iban} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Branch Name</label>
                            <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="Enter branch name" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <button type="submit" style={{ background: isSuccess ? '#1F9D6E' : 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: '16px', transition: 'background 0.2s', marginTop: '10px' }}>
                            {status}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BankAccount;
