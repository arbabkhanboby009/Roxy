import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { getStyleRecommendations } from '../services/geminiService';
import Icon from './Icon';
import CompactProductCard from './CompactProductCard';
import type { Product } from '../types';

type Message = {
    id: number;
    role: 'user' | 'model';
    content: React.ReactNode;
}

const StyleAdvisor: React.FC = () => {
    const { products } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: Date.now(),
                role: 'model',
                content: "Hello! I'm Roxy, your AI Style Advisor. Describe the kind of shoes you're looking for, and I'll find the perfect pair for you!"
            }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userInput = input;
        const userMessage: Message = { id: Date.now(), role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await getStyleRecommendations(userInput, products);
            
            const recommendedProducts = result.product_ids
              .map(id => products.find(p => p.id === id))
              .filter((p): p is Product => p !== undefined);

            const modelContent = (
              <div>
                <p>{result.reply}</p>
                {recommendedProducts.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {recommendedProducts.map(p => <CompactProductCard key={p.id} product={p} onProductClick={() => setIsOpen(false)} />)}
                  </div>
                )}
              </div>
            );

            const modelMessage: Message = { id: Date.now() + 1, role: 'model', content: modelContent };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error(error);
            const errorMessage: Message = { id: Date.now() + 1, role: 'model', content: "I'm sorry, something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[60vh] max-h-[500px] bg-white rounded-xl shadow-2xl flex flex-col transition-transform duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100' : 'scale-0'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-3 bg-brand-pink rounded-t-xl">
                    <h3 className="font-serif font-bold text-lg text-brand-text">AI Style Advisor</h3>
                    <button onClick={() => setIsOpen(false)} className="text-brand-text hover:opacity-75"><Icon name="close" className="w-5 h-5"/></button>
                </div>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-br-none' : 'bg-gray-200 text-brand-text rounded-bl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl p-3 text-sm bg-gray-200 text-brand-text rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-brand-text rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-brand-text rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-brand-text rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center gap-2">
                    <input 
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="e.g. 'show me some comfy pink sneakers'"
                        className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-brand-dark-pink"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-brand-text text-white rounded-full p-2 disabled:bg-gray-300">
                        <Icon name="send" className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-6 right-4 sm:right-8 bg-brand-text text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                aria-label="Open AI Style Advisor"
            >
                <Icon name="sparkles" className="w-8 h-8"/>
            </button>
        </>
    );
};

export default StyleAdvisor;
