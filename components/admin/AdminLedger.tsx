import React, { useState, useMemo, useRef, KeyboardEvent } from 'react';
import { useStore } from '../../hooks/useStore';
import Icon from '../Icon';
import type { Payee, Transaction } from '../../types';
import { TransactionType, TransactionMethod } from '../../types';

const PrintableLedger: React.FC<{ transactions: any[], cashInHand: number, onClose: () => void }> = ({ transactions, cashInHand, onClose }) => {
    const { shopDetails } = useStore();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4 print:p-0 print:bg-white">
            <div className="printable-area bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-8 overflow-y-auto printable-content">
                    <div className="printable-header">
                        <div className="flex items-center gap-4">
                            {shopDetails.logo && <img src={shopDetails.logo} alt="logo" className="h-20 w-20 object-contain" />}
                            <div>
                                <h1 className="text-3xl font-bold">General Ledger</h1>
                                <p className="text-gray-500">{shopDetails.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="printable-header-placeholder"></div>
                    
                    <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-right">Income</th>
                                <th className="px-4 py-3 text-right">Expense</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t, i) => (
                                <tr key={i} className="bg-white border-b">
                                    <td className="px-4 py-2">{t.date.toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{t.description}</td>
                                    <td className="px-4 py-2 text-right text-green-600">{t.type === TransactionType.Income ? `PKR ${t.amount.toLocaleString()}` : '-'}</td>
                                    <td className="px-4 py-2 text-right text-red-600">{t.type === TransactionType.Expense ? `PKR ${t.amount.toLocaleString()}` : '-'}</td>
                                    <td className="px-4 py-2 text-right font-semibold">PKR {t.runningBalance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold bg-gray-50">
                                <td colSpan={4} className="px-4 py-3 text-right">Final Cash in Hand:</td>
                                <td className="px-4 py-3 text-right">PKR {cashInHand.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="no-print p-4 bg-gray-100 border-t flex justify-end gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm"><Icon name="download" className="w-4 h-4" /> Download PDF</button>
                    <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm"><Icon name="share" className="w-4 h-4" /> Share</button>
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm"><Icon name="print" className="w-4 h-4" /> Print</button>
                    <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm">Close</button>
                </div>
            </div>
             {isShareModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
                        <h3 className="text-lg font-bold mb-4">Share as PDF</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            To share the ledger as a PDF, please download it first using the "Download PDF" button. Then, you can share the saved file from your device.
                        </p>
                        <button onClick={() => setIsShareModalOpen(false)} className="bg-brand-primary text-white py-2 px-6 rounded-lg">OK</button>
                    </div>
                </div>
            )}
      </div>
    );
};


const AdminFinance: React.FC = () => {
    const { transactions, payees, payables, receivables, addTransaction, addPayee } = useStore();
    const [modal, setModal] = useState<'addPayment' | 'addExpense' | 'addPayee' | 'viewPayee' | 'generateLedger' | null>(null);
    const [currentPayee, setCurrentPayee] = useState<Payee | null>(null);

    const [newTx, setNewTx] = useState({ description: '', amount: 0, method: TransactionMethod.Cash, payeeId: '' });
    const [newPayee, setNewPayee] = useState<Omit<Payee, 'id'>>({ name: '', businessTitle: '', paymentPurpose: '', mobile: '', cnic: '' });

    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    const cashInHand = transactions.length > 0 ? transactions[transactions.length - 1].runningBalance : 0;
    const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
    const pendingReceivables = receivables.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);
    const pendingPayables = payables.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);


    const filteredTransactions = useMemo(() => {
        let txs = [...transactions];
        if (filter !== 'All') txs = txs.filter(t => t.type === filter);
        if (searchTerm) txs = txs.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()));
        
        txs.sort((a,b) => {
            const valA = sort.key === 'date' ? a.date.getTime() : a.amount;
            const valB = sort.key === 'date' ? b.date.getTime() : b.amount;
            return sort.direction === 'asc' ? valA - valB : valB - valA;
        });

        return txs;
    }, [transactions, filter, sort, searchTerm]);

    const handleAddTransaction = (type: TransactionType) => {
        if (!newTx.description || newTx.amount <= 0) {
            alert("Please provide a valid description and amount.");
            return;
        }
        addTransaction({ ...newTx, type });
        setNewTx({ description: '', amount: 0, method: TransactionMethod.Cash, payeeId: '' });
        setModal(null);
    };

    const handleAddPayee = () => {
        if (!newPayee.name || !newPayee.mobile) {
             alert("Please provide at least a name and mobile number.");
             return;
        }
        const createdPayee = addPayee(newPayee);
        setNewTx(prev => ({ ...prev, payeeId: createdPayee.id })); 
        setNewPayee({ name: '', businessTitle: '', paymentPurpose: '', mobile: '', cnic: '' });
        setModal(modal === 'addPayment' ? 'addPayment' : 'addExpense'); 
    };
    
    const handlePayeeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const payeeId = e.target.value;
        const selected = payees.find(p => p.id === payeeId);
        setNewTx(prev => ({ ...prev, payeeId, description: selected?.paymentPurpose || prev.description }));
    };

    const inputClass = "w-full border p-2 rounded bg-white text-black border-gray-300 focus:ring-1 focus:ring-brand-primary-dark focus:outline-none";

    const TransactionModal = () => {
        const isPayment = modal === 'addPayment';
        
        const payeeRef = useRef<HTMLSelectElement>(null);
        const descriptionRef = useRef<HTMLInputElement>(null);
        const amountRef = useRef<HTMLInputElement>(null);
        const methodRef = useRef<HTMLSelectElement>(null);
        const inputRefs = [payeeRef, descriptionRef, amountRef, methodRef];

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputRefs[index + 1];
                if (nextInput?.current) {
                    nextInput.current.focus();
                } else {
                    (e.target as HTMLElement).closest('form')?.requestSubmit();
                }
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                    <form onSubmit={e => { e.preventDefault(); handleAddTransaction(isPayment ? TransactionType.Income : TransactionType.Expense); }} className="p-6 space-y-4">
                        <h2 className="text-xl font-bold">{isPayment ? 'Add Payment Received' : 'Add Expense'}</h2>
                        
                        <div>
                            <label className="text-sm font-medium">Payee (Optional)</label>
                            <div className="flex gap-2">
                                <select ref={payeeRef} onKeyDown={e => handleKeyDown(e, 0)} value={newTx.payeeId} onChange={handlePayeeSelected} className={inputClass}>
                                    <option value="">Select a payee...</option>
                                    {payees.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <button type="button" onClick={() => setModal('addPayee')} className="bg-gray-200 px-3 rounded hover:bg-gray-300 text-sm">Add New</button>
                            </div>
                        </div>

                        <div><label className="text-sm font-medium">Description</label><input ref={descriptionRef} onKeyDown={e => handleKeyDown(e, 1)} value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} className={inputClass} required/></div>
                        <div><label className="text-sm font-medium">Amount</label><input ref={amountRef} onKeyDown={e => handleKeyDown(e, 2)} type="text" inputMode="decimal" pattern="[0-9]*\.?[0-9]+" value={newTx.amount || ''} onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value) || 0})} className={inputClass} required/></div>
                        
                        <div>
                             <label className="text-sm font-medium">Method</label>
                             <select ref={methodRef} onKeyDown={e => handleKeyDown(e, 3)} value={newTx.method} onChange={e => setNewTx({...newTx, method: e.target.value as TransactionMethod})} className={inputClass}>
                                 <option value={TransactionMethod.Cash}>Cash</option>
                                 <option value={TransactionMethod.Bank}>Bank</option>
                             </select>
                             <p className="text-xs text-gray-500 mt-1">{newTx.method === TransactionMethod.Cash ? 'This transaction will affect "Cash in Hand".' : 'Bank transactions are recorded but do not affect "Cash in Hand".'}</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setModal(null)} className="bg-gray-200 py-2 px-4 rounded">Cancel</button>
                            <button type="submit" className={`text-white py-2 px-4 rounded ${isPayment ? 'bg-green-600' : 'bg-red-600'}`}>Add Transaction</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    };
    
    const PayeeModal = () => {
        const nameRef = useRef<HTMLInputElement>(null);
        const titleRef = useRef<HTMLInputElement>(null);
        const purposeRef = useRef<HTMLInputElement>(null);
        const mobileRef = useRef<HTMLInputElement>(null);
        const cnicRef = useRef<HTMLInputElement>(null);
        const inputRefs = [nameRef, titleRef, purposeRef, mobileRef, cnicRef];

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputRefs[index + 1];
                if (nextInput?.current) {
                    nextInput.current.focus();
                } else {
                     (e.target as HTMLInputElement).form?.requestSubmit();
                }
            }
        };

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
                 <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                    <form onSubmit={e => {e.preventDefault(); handleAddPayee();}} className="p-6 space-y-3">
                         <h2 className="text-xl font-bold">Add New Payee</h2>
                         <div><label className="text-sm">Name</label><input ref={nameRef} onKeyDown={e => handleKeyDown(e, 0)} value={newPayee.name} onChange={e => setNewPayee({...newPayee, name: e.target.value})} className={inputClass} required /></div>
                         <div><label className="text-sm">Business Title</label><input ref={titleRef} onKeyDown={e => handleKeyDown(e, 1)} value={newPayee.businessTitle} onChange={e => setNewPayee({...newPayee, businessTitle: e.target.value})} className={inputClass} /></div>
                         <div><label className="text-sm">Default Payment Purpose</label><input ref={purposeRef} onKeyDown={e => handleKeyDown(e, 2)} value={newPayee.paymentPurpose} onChange={e => setNewPayee({...newPayee, paymentPurpose: e.target.value})} className={inputClass} /></div>
                         <div><label className="text-sm">Mobile</label><input ref={mobileRef} onKeyDown={e => handleKeyDown(e, 3)} value={newPayee.mobile} onChange={e => setNewPayee({...newPayee, mobile: e.target.value})} className={inputClass} required /></div>
                         <div><label className="text-sm">CNIC/ID</label><input ref={cnicRef} onKeyDown={e => handleKeyDown(e, 4)} value={newPayee.cnic} onChange={e => setNewPayee({...newPayee, cnic: e.target.value})} className={inputClass} /></div>
                         <div className="flex justify-end gap-3 pt-3">
                            <button type="button" onClick={() => setModal(newTx.type === TransactionType.Income ? 'addPayment' : 'addExpense')} className="bg-gray-200 py-2 px-4 rounded">Back</button>
                            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Save Payee</button>
                         </div>
                    </form>
                 </div>
             </div>
        );
    }
    
    const PayeeHistoryModal = () => {
        if (!currentPayee) return null;
        const payeeTransactions = transactions.filter(t => t.payeeId === currentPayee.id);
        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                 <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                     <div className="p-6 border-b">
                         <h2 className="text-xl font-bold">Transaction History for {currentPayee.name}</h2>
                         <p className="text-sm text-gray-500">{currentPayee.businessTitle}</p>
                     </div>
                     <div className="p-6 overflow-y-auto">
                        {payeeTransactions.length > 0 ? (
                           <table className="w-full text-sm">
                             {payeeTransactions.map(t => (
                                 <tr key={t.id} className="border-b">
                                     <td className="py-2">{t.date.toLocaleDateString()}</td>
                                     <td>{t.description}</td>
                                     <td className={`text-right font-semibold ${t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>PKR {t.amount.toLocaleString()}</td>
                                 </tr>
                             ))}
                           </table>
                        ) : <p className="text-gray-500 text-center">No transactions found for this payee.</p>}
                     </div>
                     <div className="p-4 bg-gray-50 border-t text-right">
                         <button onClick={() => setCurrentPayee(null)} className="bg-gray-200 py-2 px-4 rounded">Close</button>
                     </div>
                 </div>
             </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {modal && ['addPayment', 'addExpense'].includes(modal) && <TransactionModal />}
            {modal === 'addPayee' && <PayeeModal />}
            {currentPayee && <PayeeHistoryModal />}
            {modal === 'generateLedger' && <PrintableLedger transactions={filteredTransactions} cashInHand={cashInHand} onClose={() => setModal(null)} />}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">Finance Management</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-1 bg-green-100 p-4 rounded-lg shadow"><h3 className="text-md font-semibold text-green-800">Received Payments</h3><p className="text-2xl font-bold text-green-900">PKR {totalIncome.toLocaleString()}</p></div>
                <div className="lg:col-span-1 bg-red-100 p-4 rounded-lg shadow"><h3 className="text-md font-semibold text-red-800">Paid Expenses</h3><p className="text-2xl font-bold text-red-900">PKR {totalExpense.toLocaleString()}</p></div>
                <div className="lg:col-span-1 bg-blue-100 p-4 rounded-lg shadow"><h3 className="text-md font-semibold text-blue-800">Cash in Hand</h3><p className="text-2xl font-bold text-blue-900">PKR {cashInHand.toLocaleString()}</p></div>
                <div className="lg:col-span-1 bg-yellow-100 p-4 rounded-lg shadow"><h3 className="text-md font-semibold text-yellow-800">Pending Receivables</h3><p className="text-2xl font-bold text-yellow-900">PKR {pendingReceivables.toLocaleString()}</p></div>
                <div className="lg:col-span-1 bg-orange-100 p-4 rounded-lg shadow"><h3 className="text-md font-semibold text-orange-800">Pending Payables</h3><p className="text-2xl font-bold text-orange-900">PKR {pendingPayables.toLocaleString()}</p></div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Expense Sheet</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                     <button onClick={() => setModal('addPayment')} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Add Payment</button>
                     <button onClick={() => setModal('addExpense')} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Add Expense</button>
                     <button onClick={() => setModal('generateLedger')} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">Generate Ledger</button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <input type="text" placeholder="Search by ID or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inputClass} sm:w-auto flex-grow`} />
                    <select onChange={(e) => setFilter(e.target.value)} className={inputClass + ' sm:w-auto'}>
                        <option value="All">Filter: All</option>
                        <option value={TransactionType.Income}>Income</option>
                        <option value={TransactionType.Expense}>Expense</option>
                    </select>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Running Balance (Cash)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="bg-white border-b">
                                    <td className="px-6 py-4 text-xs text-gray-400">{t.id}</td>
                                    <td className="px-6 py-4">{t.date.toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${t.type === TransactionType.Income ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.type}</span></td>
                                    <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>PKR {t.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-mono">PKR {t.runningBalance.toLocaleString()}</td>
                                </tr>
                            ))}
                             {filteredTransactions.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No transactions match your criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Payee List</h2>
                 <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                             <tr>
                                 <th className="px-6 py-3">Name</th>
                                 <th className="px-6 py-3">Mobile</th>
                                 <th className="px-6 py-3">Purpose</th>
                                 <th className="px-6 py-3">Action</th>
                             </tr>
                         </thead>
                         <tbody>
                            {payees.map(p => (
                                <tr key={p.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4">{p.mobile}</td>
                                    <td className="px-6 py-4">{p.paymentPurpose}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => { setCurrentPayee(p); setModal('viewPayee'); }} className="text-blue-600 hover:underline text-xs">View History</button>
                                    </td>
                                </tr>
                            ))}
                             {payees.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No payees added yet.</td></tr>
                            )}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
};

export default AdminFinance;