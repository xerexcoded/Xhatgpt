import { useState } from "react";

import "./App.css";

//we are using chat-ui-kit-react
//https://chatscope.io/chat-ui-kit-react/docs/GettingStarted
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

function App() {
  const [messages, setMessages] = useState([
    {
      messages: "Hello I am Xee",
      sender: "Xee",
      sentTime: "just now sent",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const handleSend = async (message) => {
    const newMessage = { message, direction: "outgoing", sender: "user" };
    //added new message to the messages array
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    //Initial system message to determine xees response
    setIsTyping(true);
    await processMessagetoXee(message);
  };

  async function processMessagetoXee(chatMessages) {
    let apiMessage = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "Xee") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessage],
    };
    await fetch("https://api.chatgpt.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + API_KEY,
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          { message: data.choices[0].message.content, sender: "Xee" },
        ]);
        setIsTyping(false);
      });
  }
  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? <TypingIndicator content="Xee is typing..." /> : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Type message here..."
              onSend={handleSend}
              attachButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
