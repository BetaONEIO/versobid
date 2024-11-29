import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Image as ImageIcon } from 'lucide-react';
import { useChat } from '../../lib/hooks/useChat';
import { useAuthStore } from '../../stores/authStore';
import { formatTimestamp } from '../../lib/utils';
import { Message } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ChatWindowProps {
  chatId: string;
  recipientId: string;
  itemId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, recipientId, itemId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { messages, loading, sending, sendMessage } = useChat(chatId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      await sendMessage(newMessage, recipientId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      toast.error('Invalid file or user not authenticated');
      return;
    }

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath);

      if (publicUrlError || !publicUrlData.publicUrl) {
        throw publicUrlError || new Error('Failed to retrieve public URL');
      }

      await sendMessage('Sent an image', recipientId, publicUrlData.publicUrl);
      toast.success('Image sent successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to send image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender_id === user?.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {message.image_url && (
                <img
                  src={message.image_url}
                  alt="Shared content"
                  className="rounded-lg max-w-full mb-2"
                />
              )}
              <p>{message.content}</p>
              <span className="text-xs opacity-75">
                {formatTimestamp(message.created_at)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
            aria-label="Upload image"
          >
            {uploadingImage ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImageIcon className="h-5 w-5" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            aria-label="Upload image"
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
            disabled={sending || uploadingImage}
          />
          <button
            type="submit"
            disabled={sending || uploadingImage || !newMessage.trim()}
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
