import React from 'react';
import { MiniSelectBtn } from '../../atoms/Button';
import styles from './MapView.module.css';

const CategoryButtons = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.categoryContainer}>
      {/* 전체 탭 추가 */}
      <MiniSelectBtn
        label="전체"
        isSelected={selectedCategory === 'ALL'}
        onClick={() => onCategoryChange('ALL')}
      />
      
      {categories.map((category) => (
        <MiniSelectBtn
          key={category.id}
          label={category.displayName}
          isSelected={selectedCategory === category.code}
          onClick={() => onCategoryChange(category.code)}
        />
      ))}
    </div>
  );
};

export default CategoryButtons;
