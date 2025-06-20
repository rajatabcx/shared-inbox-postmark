import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

import MentionList from './MentionList';
import { Member } from '@/lib/types';

export default function Suggestion({ orgMembers }: { orgMembers: Member[] }) {
  return {
    items: ({ query }: { query: string }) => {
      return orgMembers
        .map((item) => ({
          name: `${item.first_name} ${item.last_name}`,
          email: item.email,
          id: item.id,
        }))
        .filter((item) =>
          item.name.toLowerCase().startsWith(query.toLowerCase())
        )
        .slice(0, 5);
    },

    render: () => {
      let component: any;
      let popup: any;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props: any) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}
