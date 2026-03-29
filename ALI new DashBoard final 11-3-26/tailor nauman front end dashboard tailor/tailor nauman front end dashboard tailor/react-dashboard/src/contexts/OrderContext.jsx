import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderCount, setOrderCount] = useState(0);

    const increment = () => setOrderCount(c => c + 1);
    const reset = () => setOrderCount(0);

    return (
        <OrderContext.Provider value={{ orderCount, increment, reset }}>
            {children}
        </OrderContext.Provider>
    );
};
