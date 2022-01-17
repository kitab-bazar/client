import React from 'react';
import {
    ListView,
    Container,
} from '@the-deep/deep-ui';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';

import Footer from '#components/Footer';

import coverImage from '#resources/img/cover.jpg';
import styles from './styles.css';

import { getMediaUrl } from '#base/utils/common';

const FEATURED_BOOKS = gql`
query FeaturedBooks($page: Int!, $pageSize: Int!) {
    books(page: $page , pageSize: $pageSize) {
        results {
            id
            isbn
            language
            image
            price
            title
            description
            authors {
                id
                name
            }
        }
    }
}
`;

interface Author {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
    image: string;
    authors: Author[];
    price: number;
}

const bookKeySelector = (b: Book) => b.id;

interface BookProps {
    book: Book;
}

function BookItem(props: BookProps) {
    const { book } = props;

    return (
        <Link
            to={`/book/${book.id}/`}
            className={styles.bookItem}
            title={book.title}
        >
            <div className={styles.imageWrapper}>
                {book.image ? (
                    <img
                        className={styles.image}
                        src={getMediaUrl(book.image)}
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

function HomePage() {
    const { data: result, loading } = useQuery(FEATURED_BOOKS, {
        variables: {
            page: 1,
            pageSize: 10,
        },
    });
    const books = (!loading && result) ? result.books.results : [];
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
                >
                    <ListView
                        className={styles.bookList}
                        data={books}
                        keySelector={bookKeySelector}
                        rendererParams={bookItemRendererParams}
                        renderer={BookItem}
                        errored={false}
                        pending={loading}
                        filtered={false}
                    />
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
