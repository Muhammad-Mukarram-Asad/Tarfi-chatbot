import styles from "./loadingAnimation.module.scss"
export function LoadingBubble() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-teal-500 text-white px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}

export const LoadingBubble2 = () => {
  return (
    <div className={styles["typing-indicator"]}>
  {/* <span>Thinking</span> */}
  <div className={styles["dot"]}></div>
  <div className={styles["dot"]}></div>
  <div className={styles["dot"]}></div>
</div>
  )
}

export const LoadingBubble3 = () => {
  return (
   <div className={styles["thinking-message"]}>
  {/* <span>Thinking</span> */}
  <div className={styles["thinking-dots"]}></div>
</div>
  )
}

export const LoadingBubble4 = () => {
  return (
    <p className={styles["loading-text"]}>Thinking</p>
  )
}
