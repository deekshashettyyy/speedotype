import Navbar from "./components/Navbar"
import Body from "./components/Body"
import "./components/Navbar.css"
import "./components/Body.css"

import { useState , useEffect } from "react"

function App() 
{
  let [dark,setDark] = useState(localStorage.getItem("dark")==="true");
  let [best,setBest] = useState(parseInt(localStorage.getItem("best"))||0);

  useEffect( ()=>{localStorage.setItem("best",best)} , [best]
  );

  function change()
  {
    localStorage.setItem("dark",!dark);
    setDark((prev) => !prev) ;
  }

  return (
    <>
      <Navbar dabba={dark} changeTheme={change} best={best} />
      <Body dabba={dark} setBest={setBest} best={best}/>
    </>
  )
}

export default App
