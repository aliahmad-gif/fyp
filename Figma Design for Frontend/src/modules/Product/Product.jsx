import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModelViewer } from '../../landing3d/ModelViewer';
import { useCart } from '../../components/CartContext';
import './Product.css';

// 3D model paths (same as 3D marketplace landing – rotating products)
const MODELS = {
    main: '/models/product5/sample4.gltf',
    similar: [
        '/models/product1/sample1.gltf',
        '/models/product2/sample1.gltf',
        '/models/product3/sample5.gltf',
    ],
};

const MAIN_PRODUCT = {
    id: 'main',
    name: 'Pure Banarasi Silk (Gold)',
    subtitle: 'Authentic handwoven Banarasi silk with golden zari work',
    price: 44999,
    originalPrice: 52400,
    modelPath: '/models/product5/sample4.gltf',
};

const SIMILAR_PRODUCTS = [
    { id: 'similar-0', name: 'Linen Straight Kurta', price: 4500, modelIndex: 0 },
    { id: 'similar-1', name: 'Chikan Embroidered Kurta', price: 2000, modelIndex: 1 },
    { id: 'similar-2', name: 'Pathani Style Kurta', price: 2000, modelIndex: 2 },
];

const Product = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [viewingProductIndex, setViewingProductIndex] = useState(null); // null = main, 0|1|2 = similar
    const [selectedSize, setSelectedSize] = useState('M');
    const [mxSize, setMxSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [selectedSimilarSize, setSelectedSimilarSize] = useState({ 0: null, 1: null, 2: null });

    const displayProduct = viewingProductIndex === null
        ? { ...MAIN_PRODUCT, modelPath: MAIN_PRODUCT.modelPath }
        : {
            id: SIMILAR_PRODUCTS[viewingProductIndex].id,
            name: SIMILAR_PRODUCTS[viewingProductIndex].name,
            subtitle: '',
            price: SIMILAR_PRODUCTS[viewingProductIndex].price,
            originalPrice: null,
            modelPath: MODELS.similar[SIMILAR_PRODUCTS[viewingProductIndex].modelIndex],
        };

    const similarCardsToShow = viewingProductIndex === null
        ? SIMILAR_PRODUCTS.map((p, i) => ({ type: 'similar', index: i }))
        : [
            { type: 'main' },
            ...([0, 1, 2].filter(i => i !== viewingProductIndex).map(i => ({ type: 'similar', index: i }))),
        ];

    // Mock stock data
    const stockData = {
        'XCH': 'in-stock',
        'CH': 'in-stock',
        'M': 'in-stock',
        'G': 'in-stock',
        'XG': 'out-of-stock'
    };

    const handleSizeClick = (size) => {
        if (stockData[size] === 'out-of-stock') {
            showNotification(`Size ${size} is currently out of stock. Please select another size.`, 'warning');
            return;
        }
        setSelectedSize(size);
        showNotification(`Size ${size} selected`, 'success');
    };

    const handleMxSizeChange = (e) => {
        const value = e.target.value;
        setMxSize(value);
        if (value) {
            const sizeMapping = {
                '38': 'CH', '40': 'M', '42': 'G',
                '44': 'XG', '46': 'XG', '48': 'XG', '50': 'XG', '52': 'XG'
            };
            const recommended = sizeMapping[value] || 'M';

            if (stockData[recommended] === 'out-of-stock') {
                showNotification(`Recommended size ${recommended} is out of stock. Please select another size.`, 'warning');
            } else {
                setSelectedSize(recommended);
                showNotification(`MxSize ${value} selected. Recommended size: ${recommended}`, 'success');
            }
        }
    };

    const handleQuantityChange = (delta) => {
        const newValue = quantity + delta;
        if (newValue >= 1 && newValue <= 10) {
            setQuantity(newValue);
        }
    };

    const handleAddToCart = () => {
        if (stockData[selectedSize] === 'out-of-stock') {
            showNotification(`Size ${selectedSize} is currently out of stock.`, 'error');
            return;
        }
        addToCart({
            id: `${displayProduct.id}-${selectedSize}`,
            name: displayProduct.name,
            price: displayProduct.price,
            size: selectedSize,
            image: displayProduct.modelPath,
            category: 'Kurta',
        });
        let message = `${displayProduct.name} - Size ${selectedSize} (Qty: ${quantity}) added to cart!`;
        if (mxSize) message += ` | MxSize: ${mxSize}`;
        showNotification(message, 'success');
    };

    const handleSimilarAddToCart = (index, name, price) => {
        const size = selectedSimilarSize[index];
        if (!size) {
            showNotification('Please select a size first', 'warning');
            return;
        }
        addToCart({
            id: `${SIMILAR_PRODUCTS[index].id}-${size}`,
            name,
            price,
            size,
            image: MODELS.similar[SIMILAR_PRODUCTS[index].modelIndex],
            category: 'Kurta',
        });
        showNotification(`${name} (Size ${size}) added to cart!`, 'success');
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // Navigate to in-app Measurement module (same flow as "measurement module" folder)
    const handleLiveMeasurement = () => {
        navigate('/measurement');
    };

    return (
        <div className="product-page">
            <div className="product-container">
                <div className="breadcrumb">
                    <Link to="/">Product Listing</Link> <i className="fas fa-chevron-right"></i> <Link to="#" onClick={(e) => { e.preventDefault(); setViewingProductIndex(null); }}>{displayProduct.name}</Link>
                </div>

                <div className="product-content">
                    <div className="product-image">
                        <div className="product-image-container product-image-container-3d">
                            <ModelViewer modelPath={displayProduct.modelPath} />
                        </div>
                    </div>

                    <div className="product-details">
                        <h1 className="product-title">{displayProduct.name}</h1>
                        {displayProduct.subtitle && <p className="product-subtitle">{displayProduct.subtitle}</p>}

                        <div className="price-container">
                            <div className="current-price">Rs. {displayProduct.price.toLocaleString('en-PK')}</div>
                        </div>

                        <div className="mxsize-field">
                            <label className="mxsize-label">Size MxSize</label>
                            <select className="mxsize-dropdown" value={mxSize} onChange={handleMxSizeChange}>
                                <option value="">Select MxSize</option>
                                <option value="38">38</option>
                                <option value="40">40</option>
                                <option value="42">42</option>
                                <option value="44">44</option>
                                <option value="46">46</option>
                                <option value="48">48</option>
                                <option value="50">50</option>
                                <option value="52">52</option>
                            </select>
                            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                                Select your custom MxSize measurement in inches
                            </p>
                        </div>

                        <div className="size-section">
                            <div className="size-label-container">
                                <label className="size-label">Size</label>
                            </div>
                            <div className="size-options">
                                {Object.keys(stockData).map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''} ${stockData[size] === 'out-of-stock' ? 'out-of-stock' : ''}`}
                                        onClick={() => handleSizeClick(size)}
                                    >
                                        {size} ({size === 'XCH' ? 'XS' : size === 'CH' ? 'S' : size === 'M' ? 'M' : size === 'G' ? 'L' : 'XL'})
                                    </button>
                                ))}
                            </div>
                            <button className="size-guide-btn" onClick={() => setShowSizeGuide(true)}>
                                <i className="fas fa-ruler"></i> SIZE GUIDE
                            </button>
                        </div>

                        <button className="live-measurement-btn" onClick={handleLiveMeasurement}>
                            <i className="fas fa-ruler-combined"></i> Live Measurement
                        </button>

                        <div className="add-to-cart-container">
                            <div className="quantity-selector">
                                <button type="button" className="quantity-btn minus" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input type="number" className="quantity-input" value={quantity} readOnly />
                                <button type="button" className="quantity-btn plus" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                            <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
                                <i className="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>

                        <div className="shipping-info">
                            <div className="shipping-row">
                                <i className="fas fa-shipping-fast"></i>
                                <div>Free nationwide shipping on orders over Rs. 5,000</div>
                            </div>
                            <div className="shipping-row">
                                <i className="fas fa-clock"></i>
                                <div>Delivers in 3-7 Working Days Shipping & Return</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="description-section">
                    <h3 className="description-heading">Description</h3>
                    <div className="description-content">
                        <p>Pure Banarasi silk with golden zari work. Handwoven in traditional style, ideal for weddings and formal occasions. Premium fabric with intricate embroidery.</p>
                        <p>Care: Dry clean only. Store in a cool, dry place. Do not expose to direct sunlight for long periods.</p>
                    </div>
                </div>

                <div className="similar-products-section">
                    <h2 className="section-title">Similar Products</h2>
                    <div className="similar-products-container">
                        {similarCardsToShow.map((item) => {
                            const isMain = item.type === 'main';
                            const product = isMain ? MAIN_PRODUCT : SIMILAR_PRODUCTS[item.index];
                            const index = isMain ? null : item.index;
                            const modelPath = isMain ? MAIN_PRODUCT.modelPath : MODELS.similar[product.modelIndex];
                            return (
                                <div
                                    key={isMain ? 'main' : product.id}
                                    className="similar-product-card similar-product-card-clickable"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setViewingProductIndex(isMain ? null : item.index)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewingProductIndex(isMain ? null : item.index); } }}
                                >
                                    <div className="similar-product-image-container similar-product-3d similar-product-click-area">
                                        <ModelViewer modelPath={modelPath} />
                                    </div>
                                    {!isMain && (
                                        <div className="size-popup" onClick={(e) => e.stopPropagation()}>
                                            {['S', 'M', 'L', 'XL'].map((sz) => (
                                                <button
                                                    key={sz}
                                                    type="button"
                                                    className={`size-btn-small ${selectedSimilarSize[index] === sz ? 'active' : ''}`}
                                                    onClick={() => setSelectedSimilarSize(prev => ({ ...prev, [index]: sz }))}
                                                >
                                                    {sz}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {!isMain && (
                                        <div className="similar-add-to-cart-wrap" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                className="add-to-cart-small"
                                                onClick={() => handleSimilarAddToCart(index, product.name, product.price)}
                                            >
                                                <i className="fas fa-shopping-cart"></i> Add to Cart
                                            </button>
                                        </div>
                                    )}
                                    <div className="product-info similar-product-click-area">
                                        <h3 className="product-name">{product.name}</h3>
                                        {!isMain && (
                                            <div className="product-price">
                                                <span className="current-price-small">Rs. {product.price.toLocaleString('en-PK')}.00</span>
                                            </div>
                                        )}
                                        {isMain && (
                                            <p className="similar-view-product-hint">Click to view this product</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <footer>
                    <p>© 2023 Banarasi Silk Store. All rights reserved.</p>
                </footer>
            </div>

            {/* Notification */}
            {notification.show && (
                <div
                    className="notification"
                    style={{
                        display: 'block',
                        backgroundColor: notification.type === 'error' ? '#ff3d3d' : notification.type === 'warning' ? '#ff9800' : '#2e7d32'
                    }}
                >
                    {notification.message}
                </div>
            )}

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="size-guide-modal" style={{ display: 'flex' }} onClick={() => setShowSizeGuide(false)}>
                    <div className="size-guide-content" onClick={e => e.stopPropagation()}>
                        <div className="size-guide-header">
                            <h3>Size Guide</h3>
                            <button className="close-modal" onClick={() => setShowSizeGuide(false)}>&times;</button>
                        </div>
                        <p>Refer to the table below to find your perfect fit. All measurements are in inches.</p>
                        <table className="size-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Chest</th>
                                    <th>Waist</th>
                                    <th>Hip</th>
                                    <th>Length</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>XCH (XS)</td><td>34-36</td><td>28-30</td><td>36-38</td><td>40</td></tr>
                                <tr><td>CH (S)</td><td>36-38</td><td>30-32</td><td>38-40</td><td>41</td></tr>
                                <tr><td>M (M)</td><td>38-40</td><td>32-34</td><td>40-42</td><td>42</td></tr>
                                <tr><td>G (L)</td><td>40-42</td><td>34-36</td><td>42-44</td><td>43</td></tr>
                                <tr><td>XG (XL)</td><td>42-44</td><td>36-38</td><td>44-46</td><td>44</td></tr>
                            </tbody>
                        </table>
                        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>For any assistance with sizing, please contact our customer support.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
