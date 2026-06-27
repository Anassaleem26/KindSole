import { useState, useEffect, useMemo } from 'react';
import { database } from '../../../lib/fireBaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const useSalesAnalytics = (filters = {}) => {
    const { 
        isFilterActive = false, 
        activeYear, 
        activeMonth, 
        selectedDay, 
        totalDaysInMonth = 1 
    } = filters;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(database, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const temporaryOrders = snapshot.docs.map(doc => {
                const data = doc.data();
                const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                
                const gross = Number(data.totalPrice || 0);
                const tax = Math.round(gross * 0.05); // 5% Tax
                const shipping = (data.paymentMethod === "Cash on delivery" ? 10 : 0);
                const fees = Number((0.30 + (gross * 0.029)).toFixed(2)); // Gateway Fee

                return {
                    id: doc.id,
                    orderDate: `${yyyy}-${mm}-${dd}`,
                    customerEmail: data.customerInfo.email || 'Guest',
                    grossAmount: gross,
                    calculatedTax: tax,
                    shippingCharge: shipping,
                    gatewayFee: fees,
                    netSettled: Number((gross - tax - fees - shipping).toFixed(2)),
                    orderStatus: data.orderStatus || 'Pending',
                    paymentMethod: data.paymentMethod || ''
                };
            });
            setOrders(temporaryOrders);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const { salesDetails, chartData } = useMemo(() => {
        const datesMap = {};
        const today = new Date();

        // Initialize timeline
        if (isFilterActive && selectedDay) {
            datesMap[`${activeYear}-${String(activeMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`] = { sales: 0, orders: 0 };
        } else if (isFilterActive) {
            for (let d = 1; d <= totalDaysInMonth; d++) {
                datesMap[`${activeYear}-${String(activeMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`] = { sales: 0, orders: 0 };
            }
        } else {
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                datesMap[key] = { sales: 0, orders: 0 };
            }
        }

        let gross = 0;
        let tax = 0;
        let shipping = 0;
        let fees = 0;

        orders.forEach(order => {
            if (order.orderStatus !== 'Cancelled' && datesMap[order.orderDate]) {
                gross += order.grossAmount;
                tax += order.calculatedTax;
                shipping += order.shippingCharge;
                fees += order.gatewayFee;
                datesMap[order.orderDate].sales += order.grossAmount;
                datesMap[order.orderDate].orders += 1;
            }
        });

        const chartData = Object.keys(datesMap).sort().map(date => ({
            date: date.substring(5),
            sales: datesMap[date].sales,
            orders: datesMap[date].orders,
            visits: (datesMap[date].orders * 5) + 10
        }));

        return {
            salesDetails: {
                grossSales: gross,
                netSales: Number((gross - tax - fees - shipping).toFixed(2)),
                totalTax: tax,
                totalShipping: shipping,
                totalGatewayFees: fees,
                averageOrderValue: (orders.length ? (gross / orders.length) : 0).toFixed(2),
                averageOrderRate: (Object.values(datesMap).reduce((a, b) => a + b.orders, 0) / Object.keys(datesMap).length).toFixed(1)
            },
            chartData
        };
    }, [orders, isFilterActive, activeYear, activeMonth, selectedDay, totalDaysInMonth]);

    return { salesDetails, loading, chartData, orders }; // Return 'orders' here
};

export default useSalesAnalytics;