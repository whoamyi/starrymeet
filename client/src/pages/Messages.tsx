import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header, BottomNav, Loading } from '@/components';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageThread } from '@/components/messages/MessageThread';
import { messagesApi } from '@/services/api';

export const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedUserId],
    queryFn: () => messagesApi.getMessages(selectedUserId!),
    enabled: !!selectedUserId,
  });

  const selectedConversation = conversations?.find(
    (c) => c.user.id === selectedUserId
  );

  if (conversationsLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid md:grid-cols-[350px,1fr] gap-4 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <div className="bg-gray-900/50 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <ConversationList
                conversations={conversations || []}
                selectedConversation={selectedUserId}
                onSelectConversation={setSelectedUserId}
              />
            </div>
          </div>

          {/* Message Thread */}
          <div className="bg-gray-900/50 rounded-2xl overflow-hidden">
            {selectedUserId && selectedConversation ? (
              messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">Loading messages...</div>
                </div>
              ) : (
                <MessageThread
                  messages={messages || []}
                  recipientId={selectedUserId}
                  recipientName={selectedConversation.user.username}
                  recipientAvatar={selectedConversation.user.profile_picture}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mx-auto mb-4 opacity-50"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
