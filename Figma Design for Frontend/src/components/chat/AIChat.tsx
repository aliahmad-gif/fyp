import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface AIChatProps {
  onBack: () => void;
}

export default function AIChat({ onBack }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your SmartfitaO AI assistant. I can help with measurements, tailor matching, order tracking, and product recommendations.",
      time: '9:40 AM',
    },
    {
      id: '2',
      sender: 'ai',
      text: 'How can I help you today?',
      time: '9:40 AM',
    },
    {
      id: '3',
      sender: 'user',
      text: "What's my order status?",
      time: '9:41 AM',
      status: 'read',
    },
    {
      id: '4',
      sender: 'ai',
      text: 'Order #TL-45892 is 70% complete. Expected delivery: Jan 8.',
      time: '9:41 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm here to help! Let me check that for you.",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Update message status
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 1000);
    }, 2000);
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
        <div className="size-10 rounded-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop"
            alt="SmartfitaO AI"
            className="size-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-[16px] text-[#080707] flex items-center gap-2">
            SmartfitaO AI
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
              AI
            </span>
          </h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2.5">
              <div className="flex gap-1">
                <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="size-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

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
            placeholder="Type your question..."
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
