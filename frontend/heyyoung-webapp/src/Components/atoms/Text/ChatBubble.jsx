import React from 'react';
import styles from './ChatBubble.module.css';

const ChatBubble = ({ message, isVisible = false }) => {
  if (!isVisible || !message) return null;

  return (
    <div className={styles.chatBubbleContainer}>
      <div className={styles.chatBubble}>
        <div className={styles.bubbleContent}>
          <span className={styles.bubbleText}>{message}</span>
        </div>
        <div className={styles.bubbleTail}></div>
      </div>
    </div>
  );
};

export default ChatBubble;
