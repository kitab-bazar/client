import React from 'react';
import {
    Button,
    Card,
    Container,
    ListView,
    Tab,
    Tabs,
} from '@the-deep/deep-ui';
import { BiChevronsRight } from 'react-icons/bi';

import Aalu from '../HomePage/temp-img/Aalu.png';
import Biralo from '../HomePage/temp-img/Biralo.png';
import Riban from '../HomePage/temp-img/Riban.png';
import Pooja from '../HomePage/temp-img/Pooja.png';
import Footer from '#components/Footer';

import styles from './styles.css';

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
function BookDetail(props: BookProps) {
    const {
        book,
    } = props;

    const bookItemRendererParams = React.useCallback((_, data) => ({
        book: data,
    }), []);

    return (
        <div className={styles.book}>
            <div className={styles.pageContent}>
                <div className={styles.imageWrapper}>
                    <img
                        className={styles.image}
                        src={Aalu}
                        alt="aalu"
                    />
                </div>
                <div className={styles.bookDetailSection}>
                    <Container
                        headerActions={(
                            <div className={styles.bookDescription}>
                                <h1>Book 1</h1>
                                <h4>Language:English</h4>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Similique labore, itaque dignissimos,
                                    esse minima sint autem sequi porro dolore
                                    non aperiam consequatur culpa dolorum.
                                    Aut numquam voluptates impedit exercitationem porro ratione.
                                    Aliquam harum quos inventore iste! Nostrum quos repellat
                                    adipisci praesentium
                                    a odio incidunt eum,nulla dolor provident minus qui ex aut?
                                    Repellat eaque incidunt quos amet cupiditate voluptatum
                                    eveniet quas,
                                    aliquid molestias consequuntur!
                                </p>
                                <div className={styles.bookButtons}>
                                    <Button
                                        name={undefined}
                                        onClick={undefined}
                                        className={styles.loginButton}
                                        variant="primary"
                                        autoFocus
                                    >
                                        Add to wishlist
                                    </Button>
                                    <Button
                                        name={undefined}
                                        onClick={undefined}
                                        className={styles.loginButton}
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
                <Container
                    className={styles.bookDescriptionSection}
                >
                    <Tabs
                        onChange={undefined}
                        value="new-tab"
                    >
                        <Tab
                            name="new-tab"
                        >
                            <React.Fragment key=".0">
                                Description
                            </React.Fragment>
                        </Tab>
                        <Tab
                            name="new-tab"
                        >
                            <React.Fragment key=".0">
                                Content
                            </React.Fragment>
                        </Tab>
                        <Card>
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
                    </Tabs>
                </Container>
                <Container
                    className={styles.authorDescription}
                    heading="About the Author"
                />
                <Card>
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
