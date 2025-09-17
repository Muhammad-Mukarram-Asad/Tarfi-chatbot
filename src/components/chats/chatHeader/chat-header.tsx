/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image"
import styles from './chatHeader.module.scss'
import menuIcon from "../../../../public/icons/menu-icon-header.svg"
export function ChatHeader(props:any) {
  const {onClick} = props;
  return (
    <div className={styles["chat_header_main_div"]}>
        <Image src={menuIcon} alt={"menu_icon"} width={28} height={28} onClick={onClick}/>
        <h1>Hyku</h1>
        <p>{""}</p>
    </div>
  )
}
