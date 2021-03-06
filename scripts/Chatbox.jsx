import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import { fnt, brc } from './OptionMenu';

const div = {
  width: 1000,
  height: 430,
  position: 'fixed',
  left: 300,
  top: 50,
  display: 'inline',
  background: 'grey',
  border: brc,
  fontSize: fnt,
  boxShadow: '2px 5px black',
  borderRadius: 10,
};
const ul = {
  listStyleType: 'none',
  height: 315,
  textAlign: 'left',
  overflow: 'scroll',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontSize: fnt,

};

const input = {

  width: 942,
};
const p = {

  padding: 0,
  margin: 0,
  position: 'relative',
  border: brc,
  fontWeight: 'bold',
  textAlign: 'center',
  opacity: 0.5,
  fontStyle: 'italic',

};

const secretP = {
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'italic',
  background: 'grey',
  fontSize: fnt,

};

const details = {
  fontWeight: 'bold',
  textAlign: 'center',
  fontStyle: 'italic',
  fontSize: fnt,
};

const body = {
  background: 'grey',
};

export function Chatbox() {
  const [userInput, setInput] = useState('');
  const [money, setMoney] = useState(1000);
  const [chatlog, setChatlog] = useState([]);

  function retrievePlayerChatlog() {
    useEffect(() => {
      Socket.emit('get chatlog');
      Socket.on('user chatlog', (data) => {
        setChatlog(data);
      });
    }, []);
  }

  function submitInput(event) {
    event.preventDefault();
    Socket.emit('user input', { input: userInput });
    setChatlog(chatlog =>[...chatlog, userInput])
    document.getElementById('user_text_box').value = '';
  }
  
  function listenChatChange(){
    Socket.on('chatlog updated', (data)=>{
      console.log(data);
    });
  }
  
  const displayLog = chatlog.map((log, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <li key={index}>
      {' '}
      {log}
      {' '}
    </li>
  ));

  function submitPayment() {
    if (money === 0) {
      setMoney(0);
    } else {
      setMoney(money - 500);
      Socket.emit('item purchased');
    }
  }

  function startGame() {
    Socket.emit('game start');
  }

  retrievePlayerChatlog();
  listenChatChange();
  startGame();
  return (
    <div style={div}>
      <div id="chatbox">
        <ul style={ul}>
          {displayLog}
        </ul>
      </div>
      <p style={p}>Possible Actions: &quot;Say&quot;, &quot;Do&quot;, &quot;Attack&quot;</p>
      <details>
        <summary style={details}>Pssst..click me for goods</summary>
        <body style={body}>
          <p style={secretP}>
            {' '}
            Welcome to Ghosty&apos;s Emporium! What can I get ye?
          </p>
          <p style={secretP}>
            Current Money:
            {money}
            {' '}
            Bucks
          </p>
          <br />
          <button type="submit" id="Health" onClick={submitPayment}>Health Pack: 500 Bucks</button>
        </body>

      </details>
      <br />
      <div id="user_buttons">
        <form onSubmit={submitInput}>
          <input style={input} id="user_text_box" type="text" placeholder="What is your command?" onChange={(e) => setInput(e.target.value)} />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

export default Chatbox;
