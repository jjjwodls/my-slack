import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSections';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import useSWR, { useSWRInfinite } from 'swr';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import InviteChannelModal from '@components/InviteWorkspaceChannel';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  // const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const [socket] = useSocket(workspace);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IChat[]>( //SWRInfinite를 쓰면 2차원 배열이 된다.
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`, // 페이지 수를 가지고 있는 index
    fetcher,
  );

  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarREf = useRef<Scrollbars>(null);
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData) {
        //optimisticUI
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData?.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
        });
        axios
          .post(
            `/api/workspaces/${workspace}/channels/${channel}/chats`,
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
    [chat, chatData, myData, channelData, workspace, channel],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      if (data.Channel.name === channel && data.UserId !== myData.id) {
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
    },
    [channel, myData],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage); // off 필수적으로
    };
  }, [socket, onMessage]);

  //chatData 있는 경우 스크롤바 가장 아래로.
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarREf.current?.scrollToBottom();
    }
  }, [chatData]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  if (!myData || !myData) {
    return null;
  }

  //2차원 배열이므로 1차원 배열로 만들면서 reverse를 해줘야함.
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []); //spread 로 하면 immutable 하게 복사 가능해짐.

  return (
    <Container>
      <Header>
        <span>{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>

      <ChatList
        chatSections={chatSections}
        scrollRef={scrollbarREf}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} placeholder="dm을 입력해주세요" />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  );
};

export default Channel;
