import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Store } from 'lucide-react';
import { sendMessageToFirestore } from '../../database-firebase-postgresql';

interface Message {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  product?: {
    name: string;
    price: string;
    image: string;
    stock: string;
  };
}

interface SellerChatProps {
  onBack: () => void;
}

export default function SellerChat({ onBack }: SellerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      text: 'Store is out of stock',
      time: 'Yesterday',
      status: 'read',
    },
    {
      id: '2',
      sender: 'seller',
      text: 'Yes, will restock tomorrow',
      time: 'Yesterday',
    },
    {
      id: '3',
      sender: 'user',
      text: 'What colors available?',
      time: '9:00 AM',
      status: 'read',
    },
    {
      id: '4',
      sender: 'seller',
      text: 'Red, Blue, Black',
      time: '9:01 AM',
    },
    {
      id: '5',
      sender: 'seller',
      text: 'Sending swatches...',
      time: '9:02 AM',
    },
    {
      id: '6',
      sender: 'user',
      text: 'Price?',
      time: '9:05 AM',
      status: 'read',
    },
    {
      id: '7',
      sender: 'seller',
      text: '$49.99 each',
      time: '9:06 AM',
      product: {
        name: 'Premium Fabric - Cotton Blend',
        price: '$49.99',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea2f8db7?w=200&h=200&fit=crop',
        stock: 'In Stock',
      },
    },
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    sendMessageToFirestore({
      sender: 'User',
      receiver: 'Seller',
      text: inputText,
      source: 'figma',
    }).catch((e) => console.warn('sendMessageToFirestore:', e));

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 1000);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="size-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Store className="size-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-[16px] text-[#080707] flex items-center gap-2">
            Usman Khan (Seller)
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              Store
            </span>
          </h2>
          <p className="text-xs text-gray-500">Usually replies in 1 hour</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            Today
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] md:max-w-[500px] rounded-2xl px-4 py-2.5 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {/* Product Preview */}
              {message.product && (
                <div className="mb-3 bg-white rounded-lg overflow-hidden">
                  <img
                    src={message.product.image}
                    alt={message.product.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      {message.product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {message.product.price}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {message.product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[14px] md:text-[15px] leading-relaxed">{message.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span
                  className={`text-xs ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.time}
                </span>
                {message.sender === 'user' && message.status && (
                  <span className="text-xs">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && (
                      <span className="text-blue-200">✓✓</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="size-11 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full transition-colors"
          >
            <Send className="size-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
