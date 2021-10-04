import io from 'socket.io-client';
import React, { useCallback } from 'react';
import axios from 'axios';

const backUrl = 'http://localhost:3095';

//key는 workspace 이름이며, 고정값이 아니므로 동적으로 설정해준다.
const sockets: { [key: string]: SocketIOClient.Socket } = {};

//return값의 type을 적어줘야함(인식 못할 때 있음)
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  //namespace와 room 으로 구분하자.
  console.log(sockets);
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, []);
  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }
  // sockets[workspace].emit('hello', 'world'); //event명 , data
  // sockets[workspace].on('message', (data) => {
  //   console.log(data);
  // }); //event명 , data로 서버에서clinet로 넘겨줌.
  // sockets[workspace].on('data', (data) => {
  //   console.log(data);
  // });
  // sockets[workspace].on('onlineList', (data) => {
  //   console.log(data);
  // });

  return [sockets[workspace], disconnect];
};

export default useSocket;
