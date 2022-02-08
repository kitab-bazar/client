import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';
import {
    BookType,
} from '#generated/types';

import styles from './styles.css';

export interface Props {
    className?: string;
    book: Pick<BookType, 'title' | 'id' | 'image' | 'authors' | 'price'>;
}

function BookItem(props: Props) {
    const {
        className,
        book,
    } = props;

    return (
        <Link
            to={`/book/${book.id}/`}
            className={_cs(styles.bookItem, className)}
            title={book.title}
        >
            <div className={styles.imageWrapper}>
                {book.image?.url ? (
                    <img
                        className={styles.image}
                        src={book.image.url}
                        alt={book.title}
                    />
                ) : (
                    <div className={styles.noPreview}>
                        Preview not available
                    </div>
                )}
            </div>
            <div className={styles.details}>
                <div
                    className={styles.title}
                >
                    {book.title}
                </div>
                <div className={styles.author}>
                    {book.authors[0].name}
                </div>
                <div className={styles.price}>
                    {`NPR ${book.price}`}
                </div>
            </div>
        </Link>
    );
}

export default BookItem;
