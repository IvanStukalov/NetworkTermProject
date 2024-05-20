import React, {useEffect, useState} from 'react';
import './App.css';
import {useUser} from "./hooks/useUser";
import {Login} from "./components/Login/Login";
import {hostname, Message} from "./consts";
import {Chat} from "./components/Chat/Chat";

function App() {
  const {login} = useUser();
  const [ws, setWs] = useState<WebSocket | undefined>();
  const [messageArray, setMessageArray] = useState<Message[]>([]);

  useEffect(() => {
    if (login) {
      setWs(
        createWebSocket(
          `ws://${hostname}:8001/?username=${encodeURIComponent(login)}`,
        ),
      );
    } else {
      setWs(new WebSocket(`ws://${hostname}`));
    }
  }, []);

  const createWebSocket = (url: string) => {
    const ws = new WebSocket(url);

    ws.onopen = function () {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = function (event) {
      const msgString = event.data;
      const message = JSON.parse(msgString);

      console.log('MessageCard from server:', message);

      setMessageArray((currentMsgArray: Message[]) => [...currentMsgArray, message]);
    };

    ws.onclose = function () {
      console.log('WebSocket connection closed');
    };

    ws.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    return ws;
  };

  return (
    <>
      <div className="App">
        {login ?
          <Chat messages={messageArray} ws={ws} messageArray={messageArray} setMessageArray={setMessageArray}/>
          :
          <Login ws={ws} setWs={setWs} createWebSocket={createWebSocket}/>
        }
      </div>
    </>
  );
}

export default App;
