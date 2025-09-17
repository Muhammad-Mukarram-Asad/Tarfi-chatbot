/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import styles from "./sidePanel.module.scss";
import searchIcon from "../../../public/icons/search.svg";
import newChatIcon from "../../../public/icons/new-chat-icon.svg";
import Image from "next/image";
export const HistoryScreen = ({ showSidePanel, handleNewChat }: any) => {
  type chatType = {
    id: number;
    title: string;
  };
  const [filteredList, setFilteredList] = useState<chatType[]>([]);
  const recentChatsHistory = [
    { id: 1, title: "Buying a home" },
    { id: 2, title: "Getting a car loan" },
    { id: 3, title: "Ready to marriage" },
    { id: 4, title: "Investing in stocks" },
    { id: 5, title: "Planning for retirement" },
    { id: 6, title: "Budgeting tips" },
    { id: 7, title: "Saving tips" },
    { id: 8, title: "Umrah Tour Guide" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery.trim() === "") {
      setFilteredList([]);
      return;
    } else {
      const newFilteredList = recentChatsHistory.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery)
      );
      setFilteredList(newFilteredList);
    }
  };

  return (
    <main
      className={
        styles["history_main_div"] +
        " " +
        (showSidePanel ? styles["show"] : styles[""])
      }
    >
      <div className={styles["search_container"]}>
        <Image src={searchIcon} alt="profile_picture" width={24} height={24} />
        <input
          type="text"
          placeholder="Search chats"
          className={styles["search_input"]}
          onChange={(e) => handleSearch(e)}
        />
      </div>
      <section className={styles["history_list_section"]}>
        <h1>Recent Chats</h1>
        {filteredList.length > 0
          ? filteredList.map((chat: chatType) => {
              return (
                <div key={chat.id} className={styles["history_list_chat_div"]}>
                  {chat.title}
                </div>
              );
            })
          : recentChatsHistory?.map((chat) => {
              return (
                <div key={chat.id} className={styles["history_list_chat_div"]}>
                  {chat.title}
                </div>
              );
            })}
        <p>View more</p>
      </section>

      <div className={styles["new_chat_button_div"]} onClick={handleNewChat}>
        <p>New Chat</p>
        <Image src={newChatIcon} alt="plus_icon" width={24} height={24} />
      </div>
    </main>
  );
};
