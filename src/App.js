import Canvas from "./Canvas";
import { useEffect } from "react";
import { io } from 'socket.io-client';
import SideBar from "./components/sidebar/sidebar";
import { useStateContext } from "./context/Context";
import { ContextProvider } from "./context/Context";


const App = () => {

  return (
    <ContextProvider>
      < div style={{ display: "flex" }} >
        <div className="Sidebar" style={{ width: "200px" }}>
          <SideBar />
        </div>
        <div className="canvas" style={{ marginLeft: "200px" }}>
          <Canvas />
        </div>
      </div>
    </ContextProvider>
  )
}

export default App