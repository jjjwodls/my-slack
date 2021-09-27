import React, { useCallback, VFC } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from './styles';

interface Props {
  chat: string;
}

const ChatBox: VFC<Props> = ({ chat }) => {
  const onSubmitForm = useCallback(() => {}, []);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea />
        <Toolbox>
          <SendButton></SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};
