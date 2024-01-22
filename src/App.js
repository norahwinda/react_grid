import Canvas from "./Canvas";
import { useEffect } from "react";
import { io } from 'socket.io-client';
import SideBar from "./components/sidebar/sidebar";


const App = () => {
  // useEffect(() => {
  //   // Connect to the Socket.IO server
  //   const socket = io('http://216.219.86.171:3001/socket'); // Use 'http://' or 'https://' depending on your server configuration

  //   // Event listener for successful connection
  //   socket.on('connect', () => {
  //     console.log('Connected to Socket.IO server');
  //     socket.emit('clientMessage', 'Hello Server!'); // Send a message to the server
  //   });

  //   // Event listener for receiving messages from the server
  //   socket.on('serverMessage', (message) => {
  //     console.log('Received message from server:', message);
  //     // Update your component state or perform other actions with the received data
  //   });

  //   // Event listener for Socket.IO errors
  //   socket.on('error', (error) => {
  //     console.error('Socket.IO error:', error);
  //     // Handle error state or reconnect logic here
  //   });

  //   // Event listener for Socket.IO disconnection
  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from Socket.IO server');
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);


  return (
    < div style={{ display: "flex" }} >
      <div className="Sidebar" style={{ width: "200px" }}>
        <SideBar />
      </div>
      <div className="canvas" style={{ marginLeft: "200px" }}>
        <Canvas />
      </div>
    </div>
  )
}

export default App