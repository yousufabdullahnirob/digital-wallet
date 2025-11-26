import React, { useState, useEffect } from 'react';
import api from '../api';
import { DollarSign, Plus, TrendingUp, Calendar, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, TrendingDown } from 'lucide-react';

const ExpenseTracker = () => {
    const [stats, setStats] = useState({ total_amount: 0, recent: [] });
    const [transactionType, setTransactionType] = useState('expense'); // 'expense' or 'income'
    const [newExpense, setNewExpense] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('expenses/stats/');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('expenses/', { ...newExpense, transaction_type: transactionType });
            setNewExpense({
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchExpenses(); // Refresh stats
        } catch (error) {
            console.error('Error adding transaction:', error);
            if (error.response) {
                console.error('Server Error Data:', error.response.data);
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border border-slate-100 dark:border-neutral-700 h-full flex flex-col overflow-hidden relative group">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 group-hover:opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none transition-opacity duration-500 group-hover:opacity-70"></div>

            {/* Header / Card Section */}
            <div className="p-6 pb-2 relative z-10">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    {/* Card Shine Effect */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-8">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Wallet size={20} className="text-emerald-400" />
                        </div>
                        <CreditCard size={20} className="text-white/20" />
                    </div>

                    <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Balance</p>
                        <h2 className="text-3xl font-bold tracking-tight flex items-baseline gap-1">
                            <span className="text-emerald-400">$</span>
                            {stats.total_amount?.toFixed(2) || '0.00'}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Transaction Type Toggle */}
            <div className="px-6 pt-2 flex gap-2 relative z-10">
                <button
                    onClick={() => setTransactionType('expense')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${transactionType === 'expense'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 ring-2 ring-rose-500/20'
                        : 'bg-slate-50 text-slate-500 dark:bg-neutral-900/50 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                >
                    Expense
                </button>
                <button
                    onClick={() => setTransactionType('income')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${transactionType === 'income'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 text-slate-500 dark:bg-neutral-900/50 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                >
                    Income
                </button>
            </div>

            {/* Quick Add Form */}
            <div className="px-6 py-4 relative z-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1 group/input min-w-0">
                            <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors ${transactionType === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                <DollarSign size={16} />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all dark:text-white font-medium"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Category"
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            className="flex-[1.5] px-4 py-2.5 bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all dark:text-white min-w-0"
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all dark:text-white text-slate-500"
                            required
                        />
                        <button
                            type="submit"
                            className={`px-6 py-2.5 text-white rounded-xl shadow-lg transition-all active:scale-95 shrink-0 font-medium flex items-center gap-2 ${transactionType === 'income'
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/30'
                                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 hover:shadow-rose-500/30'
                                }`}
                            title={`Add ${transactionType}`}
                        >
                            <Plus size={18} />
                            <span>Add</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Transactions</h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-neutral-700 text-slate-500 px-2 py-0.5 rounded-full">Last 5</span>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    ) : stats.recent && stats.recent.length > 0 ? (
                        stats.recent.map((expense, index) => {
                            const isIncome = expense.transaction_type === 'income';
                            return (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700/50 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group/item animate-in slide-in-from-bottom-2 fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isIncome
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'
                                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'
                                            }`}>
                                            {isIncome ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{expense.category}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {expense.date}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {isIncome ? '+' : '-'}${expense.amount}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-neutral-700 rounded-xl">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                                <DollarSign size={20} />
                            </div>
                            <p className="text-slate-400 text-sm">No transactions yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
