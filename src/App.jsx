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
  ConversationHeader,
  Avatar,
  VoiceCallButton,
  VideoCallButton,
  StarButton,
  InfoButton,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

//make system message have dynamic content

const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm XhatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "XhatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine XhatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToXhatGPT(newMessages);
  };

  async function processMessageToXhatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for XhatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "XhatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want XhatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our XhatGPT
        ...apiMessages, // The messages from our chat with XhatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
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
          {
            message: data.choices[0].message.content, //
            sender: "XhatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }
  return (
    <div className="App">
      <div style={{ position: "relative", height: "700px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Content>
                <span
                  style={{
                    color: "#ec1212",
                    alignSelf: "flex-center",
                  }}
                >
                  XhatGPT
                </span>
              </ConversationHeader.Content>
            </ConversationHeader>
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
