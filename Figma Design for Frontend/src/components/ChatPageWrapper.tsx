import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ContactListPanel from './ContactListPanel';
import AIChat from './chat/AIChat';
import TailorChat from './chat/TailorChat';
import SellerChat from './chat/SellerChat';
import EmptyState from './chat/EmptyState';
import SizeChartForm from './chat/SizeChartForm';

interface ChatPageWrapperProps {
  onNavigateBack: () => void;
}

export default function ChatPageWrapper({ onNavigateBack }: ChatPageWrapperProps) {
  const location = useLocation();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { selectedContact?: string; chatType?: string } | undefined;
    if (state?.selectedContact) {
      setSelectedContactId(state.selectedContact);
    }
  }, [location.state]);

  const [showSizeChartForm, setShowSizeChartForm] = useState(false);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleBackToList = () => {
    setSelectedContactId(null);
  };

  const handleOpenSizeChart = () => {
    setShowSizeChartForm(true);
  };

  const handleCloseSizeChart = () => {
    setShowSizeChartForm(false);
  };

  const handleSubmitMeasurements = (measurements: any) => {
    console.log('Measurements submitted:', measurements);
    setShowSizeChartForm(false);
    // In a real app, this would send the measurements to the chat
  };

  // If showing size chart form, render only that
  if (showSizeChartForm) {
    return (
      <SizeChartForm
        onBack={handleCloseSizeChart}
        onSubmit={handleSubmitMeasurements}
      />
    );
  }

  // Normalize IDs for component mapping
  const normalizedId = selectedContactId?.toLowerCase();

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      {/* MOBILE: Full screen chat list OR full screen chat */}
      {/* DESKTOP: Split view */}

      <div className="h-full w-full flex">
        {/* LEFT PANEL - Chat List */}
        <div className={`
          ${selectedContactId ? 'hidden' : 'block w-full'}
          lg:block lg:w-[432px] lg:shrink-0 lg:border-r border-gray-200 h-full
        `}>
          <ContactListPanel
            selectedContact={selectedContactId}
            onSelectContact={handleSelectContact}
            onBack={onNavigateBack}
          />
        </div>

        {/* RIGHT PANEL - Chat Screen */}
        <div className={`
          ${selectedContactId ? 'block w-full' : 'hidden'}
          lg:block lg:flex-1 h-full overflow-hidden
        `}>
          {!selectedContactId ? (
            <EmptyState />
          ) : (location.state as { chatType?: string } | undefined)?.chatType === 'tailor' ? (
            <TailorChat
              onBack={handleBackToList}
              onOpenSizeChart={handleOpenSizeChart}
            />
          ) : normalizedId?.includes('smartfitao') ? (
            <AIChat onBack={handleBackToList} />
          ) : (normalizedId?.includes('ali tanveer') || normalizedId?.includes('maria rodriguez')) ? (
            <TailorChat
              onBack={handleBackToList}
              onOpenSizeChart={handleOpenSizeChart}
            />
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