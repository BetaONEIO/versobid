import React from 'react';
import { useParams } from 'react-router-dom';
import ChatList from '../components/messaging/ChatList';
import ChatWindow from '../components/messaging/ChatWindow';

export default function Messages() {
  const { chatId } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <div className="border-r dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              <ChatList />
            </div>
          </div>

          {/* Chat Window or Empty State */}
          <div className="md:col-span-2">
            {chatId ? (
              <ChatWindow
                chatId={chatId}
                recipientId="recipient-id" // You'll need to get this from the chat data
                itemId="item-id" // Optional: If the chat is about a specific item
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}