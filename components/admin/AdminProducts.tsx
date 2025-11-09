import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../hooks/useStore';
import type { Product, ProductVariant } from '../../types';
import Icon from '../Icon';
import { generateProductDescription, generateVideoAd } from '../../services/geminiService';
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
    const [searchTerm, setSearchTerm] = useState('');

    // State for Video Ad Generator
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [productForAd, setProductForAd] = useState<Product | null>(null);
    const [videoPrompt, setVideoPrompt] = useState('');
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [videoGenerationProgress, setVideoGenerationProgress] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [videoGenerationError, setVideoGenerationError] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState(false);

    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) {
            return products;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);
    
    useEffect(() => {
        if (editingProduct) {
            setFormData(editingProduct);
            setIsModalOpen(true);
        }
    }, [editingProduct]);
    
    useEffect(() => {
        const checkKey = async () => {
            // @ts-ignore
            if (window.aistudio) {
                // @ts-ignore
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        if (isVideoModalOpen) {
            checkKey();
        }
    }, [isVideoModalOpen]);

    const handleOpenModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: 0, category: 'Ladies', subcategory: CATEGORIES['Ladies'][0], sizes: [], colors: [], images: {}, stock: [] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            let newState = { ...prev, [name]: name === 'price' ? parseFloat(value) : value };
            if (name === 'category') {
                if (value === 'Ladies') {
                    newState.subcategory = CATEGORIES['Ladies'][0];
                } else { // Kids
                    const firstSubCat = Object.keys(CATEGORIES['Kids'])[0];
                    const firstSubCatItem = CATEGORIES['Kids'][firstSubCat as keyof typeof CATEGORIES['Kids']][0];
                    newState.subcategory = `${firstSubCat} - ${firstSubCatItem}`;
                }
            }
            return newState;
        });
    };

    const handleSubCategoryChange = (value: string) => {
        const [parentCat, subCat] = value.split(" - ");
        setFormData(prev => ({...prev, subcategory: subCat, category: parentCat}));
    };

    const handleMultiSelect = (type: 'sizes' | 'colors', value: string) => {
        setFormData(prev => {
            const current = prev[type] as string[];
            const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
            const newStock: ProductVariant[] = [];
            const newColors = type === 'colors' ? updated : prev.colors;
            const newSizes = type === 'sizes' ? updated : prev.sizes;
            newColors.forEach(c => newSizes.forEach(s => {
                const existingVariant = prev.stock.find(v => v.color === c && v.size === s);
                newStock.push({color: c, size: s, quantity: existingVariant?.quantity || 0 });
            }));
            return { ...prev, [type]: updated, stock: newStock };
        });
    };
    
    const handleStockChange = (color: string, size: string, quantity: number) => {
        setFormData(prev => ({ ...prev, stock: prev.stock.map(v => v.color === color && v.size === size ? { ...v, quantity: isNaN(quantity) ? 0 : quantity } : v) }));
    };

    const handleDescriptionGeneration = async () => {
        if(!formData.name) { alert("Please enter a product name first."); return; }
        setIsGenerating(true);
        const description = await generateProductDescription(formData.name, descKeywords);
        setFormData(prev => ({...prev, description}));
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Correctly set category based on subcategory before saving
        const finalFormData = { ...formData };
        if (Object.values(CATEGORIES.Kids.Boys).includes(finalFormData.subcategory)) {
            finalFormData.category = 'Boys';
        } else if (Object.values(CATEGORIES.Kids.Girls).includes(finalFormData.subcategory)) {
            finalFormData.category = 'Girls';
        } else {
            finalFormData.category = 'Ladies';
        }

        if (editingProduct) {
            updateProduct(finalFormData as Product);
        } else {
            addProduct(finalFormData);
        }
        handleCloseModal();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, color: string) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 3);
            const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            Promise.all(files.map(fileToDataUrl)).then(images => setFormData(prev => ({ ...prev, images: { ...prev.images, [color]: images } })));
        }
    };
    
    const handleOpenVideoModal = (product: Product) => {
        setProductForAd(product);
        setVideoPrompt(`A dynamic, 5-second video ad for "${product.name}". Show the shoe from multiple angles, highlighting its elegant design and texture. The style should be modern and chic.`);
        setIsGeneratingVideo(false);
        setGeneratedVideoUrl(null);
        setVideoGenerationError(null);
        setVideoGenerationProgress('');
        setIsVideoModalOpen(true);
    };

    const handleCloseVideoModal = () => {
        setIsVideoModalOpen(false);
        setProductForAd(null);
    };
    
    const handleSelectKey = async () => {
        // @ts-ignore
        if (window.aistudio) {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions
            setApiKeySelected(true);
        }
    };
    
    const handleGenerateVideo = async () => {
        if (!productForAd || !videoPrompt) return;

        setIsGeneratingVideo(true);
        setGeneratedVideoUrl(null);
        setVideoGenerationError(null);
        const progressMessages = [ "Warming up the AI director's chair...", "AI is storyboarding your ad...", "Rendering high-fashion pixels...", "Polishing the final cut...", "Almost ready for the premiere!" ];
        let messageIndex = 0;
        setVideoGenerationProgress(progressMessages[messageIndex]);
        const progressInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % progressMessages.length;
            setVideoGenerationProgress(progressMessages[messageIndex]);
        }, 8000);

        try {
            const firstColor = Object.keys(productForAd.images)[0];
            const imageUrl = productForAd.images[firstColor]?.[0];
            if (!imageUrl) throw new Error("Product does not have an image to generate a video from.");
            
            const mimeTypeMatch = imageUrl.match(/data:(.*?);/);
            if (!mimeTypeMatch || !mimeTypeMatch[1]) throw new Error("Could not determine image mime type.");
            
            const mimeType = mimeTypeMatch[1];
            const base64Data = imageUrl.split(',')[1];
            
            const videoUrl = await generateVideoAd(videoPrompt, base64Data, mimeType);
            const response = await fetch(videoUrl);
            const videoBlob = await response.blob();
            const localUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(localUrl);

        } catch (error) {
            const errorMessage = (error as Error).message;
            setVideoGenerationError(errorMessage);
            if (errorMessage.includes("re-select your API key")) {
                setApiKeySelected(false);
            }
        } finally {
            setIsGeneratingVideo(false);
            clearInterval(progressInterval);
            setVideoGenerationProgress('');
        }
    };

    const totalStock = (id: string) => products.find(p => p.id === id)?.stock.reduce((sum, v) => sum + v.quantity, 0) || 0;
    const inputClass = "w-full border p-2 rounded bg-white text-black border-gray-300 focus:ring-1 focus:ring-brand-dark-pink focus:outline-none";

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Items</h1>
                <button onClick={handleOpenModal} className="bg-brand-text text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center"><Icon name="plus" className="w-5 h-5 mr-2" /> Add Item</button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md border p-2 rounded bg-white text-black border-gray-300 focus:ring-1 focus:ring-brand-dark-pink focus:outline-none"
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ID</th><th className="px-6 py-3">Name</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Stock</th><th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{product.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4">PKR {product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">{product.category} / {product.subcategory}</td>
                                    <td className="px-6 py-4">{totalStock(product.id)}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-800"><Icon name="edit" /></button>
                                        <button onClick={() => window.confirm('Are you sure?') && deleteProduct(product.id)} className="text-red-600 hover:text-red-800"><Icon name="trash" /></button>
                                        <button onClick={() => handleOpenVideoModal(product)} className="text-green-600 hover:text-green-800" title="Generate Video Ad"><Icon name="film" /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No products match your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start py-10">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold">{editingProduct ? 'Edit' : 'Add'} Item</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label>Item Title</label><input name="name" value={formData.name} onChange={handleChange} className={inputClass} required /></div>
                                <div><label>Price</label><input name="price" type="number" value={formData.price} onChange={handleChange} className={inputClass} required /></div>
                            </div>
                            <div>
                                <label>Description Keywords (optional)</label>
                                <div className="flex items-center space-x-2">
                                <input value={descKeywords} onChange={(e) => setDescKeywords(e.target.value)} placeholder="e.g., comfortable, stylish, summer wear" className={inputClass} />
                                <button type="button" onClick={handleDescriptionGeneration} disabled={isGenerating} className="text-sm bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap">{isGenerating ? 'Generating...' : 'Generate with AI'}</button>
                                </div>
                            </div>
                            <div><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputClass} required /></div>
                            <div>
                                <label>Category</label>
                                <select name="subcategory" value={`${formData.category} - ${formData.subcategory}`} onChange={e => handleSubCategoryChange(e.target.value)} className={inputClass}>
                                    <optgroup label="Ladies">
                                        {CATEGORIES.Ladies.map(sub => <option key={sub} value={`Ladies - ${sub}`}>{sub}</option>)}
                                    </optgroup>
                                    {Object.entries(CATEGORIES.Kids).map(([parentCat, subCats]) => (
                                        <optgroup label={parentCat} key={parentCat}>
                                            {subCats.map(sub => <option key={sub} value={`${parentCat} - ${sub}`}>{sub}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
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
                                    <h3 className="font-bold mb-2">Stock Quantity</h3>
                                    <div className="overflow-x-auto border rounded-md">
                                        <table className="w-full text-sm text-center">
                                            <thead><tr className="bg-gray-50"><th className="p-2 border-r">Color</th>{formData.sizes.map(s => <th key={s} className="p-2">{s}</th>)}</tr></thead>
                                            <tbody>
                                                {formData.colors.map(c => (
                                                    <tr key={c} className="border-t">
                                                        <td className="p-2 font-medium border-r bg-gray-50">{c}</td>
                                                        {formData.sizes.map(s => (<td key={s} className="p-1"><input type="number" value={formData.stock.find(v => v.color === c && v.size === s)?.quantity || 0} onChange={(e) => handleStockChange(c, s, parseInt(e.target.value))} className="w-16 p-1 text-center border rounded bg-white text-black"/></td>))}
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
            
            {isVideoModalOpen && productForAd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                         <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">AI Video Ad Generator</h2>
                            {!apiKeySelected ? (
                                <div>
                                    <p className="text-sm text-gray-700 mb-2">To generate video ads using Google's advanced AI, you must select an API key.</p>
                                    <p className="text-xs text-gray-500 mb-4">This is a one-time setup. Usage fees may apply based on your Google AI plan. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Learn more about billing.</a></p>
                                    <button onClick={handleSelectKey} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Select API Key</button>
                                </div>
                            ) : (
                                <div>
                                    {!isGeneratingVideo && !generatedVideoUrl && (
                                        <div>
                                            <p className="text-sm mb-4">Generating an ad for: <strong className="font-semibold">{productForAd.name}</strong></p>
                                            <div>
                                                <label htmlFor="videoPrompt" className="block text-sm font-medium text-gray-700">Video Prompt</label>
                                                <textarea id="videoPrompt" value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} rows={4} className={inputClass} />
                                                <p className="text-xs text-gray-500 mt-1">Describe the video you want the AI to create.</p>
                                            </div>
                                        </div>
                                    )}

                                    {isGeneratingVideo && (
                                        <div className="text-center p-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-text mx-auto"></div>
                                            <p className="mt-4 font-semibold">Generating your video...</p>
                                            <p className="text-sm text-gray-600 mt-2 h-4">{videoGenerationProgress}</p>
                                        </div>
                                    )}
                                    
                                    {videoGenerationError && (
                                        <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                                            <p className="font-bold">Generation Failed</p>
                                            <p className="text-sm">{videoGenerationError}</p>
                                        </div>
                                    )}

                                    {generatedVideoUrl && (
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold mb-2">Your Ad is Ready!</h3>
                                            <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg shadow-inner aspect-[9/16] bg-black"></video>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end space-x-4 mt-6">
                                <button type="button" onClick={handleCloseVideoModal} className="bg-gray-300 py-2 px-4 rounded-lg">Close</button>
                                {apiKeySelected && !isGeneratingVideo && (
                                    generatedVideoUrl ? (
                                        <a href={generatedVideoUrl} download={`${productForAd.id}-ad.mp4`} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2">
                                            <Icon name="download" className="w-5 h-5" /> Download Video
                                        </a>
                                    ) : (
                                        <button onClick={handleGenerateVideo} className="bg-brand-text text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Generate</button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminItems;