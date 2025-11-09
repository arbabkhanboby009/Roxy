
import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import Icon from '../Icon';
import type { BankDetails, WalletDetails } from '../../types';

const AdminFinance: React.FC = () => {
    const { orders, expenses, payments, addExpense, addPayment, bankDetails, walletDetails, addBankDetails, deleteBankDetails, addWalletDetails, deleteWalletDetails } = useStore();
    const [expenseDesc, setExpenseDesc] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [paymentDesc, setPaymentDesc] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');

    const [newBank, setNewBank] = useState<Omit<BankDetails, 'id'>>({ bankName: '', accountTitle: '', accountNumber: '' });
    const [newWallet, setNewWallet] = useState<Omit<WalletDetails, 'id'>>({ walletName: '', accountTitle: '', walletNumber: '' });

    const totalIncome = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (expenseDesc && expenseAmount) {
            addExpense(expenseDesc, parseFloat(expenseAmount));
            setExpenseDesc('');
            setExpenseAmount('');
        }
    };

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentDesc && paymentAmount) {
            addPayment(paymentDesc, parseFloat(paymentAmount));
            setPaymentDesc('');
            setPaymentAmount('');
        }
    };
    
    const allTransactions = [
        ...payments.map(p => ({ type: 'Payment/Sale', date: p.date, description: p.description, amount: p.amount, isIncome: true })),
        ...expenses.map(e => ({ type: 'Expense', date: e.date, description: e.description, amount: e.amount, isIncome: false })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Finance Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-100 p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-green-800">Total Cash In</h3><p className="text-3xl font-bold text-green-900">PKR {totalIncome.toLocaleString()}</p></div>
                <div className="bg-red-100 p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-red-800">Total Cash Out</h3><p className="text-3xl font-bold text-red-900">PKR {totalExpenses.toLocaleString()}</p></div>
                <div className="bg-blue-100 p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-blue-800">Cash in Hand</h3><p className="text-3xl font-bold text-blue-900">PKR {netProfit.toLocaleString()}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <form onSubmit={handleAddPayment} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Add Cash In (Payment/Sale)</h3>
                    <input value={paymentDesc} onChange={(e) => setPaymentDesc(e.target.value)} placeholder="Description (e.g., Cash deposit)" className="w-full border p-2 rounded mb-2" required />
                    <input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} type="number" placeholder="Amount" className="w-full border p-2 rounded mb-2" required />
                    <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Add Cash In</button>
                </form>
                <form onSubmit={handleAddExpense} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Add Cash Out (Expense)</h3>
                    <input value={expenseDesc} onChange={(e) => setExpenseDesc(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-2" required />
                    <input value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} type="number" placeholder="Amount" className="w-full border p-2 rounded mb-2" required />
                    <button type="submit" className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Add Cash Out</button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Bank & Wallet Details</h3>
                    {bankDetails.map(b => <div key={b.id} className="text-sm mb-1 flex justify-between"><span>{b.bankName}: {b.accountNumber}</span><button onClick={() => deleteBankDetails(b.id)} className="text-red-500"><Icon name="trash" className="w-4 h-4"/></button></div>)}
                    {walletDetails.map(w => <div key={w.id} className="text-sm mb-1 flex justify-between"><span>{w.walletName}: {w.walletNumber}</span><button onClick={() => deleteWalletDetails(w.id)} className="text-red-500"><Icon name="trash" className="w-4 h-4"/></button></div>)}
                    <input value={newBank.bankName} onChange={e => setNewBank({...newBank, bankName: e.target.value})} placeholder="Bank Name" className="w-full border p-2 rounded mt-4 mb-2 text-sm"/>
                    <input value={newBank.accountTitle} onChange={e => setNewBank({...newBank, accountTitle: e.target.value})} placeholder="Account Title" className="w-full border p-2 rounded mb-2 text-sm"/>
                    <input value={newBank.accountNumber} onChange={e => setNewBank({...newBank, accountNumber: e.target.value})} placeholder="Account Number" className="w-full border p-2 rounded mb-2 text-sm"/>
                    <button onClick={() => addBankDetails(newBank)} className="w-full bg-gray-200 text-sm py-2 rounded">Add Bank</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                     <h3 className="font-bold text-lg mb-4 invisible">.</h3>
                     <input value={newWallet.walletName} onChange={e => setNewWallet({...newWallet, walletName: e.target.value})} placeholder="Wallet Name" className="w-full border p-2 rounded mt-4 mb-2 text-sm"/>
                     <input value={newWallet.accountTitle} onChange={e => setNewWallet({...newWallet, accountTitle: e.target.value})} placeholder="Account Title" className="w-full border p-2 rounded mb-2 text-sm"/>
                     <input value={newWallet.walletNumber} onChange={e => setNewWallet({...newWallet, walletNumber: e.target.value})} placeholder="Wallet Number" className="w-full border p-2 rounded mb-2 text-sm"/>
                    <button onClick={() => addWalletDetails(newWallet)} className="w-full bg-gray-200 text-sm py-2 rounded">Add Wallet</button>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">General Ledger</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTransactions.map((t, i) => (
                             <tr key={i} className="bg-white border-b">
                                <td className="px-6 py-4">{t.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                                <td className="px-6 py-4">{t.type}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${t.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.isIncome ? '+' : '-'} PKR {t.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {allTransactions.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No transactions recorded.</td></tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default AdminFinance;
