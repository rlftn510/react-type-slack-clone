import { IUser } from '@typings/db';
import React, { useState, useCallback } from 'react';
import { CollapseButton } from './styles';
import useSWR from 'swr';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import fetcher from '@utils/fetcher';

interface Props {
  userData?: IUser;
}
const DMList = () => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  const { workspace } = useParams<{ workspace: string }>();
  const { data: memberData } = useSWR<IUser[]>(`/api/workspaces/${workspace}/members`, fetcher);
  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  return (
    <div>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Message</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {/* {member.id === userData?.id && <span> (나)</span>} */}
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};

export default DMList;
