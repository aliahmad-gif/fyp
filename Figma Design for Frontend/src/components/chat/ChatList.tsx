import { Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  type: 'ai' | 'tailor' | 'seller';
  message: string;
  time: string;
  avatar: string;
  isOnline?: boolean;
  unreadCount?: number;
  isMuted?: boolean;
}

interface ChatListProps {
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
  onBack: () => void;
}

export default function ChatList({ selectedContactId, onSelectContact, onBack }: ChatListProps) {
  const contacts: Contact[] = [
    {
      id: 'smartfitao',
      name: 'SmartfitaO',
      type: 'ai',
      message: 'The weather will be perfect for tailoring...',
      time: '9:41 AM',
      avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop',
      isOnline: true,
    },
    {
      id: 'ali-tanveer',
      name: 'Ali Tanveer (Tailor)',
      type: 'tailor',
      message: 'bhi mai pasy kam ker dydta hon',
      time: '9:16 AM',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      unreadCount: 80,
      isOnline: true,
    },
    {
      id: 'usman-khan',
      name: 'Usman Khan (Seller)',
      type: 'seller',
      message: 'You: Store is out of stock',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      isMuted: true,
    },
  ];

  return (
    <div className="h-full bg-[#F7F8FA] flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-[#080707]">Chats</h1>
          <button
            onClick={onBack}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-[#F7F8FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`w-full p-4 md:p-5 flex items-center gap-3 md:gap-4 transition-all hover:bg-white border-b border-gray-100 ${
              selectedContactId === contact.id
                ? 'bg-white border-l-4 border-l-blue-500'
                : contact.id === 'smartfitao'
                ? 'bg-[#E8F4FA]'
                : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="size-11 md:size-12 rounded-full overflow-hidden">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="size-full object-cover"
                />
              </div>
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-[15px] md:text-[16px] text-[#080707] truncate">
                  {contact.name}
                  {contact.type === 'ai' && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                      AI
                    </span>
                  )}
                </h3>
                <span className="text-xs md:text-sm text-gray-500 ml-2 shrink-0">
                  {contact.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-[14px] text-gray-600 truncate">
                  {contact.message}
                </p>
                {contact.unreadCount && (
                  <div className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0 min-w-[24px] text-center">
                    {contact.unreadCount}
                  </div>
                )}
                {contact.isMuted && (
                  <svg className="ml-2 size-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
