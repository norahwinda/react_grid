import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();


export const ContextProvider = ({ children }) => {
    const [workspaceData, setWorkspaceData] = useState();

    return (
        <ProjectContext.Provider value={{ workspaceData, setWorkspaceData }}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useStateContext = () => useContext(ProjectContext);



