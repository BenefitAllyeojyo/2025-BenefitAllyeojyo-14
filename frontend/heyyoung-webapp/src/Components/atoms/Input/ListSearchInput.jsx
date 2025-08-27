import { useState, useEffect } from 'react';
import './ListSearchInput.css';
import searchIcon from '@/Icons/svg/search.svg';

export default function ListSearchInput({ 
    items = [], // 검색할 항목들의 배열
    onFilteredItemsChange, // 필터링된 결과를 부모 컴포넌트에 전달하는 콜백
    searchKey = 'name', // 검색할 속성 키 (기본값: 'name')
    placeholder = "Search" // 입력창 플레이스홀더
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    // 검색어가 변경될 때마다 실시간으로 필터링
    useEffect(() => {
        if (!searchTerm.trim()) {
            // 검색어가 없으면 모든 항목 표시
            setFilteredItems(items);
        } else {
            // 검색어를 포함하는 항목만 필터링
            const filtered = items.filter(item => {
                const searchValue = item[searchKey]?.toString().toLowerCase() || '';
                return searchValue.includes(searchTerm.toLowerCase());
            });
            setFilteredItems(filtered);
        }

        // 부모 컴포넌트에 필터링된 결과 전달
        if (onFilteredItemsChange) {
            onFilteredItemsChange(filteredItems);
        }
    }, [searchTerm, items, searchKey, onFilteredItemsChange]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="list-search-input">
            <img src={searchIcon} alt="search" />
            <input 
                type="text" 
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
            />
        </div>
    );
}