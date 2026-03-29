import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContactListPanel from './ContactListPanel';
import AIChat from './chat/AIChat';
import TailorChat from './chat/TailorChat';
import SellerChat from './chat/SellerChat';
import EmptyState from './chat/EmptyState';
import SizeChartForm from './chat/SizeChartForm';

/**
 * Full-screen messages: contact list on the left; clicking a user opens their
 * conversation on the right (SmartfitaO → AI chat, tailors/sellers → their chats).
 */
export default function AllMessagesPage() {
  const navigate = useNavigate();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showSizeChartForm, setShowSizeChartForm] = useState(false);

  const handleBack = () => navigate(-1);

  const handleSelectContact = (name: string) => {
    setSelectedContactId(name);
  };

  const handleBackToList = () => {
    setSelectedContactId(null);
  };

  const handleOpenSizeChart = () => setShowSizeChartForm(true);
  const handleCloseSizeChart = () => setShowSizeChartForm(false);
  const handleSubmitMeasurements = (measurements: unknown) => {
    console.log('Measurements submitted:', measurements);
    setShowSizeChartForm(false);
  };

  if (showSizeChartForm) {
    return (
      <div className="fixed inset-0 z-[100] bg-white min-h-screen">
        <SizeChartForm onBack={handleCloseSizeChart} onSubmit={handleSubmitMeasurements} />
      </div>
    );
  }

  const normalizedId = selectedContactId?.toLowerCase();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white min-h-screen">
      {/* Top bar: back button + title */}
      <header className="shrink-0 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center size-10 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-xl font-semibold text-[#111827]">Messages</h1>
      </header>

      <div className="flex-1 min-h-0 flex w-full">
        {/* Left: contact list – click a user to open their conversation */}
        <div
          className={`
            ${selectedContactId ? 'hidden' : 'block w-full'}
            lg:block lg:w-[432px] lg:shrink-0 lg:border-r border-gray-200 h-full overflow-hidden
          `}
        >
          <ContactListPanel
            selectedContact={selectedContactId}
            onSelectContact={handleSelectContact}
            onBack={handleBack}
          />
        </div>

        {/* Right: conversation for selected user (SmartfitaO, tailors, sellers) */}
        <div
          className={`
            ${selectedContactId ? 'block w-full' : 'hidden'}
            lg:block lg:flex-1 min-h-0 overflow-hidden
          `}
        >
          {!selectedContactId ? (
            <EmptyState />
          ) : normalizedId?.includes('smartfitao') ? (
            <AIChat onBack={handleBackToList} />
          ) : (normalizedId?.includes('ali tanveer') || normalizedId?.includes('maria rodriguez')) ? (
            <TailorChat onBack={handleBackToList} onOpenSizeChart={handleOpenSizeChart} />
          ) : normalizedId?.includes('usman khan') ? (
            <SellerChat onBack={handleBackToList} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
