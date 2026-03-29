import React from 'react';

const ReviewsPage = () => {
    const reviews = [
        {
            id: 1,
            product: 'Mens Shalwar Kameez',
            seller: 'Nauman Tailors',
            user: 'Ali Ahmad',
            date: '2 days ago',
            rating: '★★★★★',
            comment: '"Perfect fitting! The fabric quality is amazing and the stitching is exactly as requested."',
            productImage: '/images/1.png',
            userAvatar: '/images/2.png'
        },
        {
            id: 2,
            product: 'Designer Maxi',
            seller: 'Fabric House',
            user: 'Sarah',
            date: '1 week ago',
            rating: '★★★★★',
            comment: '"Loved the design. It looks even better in person than in the pictures."',
            productImage: '/images/3.png',
            userAvatar: '/images/4.png'
        }
    ];

    return (
        <section className="view-section active">
            <div className="page-header">
                <h1 className="page-title large" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Customer Reviews</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <img
                                    src={review.productImage}
                                    style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--border)' }}
                                    alt="Product"
                                />
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{review.product}</h4>
                                    <div style={{ fontSize: '0.85rem', color: 'gray', marginBottom: '0.25rem' }}>
                                        Seller: <b>{review.seller}</b>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>User: <b>{review.user}</b></div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <small style={{ color: 'gray' }}>{review.date}</small>
                            </div>
                        </div>
                        <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <img src={review.userAvatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="User" />
                                <div style={{ color: '#F59E0B' }}>{review.rating}</div>
                            </div>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-main)' }}>{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReviewsPage;
