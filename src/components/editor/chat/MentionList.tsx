import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className='dropdown-menu'>
      {props.items.length ? (
        props.items.map(
          (
            item: { name: string; email: string; id: number },
            index: number
          ) => (
            <button
              key={item.id}
              className={index === selectedIndex ? 'is-selected' : ''}
              onClick={() => selectItem(index)}
            >
              {item.name}
            </button>
          )
        )
      ) : (
        <div className='item'>No result</div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
