'use client';

import React, { useState } from "react";
import styles from "./registration.module.scss";
import { ChatContainer } from "@/components/chats/chatContainer/chat-container";

const Registration: React.FC = () => {
  const [consumerId, setConsumerId] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openChatContainer, setOpenChatContainer] = useState(false);

  const registerWithConsumerId = async () => {
    if (!consumerId.trim()) {
      alert("Please enter a consumer ID");
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        setOpenChatContainer(true);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerWithConsumerId();
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
            <h1>Customer Registration</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles["col-25"]}>
                  <label htmlFor="consumerId">Enter your consumer id:</label>
                </div>
                <div className={styles["col-75"]}>
                  <input
                    id="consumerId"
                    type="text"
                    pattern="[0-9]*"
                    value={consumerId}
                    onChange={(e) => setConsumerId(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.row}>
                <input type="submit" value="Register" />
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Registration;