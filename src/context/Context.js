import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();


const ContextProvider = ({ children }) => {
    const [workspaceData, setWorkspaceData] = useState("fly");

    return (
        <ProjectContext.Provider value={{ workspaceData, setWorkspaceData }}>
            {children}
        </ProjectContext.Provider>
    )
}

const useStateContext = () => {
    return useContext(ProjectContext);
};

export { ContextProvider, useStateContext };




