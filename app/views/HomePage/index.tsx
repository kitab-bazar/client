import React, { useState } from 'react';
import {
    SelectInput,
    ListView,
    Container,
} from '@the-deep/deep-ui';
import { Link } from 'react-router-dom';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';

import Footer from '#components/Footer';

import coverImage from './cover.jpg';

import styles from './styles.css';
import { BACKEND_SERVER_URL } from '#base/configs/env';

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
        nameEn
      }
    }
  }
`;

const optionLabelSelector = (d: any) => d.title;
const optionKeySelector = (d: any) => d.id;
const handleInputChange = (d: any) => d.value;

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
    const {
        book,
    } = props;

    return (
        <Link
            style={{
                textDecoration: 'none',
            }}
            to={`/book/${book.id}`}
        >
            <div className={styles.bookItem}>
                <div className={styles.imageWrapper}>
                    <img
                        className={styles.image}
                        src={`${BACKEND_SERVER_URL}/media/${book.image}`}
                        alt={book.title}
                    />
                </div>
                <div className={styles.details}>
                    <div className={styles.title}>
                        {book.title}
                    </div>
                    <div className={styles.author}>
                        {book.authors[0].name}
                    </div>
                    <div className={styles.price}>
                        {`NPR ${book.price}`}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function HomePage() {
    const [page, setPage] = useState<number>(1);

    const { data: result, loading, refetch } = useQuery(FEATURED_BOOKS, {
        variables: {
            page: 1,
            pageSize: 10,
        },
    });
    const books = (!loading && result) ? result.books.results : [];
    const bookItemRendererParams = React.useCallback((_, data) => ({
        book: data,
    }), []);

    const nextPage = React.useCallback(() => {
        setPage(page + 1);
        refetch();
    }, []);

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
