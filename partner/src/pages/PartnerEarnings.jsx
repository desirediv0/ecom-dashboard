import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DollarSign,
    Calendar,
    Ticket,
    TrendingUp,
    Download,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/apiService';

const PartnerEarnings = () => {
    const [earnings, setEarnings] = useState([]);
    const [summary, setSummary] = useState({
        totalEarnings: 0,
        monthlyEarnings: 0,
        totalOrders: 0,
        averageCommission: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    const fetchEarnings = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('partnerToken');

            if (!token) {
                toast.error('Please login first');
                return;
            }

            const response = await apiService.getEarnings(selectedPeriod);

            if (response.success) {
                setEarnings(response.data.earnings);
                setSummary(response.data.summary);
            } else {
                toast.error(response.message || 'Failed to fetch earnings');
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
            toast.error(error.message || 'Failed to fetch earnings data');
        } finally {
            setIsLoading(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading earnings data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#DE7A3E] to-[#7596DB] rounded-xl p-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Earnings 💰</h1>
                        <p className="text-orange-100 text-lg">
                            Track your commission earnings and payouts from Genuine Nutrition.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-3 py-2 bg-white/20 text-white border border-white/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            <option value="all" className="text-gray-900">All Time</option>
                            <option value="today" className="text-gray-900">Today</option>
                            <option value="week" className="text-gray-900">This Week</option>
                            <option value="month" className="text-gray-900">This Month</option>
                            <option value="year" className="text-gray-900">This Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(summary.totalEarnings)}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(summary.monthlyEarnings)}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {summary.totalOrders}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Ticket className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg Commission</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {summary.averageCommission.toFixed(1)}%
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <TrendingUp className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Earnings List */}
            <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        Recent Earnings
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {earnings.length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Earnings Yet</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Your earnings will appear here once customers start using your coupons to make purchases.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left p-4 font-semibold text-gray-900">Order ID</th>
                                        <th className="text-left p-4 font-semibold text-gray-900">Coupon</th>
                                        <th className="text-left p-4 font-semibold text-gray-900">Order Amount</th>
                                        <th className="text-left p-4 font-semibold text-gray-900">Commission</th>
                                        <th className="text-left p-4 font-semibold text-gray-900">Earnings</th>
                                        <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earnings.map((earning) => (
                                        <tr key={earning.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <span className="font-medium text-blue-600">#{earning.orderNumber}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {earning.couponCode || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatCurrency(earning.orderAmount)}</td>
                                            <td className="p-4">{earning.commission}%</td>
                                            <td className="p-4">
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(earning.earningAmount)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {formatDate(earning.date)}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PartnerEarnings;
