import React from 'react';
import Chat from '../Chat/chat';

const SocietyPage = () => {
  const sessionId = 'some-session-id'; // Example: Use society ID
  const userId = 'current-user-id';   // Fetch this from auth or context

  return (
    <div>
      <h1>Society Chat</h1>
      <Chat sessionId={sessionId} userId={userId} />
    </div>
  );
};

export default SocietyPage;
