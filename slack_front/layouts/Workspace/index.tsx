import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Children, FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

//FC 타입안에 children이 들어있음. 만약 children 사용 안하면 VFC 사용하면된다.
const Workspace: FC = ({ children }) => {
  //전역 스토리지처럼 사용됨.
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then((res) => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
