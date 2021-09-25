# my-slack
react typescript 설정부터 시작하여 slack의 어느정도 모습을 가꿔보는 시간입니다.

front 위주(React로 작업되며 Typescript 를 사용합니다. webpack.config.ts 부터 모든 설정을 시작으로 진행됩니다.)

추후 backend는 인증, 회원관련하여 별도로 새로 작업할 예정입니다.

# typescript config 설정 중 발생한 예외들

```typescript

if (isDeveloment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin()); //hot reload 해주는것들
  //여기서 예외가 발생하였음. 
  config.plugins.push(new ReactRefreshWebpackPlugin()); //refresh마다 호출 해주는 socket 플러그인.
}

Uncaught TypeError: SocketClient is not a constructor //예외 내용

```

위와 같이 예외가 발생했습니다. 소켓 예외로 생각되며 해당 문제를 해결하기 위해
다음 사이트를 참조했습니다.


그리고 해당 npm을 최신버전으로 업데이트 하여 해결했습니다.

아 그리고 중간에 오타 및 버전이 올라감에 따라 설정이 변경된 부분들이 많았습니다.

특히 devserver 설정 변경이 많았고 devserver를 설정하기 위해 webpack-dev-server를 상속받아 작성했습니다.

또한 devserver에서 publicpath는 지원하는 방식이 달라졌으며 

최신버전 : "@pmmmwh/react-refresh-webpack-plugin": "^0.5.0-rc.6",

참고 주소 : https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/481