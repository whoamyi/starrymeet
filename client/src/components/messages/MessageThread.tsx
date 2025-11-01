import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { messagesApi } from '@/services/api';
import { timeAgo } from '@/utils';
import { toastConfig } from '@/utils';
import type { Message } from '@/types';

interface MessageThreadProps {
  messages: Message[];
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
}

export const MessageThread = ({
  messages,
  recipientId,
  recipientName,
  recipientAvatar,
}: MessageThreadProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      messagesApi.send({ recipient_id: recipientId, content }),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      toastConfig.error('Failed to send message');
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 p-4 flex items-center gap-3">
        {recipientAvatar ? (
          <img
            src={recipientAvatar}
            alt={recipientName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#D4A574] flex items-center justify-center text-black font-bold">
            {recipientName.substring(0, 2).toUpperCase()}
          </div>
        )}
        <h2 className="text-lg font-semibold">{recipientName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine = message.sender_id === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? 'bg-[#D4A574] text-black'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMine ? 'text-black/60' : 'text-gray-400'
                  }`}
                >
                  {timeAgo(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-gray-900/50 border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
            disabled={sendMessageMutation.isPending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="bg-[#D4A574] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#C49563] transition disabled:opacity-50"
          >
            {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};
