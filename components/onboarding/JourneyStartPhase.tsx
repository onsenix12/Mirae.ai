'use client';

import React from 'react';
import { ChatBubble } from './shared/ChatBubble';
import { OptionButton } from './shared/OptionButton';

interface JourneyStartPhaseProps {
  onBegin: () => void;
}

export const JourneyStartPhase: React.FC<JourneyStartPhaseProps> = ({
  onBegin
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ChatBubble sender="mirae">
        <div className="space-y-3">
          <p className="text-lg">
            Perfect! We&apos;re all set. 🌟
          </p>
          <p>
            You&apos;re about to start an exciting journey of self-discovery. 
            We&apos;ll explore together, step by step, and I&apos;ll be here to guide you.
          </p>
          <p className="text-gray-600">
            Ready to begin?
          </p>
        </div>
      </ChatBubble>

      <div className="flex justify-end">
        <OptionButton onClick={onBegin} variant="primary">
          Start your journey! ✨
        </OptionButton>
      </div>
    </div>
  );
};
