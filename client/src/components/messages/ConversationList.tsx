import { timeAgo } from '@/utils';
import type { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (userId: string) => void;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) => {
  if (!conversations.length) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {conversations.map((conversation) => (
        <button
          key={conversation.user.id}
          onClick={() => onSelectConversation(conversation.user.id)}
          className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition ${
            selectedConversation === conversation.user.id ? 'bg-gray-800' : ''
          }`}
        >
          {conversation.user.profile_picture ? (
            <img
              src={conversation.user.profile_picture}
              alt={conversation.user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[rgba(255, 255, 255, 0.8)] flex items-center justify-center text-black font-bold">
              {conversation.user.username.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 text-left">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-white">{conversation.user.username}</h3>
              <span className="text-xs text-gray-400">
                {timeAgo(conversation.last_message_time)}
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate">{conversation.last_message}</p>
          </div>
          {conversation.unread_count > 0 && (
            <div className="w-5 h-5 rounded-full bg-[rgba(255, 255, 255, 0.8)] flex items-center justify-center text-xs font-bold text-black">
              {conversation.unread_count}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
