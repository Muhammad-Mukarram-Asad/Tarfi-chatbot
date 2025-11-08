/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image"
import styles from './chatHeader.module.scss'
import menuIcon from "../../../../public/icons/menu-icon-header.svg"
import { useState } from "react";
export function ChatHeader(props:any) {
  const {onClick,toggleTheme, setToggleTheme} = props;
  console.log("toggleTheme in chatHeader:", toggleTheme);
  const [] = useState(false);
  return (
    <div className={styles["chat_header_main_div"]}>
        <Image src={menuIcon} alt={"menu_icon"} width={28} height={28} onClick={onClick}/>
        <h1>Hyku</h1>
        <p onClick={() => setToggleTheme(!toggleTheme)}>{toggleTheme === true ? "Dark" : ""}</p>
    </div>
  )
}
