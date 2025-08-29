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

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        console.log('🤖 GPT 입력 제출:', inputValue);

        try {
            const response = await callGptApi(inputValue, availableStores);
            console.log('✅ GPT API 응답:', response);

            if (response.success) {
                console.log('🤖 GPT 응답 메시지:', response.message);
                
                // GPT 응답에서 숫자 추출
                const gptResponse = response.message;
                const markerId = parseInt(gptResponse);
                
                console.log('🔢 추출된 마커 ID:', markerId);
                
                // 부모 컴포넌트에 GPT 응답과 마커 ID 전달
                if (onInputSubmit) {
                    onInputSubmit(inputValue.trim(), markerId, gptResponse);
                }
            } else {
                console.error('❌ GPT API 실패:', response.message);
            }
        } catch (err) {
            console.error('❌ GPT 입력 처리 오류:', err);
        } finally {
            setInputValue(''); // 입력 후 초기화
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
                    disabled={!inputValue.trim()}
                >
                    🔍
                </SearchBtn>
            </div>
        </div>
    );
};

export default GptInput;