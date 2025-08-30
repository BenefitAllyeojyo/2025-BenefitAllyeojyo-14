import { SearchBtn } from '../Button';
import styles from './GptInput.module.css';
import { useState } from 'react';
import { callGptApi } from '../../../services/api/gpt';

const GptInput = ({ 
  placeholder = "Search", 
  onInputSubmit,
  showResponse = true,
  availableStores = []
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading) return;

        const currentInput = inputValue.trim();

        // 로딩 상태 시작
        setIsLoading(true);

        // 입력창 즉시 비우기
        setInputValue('');

        // 로딩 시작 알림
        if (onInputSubmit) {
            onInputSubmit(currentInput, null, null, true);
        }

        try {
            const response = await callGptApi(currentInput, availableStores);

            if (response.success) {
                // GPT 응답에서 숫자 추출
                const gptResponse = response.message;
                const markerId = parseInt(gptResponse);
                
                // 부모 컴포넌트에 GPT 응답과 마커 ID 전달
                if (onInputSubmit) {
                    onInputSubmit(currentInput, markerId, gptResponse, false);
                }
            }
        } catch (err) {
            // GPT 입력 처리 오류 시 무시
        } finally {
            // 로딩 상태 종료
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className={styles.gptInputContainer}>
            <div className={styles.gptInput}>
                <input 
                    className={styles.gptInputBox} 
                    type="text" 
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <SearchBtn 
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isLoading}
                >
                    🔍
                </SearchBtn>
            </div>
        </div>
    );
};

export default GptInput;