'use client';
import React, { useEffect } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Blockquote from '@tiptap/extension-blockquote';

import { Toolbar } from './ReplyEditorToolBar';
import { cn } from '@/lib/utils';

export function EmailReplyEditor({
  value = '',
  onChange,
  placeholder = 'Enter your message',
  className,
}: {
  value?: string;
  onChange: (...event: any[]) => void;
  placeholder?: string;
  className?: string;
}) {
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
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-[3px] border-border my-5 pl-4',
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
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML(), editor.getText());
    },
    editorProps: {
      attributes: {
        class: cn(
          'border min-h-[200px] bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 rounded-b-xl',
          className
        ),
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!value) {
      editor?.commands.clearContent();
    } else if (value !== editor?.getHTML()) {
      console.log('setting content', value);
      editor?.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent
        id='editor-content'
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  );
}
