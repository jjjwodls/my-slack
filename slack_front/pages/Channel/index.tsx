import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react';
import { Container, Header } from './styles';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    setChat('');
  }, []);

  return (
    <Container>
      <Header>channel이다!</Header>
      {/* <ChatList /> */}
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} placeholder="채널을 입력해주세요." />
    </Container>
  );
};

export default Channel;
