import { Editor } from '@tiptap/react';
import React, { useCallback } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  Underline,
  Link2,
  Quote,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface PropTypes {
  editor: Editor | null;
}

export function Toolbar({ editor }: PropTypes) {
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return editor ? (
    <div className='border bg-background rounded-t-xl px-3 py-2 border-b-none'>
      <Toggle
        size='sm'
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote className='w-4 h-4' />
      </Toggle>
      <Toggle
        size='sm'
        pressed={editor.isActive('bold')}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold className='w-4 h-4' />
      </Toggle>
      <Toggle
        size='sm'
        pressed={editor.isActive('italic')}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic className='w-4 h-4' />
      </Toggle>
      <Toggle
        size='sm'
        pressed={editor.isActive('strike')}
        onPressedChange={() => {
          editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough className='w-4 h-4' />
      </Toggle>
      <Toggle
        size='sm'
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List className='w-4 h-4' />
      </Toggle>
      <Toggle
        size='sm'
        pressed={editor.isActive('underline')}
        onPressedChange={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline className='w-4 h-4' />
      </Toggle>
      <Toggle
        size='sm'
        pressed={editor.isActive('link')}
        onPressedChange={() => {
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          setLink();
        }}
      >
        <Link2 className='w-4 h-4' />
      </Toggle>
    </div>
  ) : null;
}
