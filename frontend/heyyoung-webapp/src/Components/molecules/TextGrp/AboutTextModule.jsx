import styles from './AboutTextModule.module.css'

export default function AboutTextModule({
    Content="캠퍼스 혜택, 전부 모았다!",
    discountRate=0,
    discountAmount=0
  }) {

    const formatContent = () => {
      let content = Content;
      
      if (discountRate && discountAmount) {
        content += `\n${discountRate}% 할인 (최대 ${discountAmount.toLocaleString()}원)`;
      }
      
      return content;
    };
                
    return (
      <div className={styles.AboutTextModule}>
        <div className={styles.Title}>ABOUT</div>
        <div className={styles.Content}>{formatContent()}</div>
      </div>
    )
  }
  