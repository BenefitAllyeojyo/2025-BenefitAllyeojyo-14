import { SearchBtn } from '../Button';
import styles from './GptInput.module.css';
import { useState } from 'react';

export default function GptInput({placeholder="Search", onInputSubmit}) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim() && onInputSubmit) {
            onInputSubmit(inputValue.trim());
            setInputValue(''); // 입력 후 초기화
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className={styles.gptInput}>
            <input 
                className={styles.gptInputBox} 
                type="text" 
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            <SearchBtn onClick={handleSubmit}></SearchBtn>
        </div>
    )
}