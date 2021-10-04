import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { useCallback, useRef, VFC } from 'react';
import { ChatZone, Section } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatData?: IDM[]; //체이닝 문법으로 진행한다. undifiend 대비해서 예외가 발생함.
}

const ChatList: VFC<Props> = ({ chatData }) => {
  const scrollbarREf = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarREf} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat}></Chat>
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
