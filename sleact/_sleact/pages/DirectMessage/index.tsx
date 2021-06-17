import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { Header, Container } from '@pages/DirectMessage/styles';
import { IDM, IUser } from '@typings/db';
import useSocket from '@hooks/useSocket';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import useSWR, { useSWRInfinite } from 'swr';
import makeSection from '@utils/makeSection';

const PAGE_SIZE = 20;
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [socket] = useSocket(workspace);
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (myData && userData && chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData: any) => {
          prevChatData[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          if (scrollbarRef.current) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id, myData, userData, chatData],
  );

  const onMessage = (data: IDM) => {
    if (data.SenderId === Number(id) && myData?.id !== Number(id)) {
      mutateChat((chatData: any) => {
        chatData[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            scrollbarRef.current.scrollToBottom();
          } else {
            // 새로운 메시지가 왔다고 알림이라도 해주기
          }
        }
      });
    }
  };

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, id]);
  useEffect(() => {
    if (chatData?.length === 1) {
      console.log('toBottomWhenLoaded', chatData, scrollbarRef.current?.getValues());
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  const chatSections = useMemo(
    () => makeSection(chatData ? ([] as IDM[]).concat(...chatData).reverse() : []),
    [chatData],
  );
  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        {userData && (
          <>
            <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
            <span>{userData.nickname}</span>
          </>
        )}
      </Header>
      <ChatList
        scrollbarRef={scrollbarRef}
        chatSections={chatSections}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />

      {userData && (
        <ChatBox
          onSubmitForm={onSubmitForm}
          chat={chat}
          onChangeChat={onChangeChat}
          placeholder={`Message ${userData.nickname}`}
          data={[]}
        />
      )}
    </Container>
  );
};

export default DirectMessage;
