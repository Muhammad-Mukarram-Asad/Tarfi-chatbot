/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import styles from "./sidePanel.module.scss"
import searchIcon from "../../../public/search.svg"
import newChatIcon from "../../../public/new-chat-icon.svg"
import Image from "next/image"
export const HistoryScreen = ({showSidePanel}:any) => {
  return (
    <main className={styles["history_main_div"] + " " + (showSidePanel ? styles["show"] : styles[""])}>
        <div className={styles["search_container"]}>
            <Image src={searchIcon} alt="profile_picture" width={24} height={24} />
            <input type="text" placeholder="Search chats" className={styles["search_input"]} />
        </div>
        <section className={styles["history_list_section"]}>
            <h1>Recent Chats</h1>
            <div className={styles["history_list_chat_div"]}>Buying a home</div>
            <div className={styles["history_list_chat_div"]}>Getting a car loan</div>
            <div className={styles["history_list_chat_div"]}>Ready to marriage</div>
            <p>View more</p>
        </section>

        <div className={styles["new_chat_button_div"]}>
            <p>New Chat</p>
            <Image src={newChatIcon} alt="plus_icon" width={24} height={24} />
        </div>
    </main>
  )
}
