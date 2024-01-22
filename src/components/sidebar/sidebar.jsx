// import styles from "./styles.module.css"
import { useStateContext } from "../../context/Context";

function SideBar(props){
    return(
        <div  style={{textAlign:"center", marginTop:"40px", marginLeft:"10px", height:"90%"}}>
            <h5 style={{marginLeft:"120px"}}>USERS</h5>
            <hr style={{width:"30vw"}} />
            {/* {props.workspaces.forEach(element => {
                <li>element.company_id</li>
            });} */}

            <ul style={{textDecoration:"none", marginTop:20, lineHeight:"35px" }}>
                <li>Workspace 1</li>
                <li>Workspace 2</li>
                <li>Workspace 3</li>
            </ul>

        </div>
    );
}



export default SideBar;