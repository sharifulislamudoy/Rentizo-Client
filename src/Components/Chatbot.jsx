import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Rentizo assistant. I can help you find cars, check availability, explain our rental process, or answer any questions about our services!",
            sender: 'bot'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            
            if (!apiKey) {
                throw new Error('API key not configured');
            }

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    messages: [
                        {
                            role: 'system',
                            content: `You are Rentizo AI assistant for a car rental website. Help users with:

                            About Rentizo:
                            - Premium car rental service with 500+ vehicles
                            - 24/7 customer support
                            - 5-star rated service
                            - 0% hidden fees
                            - Digital rental process
                            - Locations across major cities

                            Services:
                            - Daily, weekly, monthly rentals
                            - Luxury and economy cars
                            - Instant booking
                            - Doorstep delivery available
                            - Insurance included

                            How to book:
                            1. Search available cars
                            2. Select dates and location
                            3. Complete digital verification
                            4. Get instant confirmation
                            5. Pick up or get delivery

                            Keep responses helpful, friendly, and under 150 words. Focus on car rental assistance, availability, pricing, and process.`
                        },
                        {
                            role: 'user',
                            content: inputMessage
                        }
                    ],
                    model: 'llama-3.1-8b-instant',
                    temperature: 0.7,
                    max_tokens: 1024,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const botMessage = {
                id: messages.length + 2,
                text: response.data.choices[0].message.content,
                sender: 'bot'
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error calling Groq API:', error);
            
            let errorText = "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team directly at support@rentizo.com";
            
            if (error.message === 'API key not configured') {
                errorText = "I'm currently experiencing configuration issues. Please contact our support team for assistance.";
            } else if (error.response?.status === 401) {
                errorText = "Authentication issue. Please contact support if this continues.";
            } else if (error.response?.status === 429) {
                errorText = "I'm getting too many requests right now. Please wait a moment and try again.";
            }
            
            const errorMessage = {
                id: messages.length + 2,
                text: errorText,
                sender: 'bot'
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickQuestions = [
        "How to book a car?",
        "What's included in rental?",
        "Available luxury cars?",
        "24/7 support?"
    ];

    return (
        <>
            {/* Chatbot Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                
                {/* AI Badge */}
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white font-bold">
                    AI
                </div>
            </motion.button>

            {/* Chatbot Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-24 top-10 right-6 z-50 w-96 h-[500px] bg-gray-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-2xl text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        {/* AI Indicator in Header */}
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full border border-white font-bold">
                                            AI
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-bold">Rentizo Assistant</h3>
                                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                AI
                                            </span>
                                        </div>
                                        <p className="text-xs opacity-90">AI Assistant • Online • Ready to help</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-3 ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                                                : 'bg-gray-800 text-white rounded-bl-none border border-white/10'
                                        }`}
                                    >
                                        {message.sender === 'bot' && (
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                    AI
                                                </span>
                                                <span className="text-xs text-gray-300">Rentizo Assistant</span>
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 text-white rounded-2xl rounded-bl-none p-3 border border-white/10">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                AI
                                            </span>
                                            <span className="text-xs text-gray-300">Rentizo Assistant</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2">
                                <p className="text-xs text-gray-400 mb-2">Quick questions for AI:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setInputMessage(question);
                                                setTimeout(() => handleSendMessage(), 100);
                                            }}
                                            className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-full border border-white/10 transition-colors"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-gray-900 rounded-b-2xl">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask our AI about car rentals..."
                                    className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-3 hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-2">
                                Powered by Rentizo AI • 24/7 Support
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;