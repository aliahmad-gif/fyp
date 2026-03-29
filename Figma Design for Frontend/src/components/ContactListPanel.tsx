import svgPaths from "../imports/svg-96wpm6to0m";

interface Contact {
  name: string;
  message: string;
  time: string;
  avatar: string;
  isOnline?: boolean;
  unreadCount?: number;
  isMuted?: boolean;
  isSelected?: boolean;
}

interface ContactListPanelProps {
  selectedContact: string | null;
  onSelectContact: (name: string) => void;
  onBack: () => void;
}

export default function ContactListPanel({ selectedContact, onSelectContact, onBack }: ContactListPanelProps) {
  const contacts: Contact[] = [
    {
      name: 'SmartfitaO',
      message: 'The weather will be perfect for th...',
      time: '9:41 AM',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      isSelected: selectedContact === 'SmartfitaO',
    },
    {
      name: 'Ali Tanveer (Tailor)',
      message: 'bhi mai pasy kam ker dydta hon',
      time: '9:16 AM',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      unreadCount: 80,
      isSelected: selectedContact === 'Ali Tanveer (Tailor)',
    },
    {
      name: 'Usman Khan (Seller)',
      message: 'You: Store is out of stock',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      isMuted: true,
      isSelected: selectedContact === 'Usman Khan (Seller)',
    },
    {
      name: 'Maria Rodriguez',
      message: 'Hello! I can help you with your wedding gown.',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1760278245703-0be8320c5eb1?w=100&h=100&fit=crop',
      isSelected: selectedContact === 'Maria Rodriguez',
    },
  ];

  return (
    <div className="bg-white h-full w-full flex flex-col">
      {/* Header with Back Arrow and Search */}
      <div className="bg-white h-[60px] border-b border-[#dbdde1] px-4 flex items-center gap-3">
        {/* Back Arrow */}
        <button
          onClick={onBack}
          className="size-[24px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="block size-full" fill="none" viewBox="0 0 24 24">
            <path d="M9 14L4 9L9 4" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M4 9H20" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        {/* Search Input */}
        <div className="flex-1 bg-white border border-[#dbdde1] rounded-[20px] px-4 py-2 flex items-center gap-2">
          <svg className="size-[20px] text-[#747881]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-[16px] text-[#747881] font-['Roboto'] bg-transparent"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact, index) => (
          <button
            key={index}
            onClick={() => onSelectContact(contact.name)}
            className={`w-full px-2 py-3 flex items-center gap-2 transition-colors hover:bg-gray-50 ${contact.isSelected ? 'bg-[#dbdde1]' : 'bg-white'
              }`}
          >
            {/* Avatar */}
            <div className="relative size-[49px] rounded-full overflow-hidden shrink-0">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="size-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              {/* Name and Time Row */}
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-['Roboto'] font-medium text-[16px] text-[#080707] truncate">
                  {contact.name}
                </p>
                <p className="font-['Roboto'] text-[14px] text-[#747881] shrink-0 ml-2">
                  {contact.time}
                </p>
              </div>

              {/* Message and Badge Row */}
              <div className="flex items-center justify-between">
                <p className="font-['Roboto'] text-[14px] text-[#747881] truncate">
                  {contact.message}
                </p>

                {/* Unread Badge or Mute Icon */}
                {contact.unreadCount && (
                  <div className="bg-[#ff3742] rounded-full px-2 py-0.5 ml-2 shrink-0">
                    <p className="font-['Roboto'] font-bold text-[12px] text-white leading-tight">
                      {contact.unreadCount}
                    </p>
                  </div>
                )}

                {contact.isMuted && (
                  <div className="ml-2 shrink-0">
                    <svg className="size-[20px]" fill="#747881" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
