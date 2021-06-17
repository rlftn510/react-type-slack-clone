import {
  Header,
  Workspaces,
  Channels,
  WorkspaceName,
  WorkspaceWrapper,
  Chats,
  MenuScroll,
  RightMenu,
  ProfileImg,
  WorkspaceButton,
  AddButton,
} from './styles';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { IWorkspace, IUser, IChannel } from '../../typings/db';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelList';
import DirectMessage from '@pages/DirectMessage';
import Channel from '@pages/Channel';
import fetcher from '@utils/fetcher';
import useSocket from '@hooks/useSocket';

const Workspace = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(`/api/workspaces/${workspace}/channels`, fetcher);
  const [socket, disconnectSocket] = useSocket(workspace);

  useEffect(() => {
    return () => {
      console.info('disconnect socket', workspace);
      disconnectSocket();
    };
  }, [workspace]);
  useEffect(() => {
    if (userData) {
      console.info('로그인하자');
      socket?.emit('login', { id: userData?.id, channels: [] });
    }
  }, [userData]);
  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg src={gravatar.url(userData.email, { s: '36px', d: 'retro' })}></ProfileImg>
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</WorkspaceName>
          <MenuScroll>
            <ChannelList userData={userData} channelData={channelData} />
            <DMList userData={userData} />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
