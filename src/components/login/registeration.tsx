/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import React, { useState } from "react";
import styles from "./registration.module.scss";
import { ChatContainer } from "@/components/chats/chatContainer/chat-container";

const Registration: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openChatContainer, setOpenChatContainer] = useState(false);

  const userLogin = async () => {
    if(userName === "") return alert("Please enter valid name");
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setOpenChatContainer(true);
      }, 2000);
      typeof window !== "undefined" && window?.sessionStorage?.setItem("userName", userName); 
    } catch (error) {
      console.error("Registration failed:", error);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userLogin();
  };

  if (openChatContainer) {
    return <ChatContainer />;
  }

  return (
    <section>
      {loading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      {!loading && (
        <div className={styles.consumerRegistrationForm}>
          <div className={styles.container}>
            <h1>User Login</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles["col-25"]}>
                  <label htmlFor="userName">Enter your sweet name:</label>
                </div>
                <div className={styles["col-75"]}>
                  <input
                    id="name"
                    type="text"
                    pattern="[A-Za-z]{3,20}"
                    placeholder="Your Name.."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.row}>
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Registration;