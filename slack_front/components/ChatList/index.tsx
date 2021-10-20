import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import React, { forwardRef, RefObject, useCallback, useRef, VFC } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
import { Chats } from '@layouts/Workspace/styles';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] }; //체이닝 문법으로 진행한다. undifiend 대비해서 예외가 발생함.
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
  scrollRef: RefObject<Scrollbars>;
}

const ChatList: VFC<Props> = ({ chatSections, setSize, scrollRef, isEmpty, isReachingEnd }) => {
  const onScroll = useCallback((values) => {
    //데이터 추가 로딩(scroll이 탑이므로)
    if (values.scrollTop === 0 && !isReachingEnd) {
      //스크롤 위치
      setSize((prevSize) => prevSize + 1).then(() => {
        if (scrollRef?.current) {
          scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
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
};

export default ChatList;
