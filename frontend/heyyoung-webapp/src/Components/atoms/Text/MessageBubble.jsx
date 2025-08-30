import React from 'react'
import styles from './MessageBubble.module.css'

export default function MessageBubble({
    text,
  }) {

                
    return (
      <div className={`${styles.messageBubble}`}>
            {text.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
      </div>
    )
  }
  