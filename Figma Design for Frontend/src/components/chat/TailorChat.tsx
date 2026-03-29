import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Plus, FileText, Package } from 'lucide-react';
import { sendMessageToFirestore } from '../../database-firebase-postgresql';

interface Message {
  id: string;
  sender: 'user' | 'tailor';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'size-chart' | 'product';
    name: string;
  };
}

interface TailorChatProps {
  onBack: () => void;
  onOpenSizeChart: () => void;
}

export default function TailorChat({ onBack, onOpenSizeChart }: TailorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      text: 'Can you adjust the sleeve length?',
      time: '9:10 AM',
      status: 'read',
    },
    {
      id: '2',
      sender: 'tailor',
      text: 'Yes, please send your measurements',
      time: '9:11 AM',
    },
    {
      id: '3',
      sender: 'user',
      text: "What's the timeline?",
      time: '9:12 AM',
      status: 'read',
    },
    {
      id: '4',
      sender: 'tailor',
      text: '7-10 days after measurements',
      time: '9:13 AM',
    },
    {
      id: '5',
      sender: 'user',
      text: 'Can I see examples?',
      time: '9:14 AM',
      status: 'read',
    },
    {
      id: '6',
      sender: 'tailor',
      text: 'Sending some designs...',
      time: '9:15 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
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
      receiver: 'tailor',
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

  const handleSendSizeChart = () => {
    setShowAttachmentMenu(false);
    onOpenSizeChart();
  };

  const handleSendProductPreview = () => {
    setShowAttachmentMenu(false);
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: 'Product preview',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'sent',
      attachment: {
        type: 'product',
        name: 'Red Shalwar Kameez',
      },
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="h-full bg-white flex flex-col relative">
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
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
            alt="Ali Tanveer"
            className="size-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-[16px] text-[#080707] flex items-center gap-2">
            Ali Tanveer (Tailor)
            <span className="text-xs text-yellow-500">⭐ 4.5</span>
          </h2>
          <p className="text-xs text-gray-500">Last seen 2 minutes ago</p>
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
              className={`w-auto max-w-[85%] sm:max-w-[80%] lg:max-w-[500px] rounded-2xl px-4 py-2.5 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {message.attachment && (
                <div className="mb-2 p-3 bg-white/10 rounded-lg flex items-center gap-2">
                  {message.attachment.type === 'size-chart' ? (
                    <FileText className="size-5" />
                  ) : (
                    <Package className="size-5" />
                  )}
                  <span className="text-sm">{message.attachment.name}</span>
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

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div className="absolute bottom-20 left-4 md:left-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 w-[260px]">
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Attach Content</h3>
            <button
              onClick={() => setShowAttachmentMenu(false)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <div className="p-2">
            <button
              onClick={handleSendSizeChart}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="size-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Send Size Chart</span>
            </button>
            <button
              onClick={handleSendProductPreview}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="size-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Send Product Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="size-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Plus className="size-5 text-gray-600" />
          </button>
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