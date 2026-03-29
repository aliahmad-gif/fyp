import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

const SellerReviews = () => {
    const navigate = useNavigate();

    const reviews = [
        {
            id: 1,
            name: 'Ali Hassan',
            initials: 'AH',
            time: '2 days ago',
            rating: 5,
            product: 'Classic White Cotton Shalwar Kameez',
            comment: 'Excellent quality fabric and perfect stitching. Delivered on time. Highly recommended!',
            color: 'var(--primary)'
        },
        {
            id: 2,
            name: 'Sana Khan',
            initials: 'SK',
            time: '1 week ago',
            rating: 4.5,
            product: 'Premium Boski Shalwar Kameez',
            comment: 'The color is slightly different from the picture but the quality is good.',
            color: 'var(--secondary)',
            avatarBg: '#fce7f3'
        },
        {
            id: 3,
            name: 'M. Rizwan',
            initials: 'MR',
            time: '2 weeks ago',
            rating: 5,
            product: 'Luxury Blended Fabric Suit',
            comment: 'Value for money. Direct shipping was very fast. Will order again.',
            color: 'var(--success-text)',
            avatarBg: '#d1fae5'
        }
    ];

    const handleReply = (name) => {
        const reply = prompt(`Write a reply to ${name}:`);
        if (reply) {
            alert("Reply sent successfully!");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<span key={i} className="material-icons-round">star</span>);
            } else if (i - 0.5 <= rating) {
                stars.push(<span key={i} className="material-icons-round">star_half</span>);
            } else {
                stars.push(<span key={i} className="material-icons-round" style={{ color: '#e5e7eb' }}>star</span>);
            }
        }
        return stars;
    };

    useEffect(() => {
        const headings = ['Manage Reviews', 'Reply'];
        saveHeadings('SellerReviews', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Manage Reviews</div>
                </div>
            </header>

            <div className="scrollable-content" style={{ padding: '16px' }}>
                {reviews.map((review) => (
                    <div key={review.id} className="review-card" style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: review.avatarBg || '#e0e7ff', color: review.color, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: '16px' }}>
                                    {review.initials}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{review.name}</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{review.time}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24' }}>
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--primary)', marginBottom: '8px', display: 'inline-block', background: 'var(--primary-light-bg)', padding: '4px 8px', borderRadius: '6px' }}>
                            {review.product}
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '12px' }}>{review.comment}</p>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleReply(review.name)} style={{ background: 'white', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 500, cursor: 'pointer', fontSize: '13px' }}>
                                Reply
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default SellerReviews;
