import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface ItemActionsProps {
  itemId: string;
  sellerId: string;
  buyerId: string;
}

export default function ItemActions({ itemId, sellerId, buyerId }: ItemActionsProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const startChat = async () => {
    try {
      // Check if chat already exists
      const { data: existingChat, error: fetchError } = await supabase
        .from('chats')
        .select('id')
        .or(`and(participant1_id.eq.${user?.id},participant2_id.eq.${sellerId}),and(participant1_id.eq.${sellerId},participant2_id.eq.${user?.id})`)
        .eq('item_id', itemId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingChat) {
        navigate(`/messages/${existingChat.id}`);
        return;
      }

      // Create new chat
      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert([
          {
            participant1_id: user?.id,
            participant2_id: sellerId,
            item_id: itemId
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      navigate(`/messages/${newChat.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation');
    }
  };

  // Don't show message button if user is the buyer
  if (user?.id === buyerId) return null;

  return (
    <button
      onClick={startChat}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <MessageSquare className="h-5 w-5 mr-2" />
      Message
    </button>
  );
}