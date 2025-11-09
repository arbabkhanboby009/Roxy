
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../hooks/useStore';
import type { Product, ProductVariant } from '../../types';
import Icon from '../Icon';
import { generateProductDescription } from '../../services/geminiService';
import { CATEGORIES, PAKISTANI_SHOE_SIZES, AVAILABLE_COLORS } from '../../constants';

const AdminItems: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'addedDate'>>({
        name: '', description: '', price: 0, category: 'Ladies', subcategory: CATEGORIES['Ladies'][0], sizes: [], colors: [], images: {}, stock: []
    });
    const [descKeywords, setDescKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    useEffect(() => {
        if (editingProduct) {
            setFormData(editingProduct);
            setIsModalOpen(true);
        }
    }, [editingProduct]);

    const handleOpenModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: 0, category: 'Ladies', subcategory: CATEGORIES['Ladies'][0], sizes: [], colors: [], images: {}, stock: [] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleMultiSelect = (type: 'sizes' | 'colors', value: string) => {
        setFormData(prev => {
            const current = prev[type] as string[];
            const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
            
            const newStock: ProductVariant[] = [];
            const newColors = type === 'colors' ? updated : prev.colors;
            const newSizes = type === 'sizes' ? updated : prev.sizes;
            
            newColors.forEach(c => {
                newSizes.forEach(s => {
                    const existingVariant = prev.stock.find(v => v.color === c && v.size === s);
                    newStock.push({color: c, size: s, quantity: existingVariant?.quantity || 0 });
                })
            });

            return { ...prev, [type]: updated, stock: newStock };
        });
    };
    
    const handleStockChange = (color: string, size: string, quantity: number) => {
        setFormData(prev => {
            const updatedStock = prev.stock.map(variant => 
                variant.color === color && variant.size === size ? { ...variant, quantity: isNaN(quantity) ? 0 : quantity } : variant
            );
            return { ...prev, stock: updatedStock };
        });
    };

    const handleDescriptionGeneration = async () => {
        if(!formData.name) {
            alert("Please enter a product name first.");
            return;
        }
        setIsGenerating(true);
        const description = await generateProductDescription(formData.name, descKeywords);
        setFormData(prev => ({...prev, description}));
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            updateProduct(formData as Product);
        } else {
            addProduct(formData);
        }
        handleCloseModal();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, color: string) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 3);
            const fileToDataUrl = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            };
            Promise.all(files.map(fileToDataUrl)).then(newBase64Images => {
                setFormData(prev => ({
                    ...prev,
                    images: { ...prev.images, [color]: newBase64Images }
                }));
            });
        }
    };

    const subcategories = CATEGORIES[formData.category as keyof typeof CATEGORIES] || [];
    const totalStock = (id: string) => products.find(p => p.id === id)?.stock.reduce((sum, v) => sum + v.quantity, 0) || 0;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Items</h1>
                <button onClick={handleOpenModal} className="bg-brand-text text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center"><Icon name="plus" className="w-5 h-5 mr-2" /> Add Item</button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Stock</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white border-b">
                                <td className="px-6 py-4">{product.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4">PKR {product.price.toLocaleString()}</td>
                                <td className="px-6 py-4">{product.category} / {product.subcategory}</td>
                                <td className="px-6 py-4">{totalStock(product.id)}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-800"><Icon name="edit" /></button>
                                    <button onClick={() => window.confirm('Are you sure?') && deleteProduct(product.id)} className="text-red-600 hover:text-red-800"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start py-10">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold">{editingProduct ? 'Edit' : 'Add'} Item</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label>Item Title</label><input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
                                <div><label>Price</label><input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
                            </div>
                            
                            <div>
                                <label>Description Keywords (optional)</label>
                                <div className="flex items-center space-x-2">
                                <input value={descKeywords} onChange={(e) => setDescKeywords(e.target.value)} placeholder="e.g., comfortable, stylish, summer wear" className="w-full border p-2 rounded" />
                                <button type="button" onClick={handleDescriptionGeneration} disabled={isGenerating} className="text-sm bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap">
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                                </div>
                            </div>

                            <div><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border p-2 rounded" required /></div>
                           
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded"><option>Ladies</option><option>Kids</option></select></div>
                                <div><label>Subcategory</label><select name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full border p-2 rounded">{subcategories.map(s=><option key={s}>{s}</option>)}</select></div>
                            </div>

                            <div>
                                <label className="font-bold">Colors</label>
                                <div className="flex flex-wrap gap-2 mt-1 p-2 border rounded-md">{AVAILABLE_COLORS.map(c => <button type="button" key={c} onClick={() => handleMultiSelect('colors', c)} className={`px-3 py-1 border rounded-full text-sm ${formData.colors.includes(c) ? 'bg-brand-text text-white' : ''}`}>{c}</button>)}</div>
                            </div>
                            <div>
                                <label className="font-bold">Sizes</label>
                                <div className="flex flex-wrap gap-2 mt-1 p-2 border rounded-md">{PAKISTANI_SHOE_SIZES.map(s => <button type="button" key={s} onClick={() => handleMultiSelect('sizes', s)} className={`px-3 py-1 border rounded-full text-sm ${formData.sizes.includes(s) ? 'bg-brand-text text-white' : ''}`}>{s}</button>)}</div>
                            </div>
                            
                            {formData.colors.length > 0 && formData.sizes.length > 0 && (
                                <div>
                                    <h3 className="font-bold mb-2">Quantity for each Color-Size combination</h3>
                                    <div className="overflow-x-auto border rounded-md">
                                        <table className="w-full text-sm text-center">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="p-2 border-r">Color</th>
                                                    {formData.sizes.map(s => <th key={s} className="p-2">{s}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.colors.map(c => (
                                                    <tr key={c} className="border-t">
                                                        <td className="p-2 font-medium border-r bg-gray-50">{c}</td>
                                                        {formData.sizes.map(s => (
                                                            <td key={s} className="p-1">
                                                                <input type="number" value={formData.stock.find(v => v.color === c && v.size === s)?.quantity || 0} onChange={(e) => handleStockChange(c, s, parseInt(e.target.value))} className="w-16 p-1 text-center border rounded"/>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                             {formData.colors.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-bold">Upload Images (up to 3 per color)</h3>
                                    {formData.colors.map(color => (
                                        <div key={color} className="p-3 border rounded-md">
                                            <label className="font-semibold">{color}</label>
                                            <div className="flex items-center gap-2 mt-2">
                                                {(formData.images[color] || []).map((img, i) => <img key={i} src={img} className="w-16 h-16 object-cover rounded"/>)}
                                                 <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, color)} className="text-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             )}

                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-300 py-2 px-4 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-brand-text text-white py-2 px-4 rounded-lg">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminItems;
