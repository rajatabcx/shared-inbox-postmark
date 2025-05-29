import { BubbleMenu, Editor } from '@tiptap/react';
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import {
  List,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Link,
} from 'lucide-react';

export default function ChatEditorToolBar({
  editor,
}: {
  editor: Editor | null;
}) {
  return (
    <>
      {editor && (
        <BubbleMenu
          className='bg-sidebar flex gap-1 p-1 rounded-lg'
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <Toggle
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className='size-4' />
          </Toggle>
          <Toggle
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className='size-4' />
          </Toggle>
          <Toggle
            pressed={editor.isActive('strike')}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className='size-4' />
          </Toggle>
          <Toggle
            pressed={editor.isActive('underline')}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
          >
            <Underline className='size-4' />
          </Toggle>
          <Toggle
            pressed={editor.isActive('bulletList')}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List className='size-4' />
          </Toggle>
          <Toggle
            pressed={editor.isActive('link')}
            onPressedChange={() => {
              const url = window.prompt('Enter URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
          >
            <Link className='size-4' />
          </Toggle>
        </BubbleMenu>
      )}
    </>
  );
}
