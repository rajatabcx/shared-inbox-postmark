'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { InternalChat } from '@/lib/types';
import { createSupabaseClient } from '@/lib/supabase/client';

export function EmailMessages({
  internalChats,
  userProfile,
}: {
  internalChats: InternalChat[];
  userProfile: {
    first_name: string;
    last_name: string;
  } | null;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [internalMessages, setInternalMessages] =
    useState<InternalChat[]>(internalChats);
  const supabase = createSupabaseClient();
  useEffect(() => {
    const channel = supabase
      .channel('internal messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'internal_messages',
        },
        (payload) => {
          const newChat: InternalChat = {
            user_profiles: userProfile,
            created_at: payload.new.created_at,
            email_id: payload.new.email_id,
            id: payload.new.id,
            message: payload.new.message,
            sender_id: payload.new.sender_id,
          };
          setInternalMessages((prev) => [...prev, newChat]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userProfile]);

  useEffect(() => {
    if (
      messagesEndRef.current &&
      internalMessages.length > internalChats.length
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [internalMessages, internalChats]);
  return (
    <>
      <div className='space-y-2 mt-6 pb-6'>
        {internalMessages.map((item) => (
          <div key={item.id} className='flex items-center gap-2'>
            <Avatar className='text-xs'>
              <AvatarFallback>
                <span>
                  {item.user_profiles?.first_name?.charAt(0)}
                  {item.user_profiles?.last_name?.charAt(0)}
                </span>
              </AvatarFallback>
            </Avatar>
            <span
              className='text-sm px-4 py-2 rounded-lg bg-muted'
              dangerouslySetInnerHTML={{ __html: item.message }}
            />
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </>
  );
}
