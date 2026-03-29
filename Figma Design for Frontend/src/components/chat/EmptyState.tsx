import { MessageCircle } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="h-full bg-white flex items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="size-24 md:size-32 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircle className="size-12 md:size-16 text-gray-300" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
          Select a chat to start messaging
        </h3>
        <p className="text-sm md:text-base text-gray-500">
          Choose a conversation from the list to view messages
        </p>
      </div>
    </div>
  );
}
