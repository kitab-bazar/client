import React from 'react';
import {
    Button,
    Card,
    Container,
    ListView,
    Tab,
    TabPanel,
    Tabs,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { useParams } from 'react-router-dom';
import { BiChevronsRight } from 'react-icons/bi';

import Footer from '#components/Footer';
import { BACKEND_SERVER_URL } from '#base/configs/env';

import styles from './styles.css';

const BOOK_DETAIL = gql`
query MyBookDetail ($id: ID!){
    book(id: $id ) {
        description
        id
        image
        isbn
        edition
        language
        price
        metaDescription
        metaKeywords
        metaTitle
        numberOfPages
        ogDescription
        ogImage
        ogLocale
        ogTitle
        ogType
        title
      authors {
            id
            name
        }
    }
}
`;

const bookKeySelector = (b: Book) => b.id;

interface Book {
    id: number;
    title: string;
    image: string;
    author: string,
    price: number,
    description: string,
}

interface BookProps {
    book: Book;
}

function SimilarBook(props: BookProps) {
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

function BookDetail() {
    const { id } = useParams();

    const { data: result, loading } = useQuery(BOOK_DETAIL, {
        variables: { id },
    });
    const book = (!loading && result) ? result.book : [];

    const bookItemRendererParams = React.useCallback((_, data) => ({
        book: data,
    }), []);

    return (
        <div className={styles.book}>
            <div className={styles.pageContent}>
                <div className={styles.imageWrapper}>
                    <img
                        className={styles.image}
                        src={`${BACKEND_SERVER_URL}/media/${book.image}`}
                        alt={book.title}
                    />
                </div>
                <div className={styles.bookDetailSection}>
                    <Container
                        headerActions={(
                            <div className={styles.bookDescription}>
                                <h1>{book.title}</h1>
                                <h4>
                                    Language:
                                    {book.language}
                                </h4>
                                <p>
                                    {book.description}
                                </p>
                                <p>
                                    ISBN:
                                    {book.isbn}
                                </p>
                                <div className={styles.bookButtons}>
                                    <Button
                                        name={undefined}
                                        onClick={undefined}
                                        variant="primary"
                                        autoFocus
                                    >
                                        Add to wishlist
                                    </Button>
                                    <Button
                                        name={undefined}
                                        onClick={undefined}
                                        variant="primary"
                                        autoFocus
                                    >
                                        Buy the book NPR:150
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
            <div className={styles.bookDescriptionContent}>
                <Container className={styles.bookDescriptionSection}>
                    <Tabs
                        onChange={undefined}
                        value="description-tab"
                    >
                        <Tab
                            name="description-tab"
                        >
                            <React.Fragment key=".0">
                                Description
                            </React.Fragment>
                        </Tab>
                        <Tab
                            name="content-tab"
                        >
                            <React.Fragment key=".0">
                                Content
                            </React.Fragment>
                        </Tab>
                        <TabPanel name="description-tab">
                            {book.description}
                        </TabPanel>
                    </Tabs>
                </Container>
                <Container
                    className={styles.authorDescription}
                    heading="About the Author"
                />
                {!loading && (
                    <Card>
                        {book.authors.forEach((author: any) => {
                            <p>{author.name}</p>;
                        })}
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Nulla sed convallis quam, quis molestie nisi.
                        Integer fringilla maximus tellus at aliquam.
                        Nunc ac turpis non elit placerat luctus. Mauris vehicula,
                        dui vitae feugiat malesuada, diam elit porttitor
                        tellus, ut ultricies nibh est at ante.
                        Maecenas congue congue nulla quis feugiat.
                        Etiam porta volutpat mollis. Morbi libero eros,
                        malesuada nec metus ac, varius cursus purus.
                        Proin metus tellus, fermentum vel tellus et,
                        tristique mattis urna. Nunc sapien sapien, malesuada
                        posuere nulla in, imperdiet placerat o
                        Phasellus dapibus magna sit amet neque sollicitudin
                        laoreet.
                    </Card>
                )}
                <Container
                    className={styles.authorDescription}
                    heading="Similar Books"
                />
                <div className={styles.similarBooksList}>
                    <ListView
                        className={styles.bookList}
                        data={books}
                        keySelector={bookKeySelector}
                        rendererParams={bookItemRendererParams}
                        renderer={SimilarBook}
                        errored={false}
                        pending={false}
                        filtered={false}
                    />
                    <BiChevronsRight />
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default BookDetail;
