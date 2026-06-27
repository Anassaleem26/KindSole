import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import useSalesAnalytics from './Hooks/Sales record/useSalesAnalytics';

export default function DashboardOverview() {
    const [stats] = useState({ lowStockItems: 4 });
    const [activeMetrics, setActiveMetrics] = useState({ sales: true, orders: true, visits: true });
    
    const navigate = useNavigate();
    const { salesDetails, loading, chartData } = useSalesAnalytics();

    // Debugging line: Agar chart abhi bhi na dikhe toh browser console (F12) mein check karein data aa raha hai ya nahi
    console.log("Current Chart Data:", chartData);

    // Toggle function for chart metrics
    const toggleMetric = (metric) => {
        setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
    };

    // Clean Helper Function for Currency Formatting
    const formatUSD = (value) => {
        return Number(value || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fafafa]">
                <Icon icon="lucide:loader-2" className="w-8 h-8 text-slate-400 animate-spin" />
                <span className="text-xs font-bold text-slate-500 mt-3 uppercase tracking-widest">
                    Loading Dashboard Metrics...
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-800 p-1 min-h-screen w-full">

            {/* ----------------- TOP BREADCRUMB & FILTERS ----------------- */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">Dashboard Overview</h1>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
                        <Icon icon="lucide:chevron-down" className="w-4 h-4 text-slate-400 order-last" />
                        <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-slate-400" />
                        Global date-range
                    </button>
                    <button className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
                        <Icon icon="lucide:chevron-down" className="w-4 h-4 text-slate-400 order-last" />
                        <Icon icon="lucide:calendar" className="w-3.5 h-3.5 text-slate-400" />
                        Last 30 Days
                    </button>
                </div>
            </div>

            {/* ----------------- ROW 1: TRIPLE SECTION GRID ----------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

                {/* 1. SALES METRICS CARD */}
                <div
                    onClick={() => navigate('/admin-dashboard/sales-analytics')}
                    className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
                >
                    <div>
                        <span className="text-xs font-extrabold text-slate-900">Sales Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 flex-1 mt-4">
                        <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Gross sales</span>
                            <span className="text-base font-bold text-slate-900">${formatUSD(salesDetails?.grossSales)}</span>
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Net sales</span>
                            <span className="text-base font-bold text-slate-900">${formatUSD(salesDetails?.netSales)}</span>
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-1"></div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Tax</span>
                            <span className="text-sm font-bold text-slate-900">${formatUSD(salesDetails?.totalTax)}</span>
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Shipping sales</span>
                            <span className="text-sm font-bold text-slate-900">${formatUSD(salesDetails?.totalShipping)}</span>
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-1"></div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Average order Value</span>
                            <span className="text-sm font-bold text-slate-900">${formatUSD(salesDetails?.averageOrderValue)}</span>
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Average Order Rate</span>
                            <span className="text-sm font-bold text-slate-900">{formatUSD(salesDetails?.averageOrderRate)}%</span>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN PERFORMANCE CHART (FIXED: Added min-w-0) */}
                <div className="lg:col-span-5 min-w-0 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between w-full">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                        <div>
                            <h3 className="text-xs font-black text-slate-900 tracking-tight">Multi-Metric Performance</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-1 border border-slate-100 px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">Dimensions <Icon icon="lucide:chevron-down" className="w-3 h-3 text-slate-400" /></button>
                            <button className="flex items-center gap-1 border border-slate-100 px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">Comparison xd <Icon icon="lucide:chevron-down" className="w-3 h-3 text-slate-400" /></button>
                        </div>
                    </div>

                    {/* Metric Selector Tabs */}
                    <div className="flex items-center gap-2 mb-2 select-none">
                        <button 
                            onClick={() => toggleMetric('sales')}
                            className={`text-[10px] px-2 py-0.5 rounded font-black border transition-all duration-200 flex items-center gap-1 ${
                                activeMetrics.sales ? "bg-blue-50 text-blue-600 border-blue-100 shadow-xs" : "bg-slate-50 text-slate-400 border-slate-100 opacity-60 hover:opacity-100"
                            }`}
                        >
                            Sales <Icon icon="lucide:chevron-down" className="w-2.5 h-2.5" />
                        </button>
                        <button 
                            onClick={() => toggleMetric('orders')}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-all duration-200 flex items-center gap-1 ${
                                activeMetrics.orders ? "bg-rose-50 text-rose-600 border-rose-100 shadow-xs" : "bg-slate-50 text-slate-400 border-slate-100 opacity-60 hover:opacity-100"
                            }`}
                        >
                            Orders <Icon icon="lucide:chevron-down" className="w-2.5 h-2.5" />
                        </button>
                        <button 
                            onClick={() => toggleMetric('visits')}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-all duration-200 flex items-center gap-1 ${
                                activeMetrics.visits ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-xs" : "bg-slate-50 text-slate-400 border-slate-100 opacity-60 hover:opacity-100"
                            }`}
                        >
                            Visits <Icon icon="lucide:chevron-down" className="w-2.5 h-2.5" />
                        </button>
                    </div>

                    {/* Chart Container (FIXED: Added relative positioning) */}
                    <div className="h-56 w-full mt-2 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData || []} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                                <Tooltip />
                                {activeMetrics.sales && <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.03} fill="#3b82f6" />}
                                {activeMetrics.orders && <Area type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={1.5} fillOpacity={0.01} fill="#ef4444" />}
                                {activeMetrics.visits && <Area type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={1.5} fillOpacity={0.01} fill="#10b981" />}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. PRODUCT PERFORMANCE & INVENTORY */}
                <div className="lg:col-span-4 flex flex-col gap-4 w-full h-full">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-black text-slate-900 tracking-tight">Top Product Performances</h3>
                            <Icon icon="lucide:more-horizontal" className="text-slate-300" />
                        </div>
                        <div className="overflow-x-auto text-[10px] flex-1 flex flex-col justify-center">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 font-bold border-b border-slate-50">
                                        <th className="pb-1">Product</th>
                                        <th className="pb-1">Revenue</th>
                                        <th className="pb-1">Volume</th>
                                        <th className="pb-1">Profit margin</th>
                                    </tr>
                                </thead>
                                <tbody className="font-bold text-slate-700 divide-y divide-slate-50">
                                    <tr>
                                        <td className="py-1.5 text-slate-900">Product 1</td>
                                        <td className="py-1.5"><span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm block text-center">$2,450.00</span></td>
                                        <td className="py-1.5 text-center text-slate-500">28,266</td>
                                        <td className="py-1.5"><span className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm block text-center">23.80%</span></td>
                                    </tr>
                                    <tr>
                                        <td className="py-1.5 text-slate-900">Product 2</td>
                                        <td className="py-1.5"><span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-sm block text-center">$1,201.00</span></td>
                                        <td className="py-1.5 text-center text-slate-500">13,136</td>
                                        <td className="py-1.5"><span className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm block text-center">18.37%</span></td>
                                    </tr>
                                    <tr>
                                        <td className="py-1.5 text-slate-900">Product 3</td>
                                        <td className="py-1.5"><span className="bg-blue-400 text-white px-1.5 py-0.5 rounded-sm block text-center">$229.50</span></td>
                                        <td className="py-1.5 text-center text-slate-500">6,936</td>
                                        <td className="py-1.5"><span className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded-sm block text-center">11.88%</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-black text-slate-900 tracking-tight">Inventory Insights</h3>
                            <Icon icon="lucide:more-horizontal" className="text-slate-300" />
                        </div>
                        <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-bold flex-1 content-center">
                            <div className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> In-Stock</div>
                            <div className="text-right text-slate-900">675</div>
                            <div className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Low-Stock</div>
                            <div className="text-right text-slate-900">{stats.lowStockItems}</div>
                            <div className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Out-of-Stock</div>
                            <div className="text-right text-slate-900">0</div>
                            <div className="flex items-center gap-1.5 text-slate-400 font-bold"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Overstock</div>
                            <div className="text-right text-slate-900">10</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ----------------- ROW 2: BOTTOM TRIPLE GRID ----------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* RECENT ORDERS */}
                <div className="lg:col-span-6 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-900 tracking-tight">Recent Orders</h3>
                        <button className="text-[10px] border border-slate-200 px-2 py-0.5 rounded-md font-bold text-slate-500 flex items-center gap-1 bg-slate-50">
                            Filter monthly <Icon icon="lucide:chevron-down" />
                        </button>
                    </div>
                    <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left border-collapse font-bold">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold tracking-tight">
                                    <th className="pb-2">Order Value</th>
                                    <th className="pb-2">Payment Status</th>
                                    <th className="pb-2">Fulfillment S...</th>
                                    <th className="pb-2">Customer Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-slate-400 text-xs font-medium">No recent orders found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CUSTOMER ANALYTICS */}
                <div className="lg:col-span-3 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-900 tracking-tight">Customer Analytics</h3>
                        <Icon icon="lucide:more-horizontal" className="text-slate-300" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black border-b border-slate-50 pb-2">
                        <div><span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block mr-1"></span>New <div className="text-slate-900 text-xs mt-0.5">43.36</div></div>
                        <div><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block mr-1"></span>Return <div className="text-slate-400 text-xs mt-0.5">Churned</div></div>
                        <div><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>Active <div className="text-slate-900 text-xs mt-0.5">1.7</div></div>
                        <div><span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block mr-1"></span>Churn <div className="text-slate-400 text-xs mt-0.5">-</div></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center bg-slate-50/50 rounded-xl p-2 relative min-h-32">
                        <Icon icon="lucide:globe" className="w-24 h-24 text-blue-100 animate-pulse absolute" />
                        <span className="text-[10px] text-slate-400 font-bold mt-16 z-10">Avg. Purchase Frequency</span>
                    </div>
                </div>

                {/* CHANNEL & MARKETING */}
                <div className="lg:col-span-3 grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-slate-900 tracking-tight">Channel Performance</h3>
                            <Icon icon="lucide:more-horizontal" className="text-slate-300" />
                        </div>
                        <div className="space-y-2 text-[10px] font-bold">
                            <div>
                                <div className="flex justify-between text-slate-600 mb-0.5">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> direct</span>
                                    <span>$12,450.00</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[85%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-slate-600 mb-0.5">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span> email</span>
                                    <span>$375.0K</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-sky-400 h-full w-[40%]"></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 text-[10px]">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-slate-900 tracking-tight">Marketing & Discounts</h3>
                            <Icon icon="lucide:more-horizontal" className="text-slate-300" />
                        </div>
                        <div className="flex justify-between items-center border border-slate-100 p-1.5 rounded-lg bg-slate-50/50">
                            <div>
                                <span className="font-bold text-slate-800 block">Active Campaigns</span>
                                <span className="text-slate-400 text-[9px] font-medium block">Active campaigns</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">Active</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}