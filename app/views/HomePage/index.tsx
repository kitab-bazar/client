import React from 'react';
import {
    SelectInput,
    ListView,
    Container,
} from '@the-deep/deep-ui';

import Footer from '#components/Footer';

import Biralo from './temp-img/Biralo.png';
// import Chaad from './temp-img/Chaad.png';
// import Bahinee from './temp-img/Bahinee.png';
import Riban from './temp-img/Riban.png';
import Pooja from './temp-img/Pooja.png';
// import Aawaj from './temp-img/Aawaj.png';
import Aalu from './temp-img/Aalu.png';
import coverImage from './cover.jpg';

import styles from './styles.css';

const optionLabelSelector = (d: any) => d.title;
const optionKeySelector = (d: any) => d.id;
const handleInputChange = (d: any) => d.value;

interface Book {
    id: number;
    title: string;
    image: string;
    author: string,
    price: number,
}

const bookKeySelector = (b: Book) => b.id;

const books = [
    {
        id: 1,
        title: 'Aalu',
        image: Aalu,
        author: 'Subina',
        price: 467,
    },
    {
        id: 2,
        title: 'Biralo',
        image: Biralo,
        author: 'Barsha',
        price: 650,
    },
    {
        id: 3,
        title: 'Riban',
        image: Riban,
        author: 'Safar Sanu Ligar',
        price: 345,
    },
    {
        id: 4,
        title: 'Pooja',
        image: Pooja,
        author: 'Pooja',
        price: 800,
    },
];

interface BookProps {
    book: Book;
}

function BookItem(props: BookProps) {
    const {
        book,
    } = props;

    return (
        <div className={styles.bookItem}>
            <div className={styles.imageWrapper}>
                <img
                    className={styles.image}
                    src={book.image}
                    alt={book.title}
                />
            </div>
            <div className={styles.details}>
                <div className={styles.title}>
                    {book.title}
                </div>
                <div className={styles.author}>
                    {book.author}
                </div>
                <div className={styles.price}>
                    {book.price}
                </div>
            </div>
        </div>
    );
}

function HomePage() {
    const bookItemRendererParams = React.useCallback((_, data) => ({
        book: data,
    }), []);

    return (
        <div className={styles.home}>
            <div className={styles.pageContent}>
                <div className={styles.coverImageContainer}>
                    <img
                        className={styles.coverImage}
                        src={coverImage}
                        alt=""
                    />
                    <div className={styles.topLayer}>
                        <div className={styles.appName}>
                            <div className={styles.kitab}>
                                Kitab
                            </div>
                            <div className={styles.bazar}>
                                Bazar
                            </div>
                        </div>
                        <div className={styles.appDescription}>
                            Knowledge Improvement Through Access of Books
                        </div>
                    </div>
                </div>
                <Container
                    className={styles.featuredBooksSection}
                    heading="Featured Books"
                    headerActions={(
                        <div className={styles.filter}>
                            <SelectInput
                                name="sort"
                                keySelector={optionKeySelector}
                                labelSelector={optionLabelSelector}
                                value={undefined}
                                onChange={handleInputChange}
                                options={undefined}
                                label="Sort by"
                                placeholder="Recently added"
                            />
                            <SelectInput
                                name="filter"
                                keySelector={optionKeySelector}
                                labelSelector={optionLabelSelector}
                                value={undefined}
                                onChange={handleInputChange}
                                options={undefined}
                                label="Filter by category"
                                placeholder="Category"
                            />
                        </div>
                    )}
                >
                    <ListView
                        className={styles.bookList}
                        data={books}
                        keySelector={bookKeySelector}
                        rendererParams={bookItemRendererParams}
                        renderer={BookItem}
                        errored={false}
                        pending={false}
                        filtered={false}
                    />
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
