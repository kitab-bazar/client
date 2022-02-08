import React from 'react';
import {
    ListView,
    Container,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import BookItem from '#components/BookItem';
import Footer from '#components/Footer';
import { homePage } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import {
    FeaturedBooksQuery,
    FeaturedBooksQueryVariables,
} from '#generated/types';

import coverImage from '#resources/img/cover.jpg';
import styles from './styles.css';

const FEATURED_BOOKS = gql`
query FeaturedBooks($page: Int!, $pageSize: Int!) {
    books(page: $page , pageSize: $pageSize) {
        results {
            id
            isbn
            language
            image {
                name
                url
            }
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

type Book = NonNullable<NonNullable<FeaturedBooksQuery['books']>['results']>[number]
const bookKeySelector = (b: Book) => b.id;

function HomePage() {
    const { data: result, loading } = useQuery<
        FeaturedBooksQuery,
        FeaturedBooksQueryVariables
    >(FEATURED_BOOKS, {
        variables: {
            page: 1,
            pageSize: 10,
        },
    });
    const books = result?.books?.results ?? undefined;
    const bookItemRendererParams = React.useCallback((_, data) => ({
        book: data,
    }), []);
    const homePageStrings = useTranslation(homePage);

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
                                {homePageStrings.kitabLabel}
                            </div>
                            <div className={styles.bazar}>
                                {homePageStrings.bazarLabel}
                            </div>
                        </div>
                        <div className={styles.appDescription}>
                            {homePageStrings.tagLineLabel}
                        </div>
                    </div>
                </div>
                <Container
                    className={styles.featuredBooksSection}
                    heading={homePageStrings.featuredBooksLabel}
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
