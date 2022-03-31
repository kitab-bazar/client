import React from 'react';
import {
    IoBookSharp,
    IoGlobeOutline,
} from 'react-icons/io5';
import { Button, Container } from '@the-deep/deep-ui';
import SaveChild from './savechild.jpg';
import styles from './styles.css';

const bookCoverPreview = (
    <div className={styles.preview}>
        <img
            className={styles.image}
            src={SaveChild}
            alt="img not found"
        />
    </div>
);
function EbookBar() {
    return (
        <div className={styles.ebook}>
            {bookCoverPreview}
            <div className={styles.linkContent}>
                <Container
                    className={styles.details}
                    headingSize="large"
                    heading="Save the Children"
                />
                <div className={styles.content}>
                    <Button
                        className={styles.bookButton}
                        name="link"
                        variant="primary"
                        // eslint-disable-next-line react/destructuring-assignment
                        onClick={undefined}
                    >
                        Goto Site
                        <IoGlobeOutline className={styles.fallbackIcon} />
                    </Button>
                    <Button
                        className={styles.bookButton}
                        name="link"
                        variant="primary"
                        // eslint-disable-next-line react/destructuring-assignment
                        onClick={undefined}
                    >
                        Ebook Site
                        <IoBookSharp className={styles.fallbackIcon} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EbookBar;
