'use client';

import React, { useState } from "react";
import styles from "./registration.module.scss";
import { ChatContainer } from "@/components/chats/chatContainer/chat-container";

const Registration: React.FC = () => {
  const [consumerId, setConsumerId] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openChatContainer, setOpenChatContainer] = useState(false);

  const registerWithConsumerId = async () => {
    setLoading(true);
    setTimeout(() => {
      setOpenChatContainer(true);
      setLoading(false); // Hide the animation after the operation completes
    }, 2000);
  };

  return openChatContainer === true ? (
    <ChatContainer />
  ) : (
    <section>
      {loading && (
        <div className={styles["loaderContainer"]}>
          <div className={styles["loader"]}></div>
        </div>
      )}
      {!loading && (
        <div className={styles["consumerRegistrationForm"]}>
          <div className={styles["container"]}>
            <h1>Customer Registration</h1>
            <div className={styles["row"]}>
              <div className={styles["col-25"]}>
                <label>Enter your consumer id:</label>
              </div>
              <div className={styles["col-75"]}>
                <input
                  type="text"
                  pattern="[0-9]*"
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                />
              </div>
            </div>
            <div className={styles["row"]}>
              <input onClick={registerWithConsumerId} type="submit" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Registration;
