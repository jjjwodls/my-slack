import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import useSWR, { useSWRInfinite } from 'swr';
import { useParams } from 'react-router';
import { IDM, IUser } from '@typings/db';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import makeScrtion from '@utils/makeSections';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const [socket] = useSocket(workspace);

  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IDM[]>( //SWRInfinite를 쓰면 2차원 배열이 된다.
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`, // 페이지 수를 가지고 있는 index
    fetcher,
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarREf = useRef<Scrollbars>(null);
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        //optimisticUI
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData?.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
        });
        axios
          .post(
            `/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            { withCredentials: true },
          )
          .then(() => {
            revalidate();
            setChat('');
            scrollbarREf.current?.scrollToBottom();
          })
          .catch((error) => console.error(error.response));
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );

  const onMessage = useCallback((data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarREf.current) {
          if (
            //내가 150px 올렸을 때는 안내리게.
            scrollbarREf.current.getScrollHeight() <
            scrollbarREf.current.getClientHeight() + scrollbarREf.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarREf.current?.getValues());
            setTimeout(() => {
              scrollbarREf.current?.scrollToBottom();
            }, 100);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage); // off 필수적으로
    };
  }, [socket, onMessage]);

  //chatData 있는 경우 스크롤바 가장 아래로.
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarREf.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!userData || !myData) {
    return null;
  }

  //2차원 배열이므로 1차원 배열로 만들면서 reverse를 해줘야함.
  const chatSections = makeScrtion(chatData ? [...chatData].flat().reverse() : []); //spread 로 하면 immutable 하게 복사 가능해짐.

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        scrollRef={scrollbarREf}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} placeholder="dm을 입력해주세요" />
    </Container>
  );
};

export default DirectMessage;
