'use client';
import React, { useEffect } from 'react';

import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';

import { cn } from '@/lib/utils';
import ChatEditorToolBar from './ChatEditorToolbar';
import { Member } from '@/lib/types';
import Suggestion from './Suggestion';

interface PropTypes {
  value?: string;
  onChange: (...event: any[]) => void;
  placeholder?: string;
  className?: string;
  orgMembers: Member[];
}

export function ChatEditor({
  value = '',
  onChange,
  placeholder = 'Enter your message',
  className,
  orgMembers,
}: PropTypes) {
  const editor = useEditor({
    extensions: [
      Placeholder.configure({
        placeholder,
      }),
      StarterKit.configure({}),
      Underline,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc px-4',
        },
      }),
      Link.configure({
        defaultProtocol: 'https',
        autolink: true,
        openOnClick: false,
        HTMLAttributes: {
          class: 'cursor-pointer underline text-blue-600',
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: Suggestion({ orgMembers }),
        renderHTML({ options, node }) {
          return [
            'span',
            mergeAttributes(
              {
                ['data-user-id']: node.attrs.id.id,
                ['data-user-email']: node.attrs.id.email,
              },
              options.HTMLAttributes
            ),
            `${options.suggestion.char}${node.attrs.id.name}`,
          ];
        },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      const mentions = editor
        .getJSON()
        .content?.flatMap((item) => item.content)
        .filter((item) => item?.type === 'mention')
        .map((item) => item?.attrs?.id?.id);
      onChange(editor.getHTML(), editor.getText(), mentions);
    },
    editorProps: {
      attributes: {
        class: cn(
          'rounded-md border min-h-[80px] bg-sidebar px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
          className
        ),
      },
    },
    // immediatelyRender: false,
  });

  useEffect(() => {
    if (!value) {
      editor?.commands.clearContent();
    }
  }, [value, editor]);

  return (
    <div>
      <ChatEditorToolBar editor={editor} />

      <EditorContent
        id='editor-content'
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  );
}
