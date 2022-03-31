import React from 'react';
import EbookBar from '#components/EbookBar';
import styles from './styles.css';

function EBook() {
    return (
        <div className={styles.ebook}>
            <EbookBar />
        </div>
    );
}

export default EBook;
