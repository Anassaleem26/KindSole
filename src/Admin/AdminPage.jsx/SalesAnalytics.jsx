import React, { useState, useMemo, useRef, useEffect } from 'react';
import useSalesAnalytics from '../Hooks/Sales record/useSalesAnalytics';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const SalesAnalytics = () => {
    const navigate = useNavigate();

    // 🟢 1. Current Live Time Contexts (Moved up for safe initialization)
    const todayObj = new Date();
    const currentYearStr = todayObj.getFullYear().toString(); // "2026"
    const currentMonthStr = String(todayObj.getMonth() + 1).padStart(2, '0'); // "06"

    // 🟢 2. Active Navigation Contexts for Calendar Matrix
    const [activeYear, setActiveYear] = useState(currentYearStr);
    const [activeMonth, setActiveMonth] = useState(currentMonthStr);
    const [selectedDay, setSelectedDay] = useState(''); // Empty dynamically means: DEFAULT LOOKUP STATE
    const [isFilterActive, setIsFilterActive] = useState(false); // Flags explicit user action

    // Dropdown Popover Control States
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef(null);

    // Days length calculator
    const totalDaysInMonth = useMemo(() => {
        return new Date(parseInt(activeYear), parseInt(activeMonth), 0).getDate();
    }, [activeYear, activeMonth]);

    // 🟢 3. HOOK PIPELINE: Injecting active states directly into the hook
    const { salesDetails, loading, orders } = useSalesAnalytics({
        isFilterActive,
        activeYear,
        activeMonth,
        selectedDay,
        totalDaysInMonth
    });
    // Close calendar on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 📅 Generate Comprehensive Year List
    const yearOptions = useMemo(() => {
        const currentYearNum = parseInt(currentYearStr);
        const years = [];
        for (let y = currentYearNum; y >= currentYearNum - 6; y--) {
            years.push(y.toString());
        }
        return years;
    }, [currentYearStr]);

    const monthsList = [
        { val: "01", label: "Jan" }, { val: "02", label: "Feb" }, { val: "03", label: "Mar" },
        { val: "04", label: "Apr" }, { val: "05", label: "May" }, { val: "06", label: "Jun" },
        { val: "07", label: "Jul" }, { val: "08", label: "Aug" }, { val: "09", label: "Sep" },
        { val: "10", label: "Oct" }, { val: "11", label: "Nov" }, { val: "12", label: "Dec" }
    ];

    // --- 🟢 Robust Double-Track Filtration Core Engine (Rate calculation removed) ---
    const { dailyOrderLogs, filteredOrders } = useMemo(() => {
        if (!orders || orders.length === 0) return { dailyOrderLogs: [], filteredOrders: [] };

        const counts = {};
        let matchedOrders = [];
        const todayObj = new Date();

        // 1. Build keys for the selected timeline
        if (isFilterActive) {
            if (selectedDay) {
                const targetDate = `${activeYear}-${activeMonth}-${selectedDay.padStart(2, '0')}`;
                counts[targetDate] = 0;
            } else {
                for (let d = 1; d <= totalDaysInMonth; d++) {
                    const targetDate = `${activeYear}-${activeMonth}-${String(d).padStart(2, '0')}`;
                    counts[targetDate] = 0;
                }
            }
        } else {
            const lookbackDays = 7;
            for (let i = lookbackDays - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(todayObj.getDate() - i);
                const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                counts[localDateStr] = 0;
            }
        }

        // 2. Filter orders
        matchedOrders = orders.filter(order => {
            if (counts[order.orderDate] !== undefined) {
                counts[order.orderDate] += 1;
                return true;
            }
            return false;
        });

        // 3. Format Logs
        const logs = Object.entries(counts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return { dailyOrderLogs: logs, filteredOrders: matchedOrders };
    }, [orders, isFilterActive, activeYear, activeMonth, selectedDay, totalDaysInMonth]);

    // Force clear state pipeline
    const resetToDefaultView = (e) => {
        e.stopPropagation();
        setActiveYear(currentYearStr);
        setActiveMonth(currentMonthStr);
        setSelectedDay('');
        setIsFilterActive(false);
        setIsCalendarOpen(false);
    };

    // Human readable text label controller
    const getLabelDisplay = () => {
        if (!isFilterActive) return "Last 7 Days (Live)";
        const monthLabel = monthsList.find(m => m.val === activeMonth)?.label || '';
        return selectedDay ? `${selectedDay} ${monthLabel}, ${activeYear}` : `${monthLabel} ${activeYear}`;
    };

    // Static layouts components mappings
    const financialCards = [
        { title: "Gross Invoiced", val: `$${(salesDetails?.grossSales || 0).toLocaleString()}`, color: "text-slate-900", icon: "lucide:layers" },
        { title: "Net Revenue Stream", val: `$${(salesDetails?.netSales || 0).toLocaleString()}`, color: "text-emerald-600", icon: "lucide:trending-up" },
        { title: "Accumulated Tax (5%)", val: `$${(salesDetails?.totalTax || 0).toLocaleString()}`, color: "text-amber-600", icon: "lucide:scale" },
        { title: "Total Shipping Collected", val: `$${(salesDetails?.totalShipping || 0).toLocaleString()}`, color: "text-blue-600", icon: "lucide:truck" },
        { title: "Platform Gateway Fees", val: `$${(salesDetails?.totalGatewayFees || 0).toLocaleString()}`, color: "text-rose-500", icon: "lucide:credit-card" }
    ];

    const growthCards = [
        {
            title: "Average Order Value (AOV)",
            val: `$${(salesDetails?.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            color: "text-indigo-600",
            icon: "lucide:shopping-bag"
        },
        {
            title: "Average Order Rate",
            val: `${salesDetails?.averageOrderRate || "0.0"} orders/day`, 
            color: "text-cyan-600",
            icon: "lucide:calendar-range"
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <Icon icon="lucide:loader-2" className="w-8 h-8 text-slate-400 animate-spin" />
                <span className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Compiling Financial Ledger...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 min-h-screen p-4 bg-[#fafafa] font-sans text-slate-800">

            {/* BREADCRUMB NAVIGATION */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/admin-dashboard')}
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-xs"
                >
                    <Icon icon="lucide:arrow-left" className="w-4 h-4 text-slate-700" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">Sales Metrics Center</h1>
                    <p className="text-xs text-slate-400 font-medium">Real-time store performance audit and user behavioral analytics.</p>
                </div>
            </div>

            {/* FINANCIAL CORE BLOCKS */}
            <div className="space-y-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial & Operations Core</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {financialCards.map((card, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.title}</span>
                                <span className={`text-base font-black ${card.color} block`}>{card.val}</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                                <Icon icon={card.icon} className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ANALYTICS BLOCKS */}
            <div className="space-y-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-commerce Growth Insights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {growthCards.map((card, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.title}</span>
                                <span className={`text-base font-black ${card.color} block`}>{card.val}</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                                <Icon icon={card.icon} className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FILTER TIMELINE DISPLAY AND POPOVER */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Volume Analysis Matrix</h2>
                        <p className="text-[11px] text-slate-400 font-medium">
                            {!isFilterActive ? "Currently displaying rolling latest 7 active session records." : `Showing data custom queried for ${getLabelDisplay()}.`}
                        </p>
                    </div>

                    {/* 📅 POPOVER MODULE */}
                    <div className="relative" ref={calendarRef}>
                        <div
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-xs cursor-pointer hover:border-slate-300 transition-all select-none"
                        >
                            <Icon icon="lucide:calendar" className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700 min-w-32.5">{getLabelDisplay()}</span>
                            <Icon icon="lucide:chevron-down" className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Frame window */}
                        {isCalendarOpen && (
                            <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-50 w-72 space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <select
                                        value={activeMonth}
                                        onChange={(e) => {
                                            setActiveMonth(e.target.value);
                                            setSelectedDay('');
                                            setIsFilterActive(true);
                                        }}
                                        className="text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 flex-1 outline-none text-slate-700"
                                    >
                                        {monthsList.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                                    </select>

                                    <select
                                        value={activeYear}
                                        onChange={(e) => {
                                            setActiveYear(e.target.value);
                                            setSelectedDay('');
                                            setIsFilterActive(true);
                                        }}
                                        className="text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 text-slate-700 outline-none"
                                    >
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>

                                    {isFilterActive && (
                                        <button
                                            onClick={resetToDefaultView}
                                            className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-200"
                                            title="Reset to rolling 7 days"
                                        >
                                            <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Matrix body block */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wide px-1">
                                        <span>Select Day</span>
                                        {selectedDay && (
                                            <button
                                                onClick={() => { setSelectedDay(''); }}
                                                className="text-indigo-600 hover:underline normal-case font-bold"
                                            >
                                                View Whole Month
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: totalDaysInMonth }, (_, i) => i + 1).map(day => (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    setSelectedDay(day.toString());
                                                    setIsFilterActive(true);
                                                    setIsCalendarOpen(false);
                                                }}
                                                className={`h-7 w-7 text-xs font-bold rounded-lg flex items-center justify-center transition-all ${selectedDay === day.toString() && isFilterActive
                                                    ? 'bg-black text-white shadow-md'
                                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-200/70'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* VISUAL CARDS RENDER STREAM */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs">
                    {dailyOrderLogs.length === 0 ? (
                        <div className="text-center py-6">
                            <Icon icon="lucide:calendar-x" className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                            <p className="text-xs text-slate-400 font-medium">No order metrics recorded for the chosen timeline scope.</p>
                        </div>
                    ) : (
                        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                            {dailyOrderLogs.map((log, index) => (
                                <div key={index} className="bg-slate-50/60 border border-slate-100 p-3 rounded-xl flex flex-col justify-between items-center text-center min-w-30.5 shrink-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        {isNaN(new Date(log.date).getTime()) ? log.date : new Date(log.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                    </span>
                                    <div className="my-1.5 flex items-baseline gap-1">
                                        <span className="text-lg font-black text-slate-800">{log.count}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Orders</span>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full ${log.count > 5 ? 'bg-emerald-500' : (log.count > 2 ? 'bg-amber-400' : 'bg-slate-300')}`}>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* AUDIT TABLE */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs space-y-4">
                <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Historical Audit Trails</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Individual ledger breakdown parameters calculated in real-time from active store sessions.</p>
                </div>
                <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse font-semibold">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="pb-3">Invoice Hash</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Customer Identity</th>
                                <th className="pb-3 text-right">Gross Invoiced</th>
                                <th className="pb-3 text-right">Tax (5%)</th>
                                <th className="pb-3 text-right text-blue-600">Shipping</th>
                                <th className="pb-3 text-right">Gateway Fee</th>
                                <th className="pb-3 text-right text-emerald-600">Net Settled</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-700">
                            {!filteredOrders || filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                                        No itemized records available for this selected frame.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 font-mono text-slate-400 text-[11px]">#{order.id ? order.id.slice(0, 10) : '---'}...</td>
                                        <td className="py-3 text-slate-500 font-normal">{order.orderDate}</td>
                                        <td className="py-3 text-slate-900 font-bold">{order.customerEmail}</td>
                                        <td className="py-3 text-right font-bold text-slate-800">${(order.grossAmount || 0).toLocaleString()}</td>
                                        <td className="py-3 text-right text-amber-600 font-medium">${order.calculatedTax || 0}</td>
                                        <td className="py-3 text-right text-blue-600 font-medium">${order.shippingCharge || 0}</td>
                                        <td className="py-3 text-right text-rose-400 font-medium">${order.gatewayFee || 0}</td>
                                        <td className="py-3 text-right text-emerald-600 font-black">${(order.netSettled || 0).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default SalesAnalytics;