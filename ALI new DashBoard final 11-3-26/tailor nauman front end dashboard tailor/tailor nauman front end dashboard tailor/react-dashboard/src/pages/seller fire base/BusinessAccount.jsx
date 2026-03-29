import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

const BusinessAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sellerType: 'Individual',
        address: 'House #1 BLOCK NEAR NADRA OFFICE, JOHAR TOWN LAHORE',
        country: 'Pakistan',
        regNumber: '',
        cnic: '3520242***71'
    });
    const [status, setStatus] = useState('Save Business Info');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setStatus('Saving...');
        setTimeout(() => {
            setStatus('Saved Successfully!');
            setIsSuccess(true);
            setTimeout(() => {
                setStatus('Save Business Info');
                setIsSuccess(false);
                alert("Business information updated.");
            }, 1000);
        }, 800);
    };

    useEffect(() => {
        const headings = ['Business Information', 'Seller Type', 'Address', 'Country Region', 'CNIC'];
        saveHeadings('BusinessAccount', headings).catch(() => {});
    }, []);

    const triggerUpload = () => {
        alert("This opens the file picker in a real app.");
    };

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Business Information</div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Seller Type</label>
                            <select name="sellerType" value={formData.sellerType} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb', fontFamily: 'inherit' }}>
                                <option value="Individual">Individual</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Address <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <textarea name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Country Region <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Business Registration Number</label>
                            <input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} placeholder="N/A" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                CNIC Number <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Upload ID (Front & Back)</label>
                            <div onClick={triggerUpload} style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', transition: 'all 0.2s' }}>
                                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '32px', marginBottom: '8px' }}>cloud_upload</span>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Click to upload images</div>
                            </div>
                        </div>

                        <button type="submit" style={{ background: isSuccess ? '#1F9D6E' : 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: '16px', transition: 'background 0.2s', marginTop: '20px' }}>
                            {status}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BusinessAccount;
