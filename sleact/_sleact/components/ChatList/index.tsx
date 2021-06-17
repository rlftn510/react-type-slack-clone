import React, { FC, memo, RefObject, useCallback } from 'react';
import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IChat, IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars';
interface Props {
  scrollbarRef: RefObject<Scrollbars>;
  chatSections: { [key: string]: (IDM | IChat)[] };
  isReachingEnd?: boolean;
  isEmpty: boolean;
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
}
//memo 제거 해보기
const ChatList: FC<Props> = memo(({ chatSections, scrollbarRef, isReachingEnd, isEmpty, setSize }) => {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize((size) => size + 1).then(() => {
          scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
        });
      }
    },
    [isReachingEnd, isEmpty],
  );
  return (
    <ChatZone>
      <Scrollbars ref={scrollbarRef} autoHide onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
