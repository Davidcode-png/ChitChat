import React,{useState,useContext} from 'react';
import  useWebSocket,{ReadyState,SendMessage} from 'react-use-websocket';
import '../App.css'
import { AuthContext } from '../contexts/AuthContext';
function Chat() {

  const [welcomeMessage, setWelcomeMessage] = useState<any>("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const {user} = useContext(AuthContext)
  // Changes the value for the message
  function handleChangeMessage(e: any) {
    setMessage(e.target.value);
  }
  
  function handleChangeName(e: any) {
    setName(e.target.value);
  }


  // Creating a websocket instance by connecting to the websocket of the server
  const {readyState,sendJsonMessage} = useWebSocket(user ? "ws://127.0.0.1:8000/":null  ,
  
  {
    queryParams: {
      token: user ? user.token : "",
    },
    // What to do after connection
    onOpen: () =>{console.log("Connected")},
    // What to do after disconnection
    onClose: () =>{console.log("Disconnected")},
    // What happens when I send self.send_json i.e sending message
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      switch(data.type){
        case "welcome_message":
          setWelcomeMessage(data.message);
          break;
        case "response":
          setWelcomeMessage(data.message);
          break;
        case "chat_message_echo":
          setMessageHistory((prev:any) => prev.concat(data));
          break;
        
        default:
          console.error("Unknown Error Type!");
          break;
      }
    }
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]:"Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];
  
  //Sending the value to the server by sending a json message
  function handleSubmit(){
    sendJsonMessage({
      type:"chat_message",
      message,
      name,
    });
    setName("");
    setMessage("");
  }
  return (
    <div>
          <span>The WebSocket is currently {connectionStatus}</span>
          <p>{welcomeMessage}</p>
          <button className='bg-gray-300 px-3 px-1' onClick={() =>{
            sendJsonMessage({
              type: "greeting",
              message: "Hi!"
            });
          }
          }>Say Hi!</button>
          <input 
          name='message'
          placeholder='Message'
          value={message}
          onChange={handleChangeMessage}
          className='ml-2 sm:text-sm border-gray-300 bg-gray-100 rounded-md'
            />

          <button className='ml-3 bg-gray-300 px-3 py-1' onClick={handleSubmit}>
            Submit
          </button>
          <hr />
          <ul>
            {messageHistory.map((message: any, idx: number) => (
              <div className='border border-gray-200 py-3 px-3' key={idx}>
                {message.name}: {message.message}
              </div>
            ))}
          </ul>
    </div>
  );
}
export default Chat;
