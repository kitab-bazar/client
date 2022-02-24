import React, { useMemo } from 'react';
import {
    ListView,
    Container,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    isDefined,
    _cs,
} from '@togglecorp/fujs';

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import { homePage } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import BookDetailsModal from '#components/BookDetailModal';

import routes from '#base/configs/routes';
import {
    FeaturedBooksQuery,
    FeaturedBooksQueryVariables,
    GradeOptionsQuery,
    GradeOptionsQueryVariables,
    CategoryOptionsQuery,
    CategoryOptionsQueryVariables,
} from '#generated/types';
import coverImage from '#resources/img/cover.png';

import GradeItem, { Props as GradeItemProps } from './GradeItem';
import CategoryItem, { Props as CategoryItemProps } from './CategoryItem';

import styles from './styles.css';

const FEATURED_BOOKS = gql`
query FeaturedBooks($page: Int!, $pageSize: Int!) {
    books(page: $page , pageSize: $pageSize) {
        totalCount
        results {
            id
            isbn
            language
            languageDisplay
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

const CATEGORY_OPTIONS = gql`
query CategoryOptions {
    categories {
        results {
            id
            name
        }
    }
}
`;

const GRADE_OPTIONS = gql`
query GradeOptions {
    gradeList: __type(name: "BookGradeEnum") {
        enumValues {
            name
            description
        }
    }
}
`;

type Book = NonNullable<NonNullable<FeaturedBooksQuery['books']>['results']>[number]

const itemKeySelector = (b: { id: string }) => b.id;
const enumKeySelector = (d: { name: string }) => d.name;

const MAX_ITEMS_PER_PAGE = 4;

interface Props {
    className?: string;
}

function HomePage(props: Props) {
    const { className } = props;

    const orderVariables = useMemo(() => ({
        pageSize: MAX_ITEMS_PER_PAGE,
        page: 1,
        ordering: '-id',
    }), []);

    const [selectedBook, setSelectedBook] = React.useState<string | undefined>();
    const {
        data: featuredBookResponse,
        loading: featuredBooksLoading,
        error: featuredBooksError,
    } = useQuery<FeaturedBooksQuery, FeaturedBooksQueryVariables>(
        FEATURED_BOOKS,
        { variables: orderVariables },
    );

    const {
        data: gradeResponse,
        loading: gradeLoading,
        error: gradeError,
    } = useQuery<GradeOptionsQuery, GradeOptionsQueryVariables>(
        GRADE_OPTIONS,
    );

    const {
        data: categoryOptionsResponse,
        loading: categoryOptionsLoading,
        error: categoryOptionsError,
    } = useQuery<
        CategoryOptionsQuery,
        CategoryOptionsQueryVariables
    >(
        CATEGORY_OPTIONS,
    );

    const bookItemRendererParams = React.useCallback((_: string, data: Book): BookItemProps => ({
        onClick: setSelectedBook,
        variant: 'compact',
        book: data,
    }), []);

    const strings = useTranslation(homePage);

    const gradeItemRendererParams = React.useCallback((
        _: string,
        grade: NonNullable<NonNullable<GradeOptionsQuery['gradeList']>['enumValues']>[number],
    ): GradeItemProps => ({
        className: styles.gradeItem,
        grade,
    }), []);

    const categoryItemRendererParams = React.useCallback((
        _: string,
        category: NonNullable<NonNullable<CategoryOptionsQuery['categories']>['results']>[number],
    ): CategoryItemProps => ({
        className: styles.categoryItem,
        category,
    }), []);

    return (
        <div className={_cs(styles.home, className)}>
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
                                {strings.kitabLabel}
                            </div>
                            <div className={styles.bazar}>
                                {strings.bazarLabel}
                            </div>
                        </div>
                        <div className={styles.appDescription}>
                            {strings.tagLineLabel}
                        </div>
                        <div className={styles.actions}>
                            <SmartButtonLikeLink
                                route={routes.bookList}
                                variant="secondary"
                                spacing="loose"
                            >
                                {strings.exploreButtonLabel}
                            </SmartButtonLikeLink>
                        </div>
                    </div>
                </div>
                <div className={styles.pageContainer}>
                    <Container
                        className={styles.exploreByGradeSection}
                        heading={strings.exploreByGradeHeading}
                    >
                        <ListView
                            className={styles.gradeList}
                            data={gradeResponse?.gradeList?.enumValues}
                            keySelector={enumKeySelector}
                            rendererParams={gradeItemRendererParams}
                            renderer={GradeItem}
                            errored={!!gradeError}
                            pending={gradeLoading}
                            filtered={false}
                            emptyMessage={strings.emptyGradeListMessage}
                            pendingMessage={strings.pendingGradeListMessage}
                            messageShown
                        />
                    </Container>
                    <Container
                        className={styles.exploreByCategoriesSection}
                        heading={strings.exploreByCategoryHeading}
                    >
                        <ListView
                            className={styles.categoryList}
                            data={categoryOptionsResponse?.categories?.results}
                            keySelector={itemKeySelector}
                            rendererParams={categoryItemRendererParams}
                            renderer={CategoryItem}
                            errored={!!categoryOptionsError}
                            pending={categoryOptionsLoading}
                            filtered={false}
                            emptyMessage={strings.emptyCategoriesMessage}
                            pendingMessage={strings.pendingCategoriesMessage}
                            messageShown
                        />
                    </Container>
                    <Container
                        className={styles.featuredBooksSection}
                        heading={strings.featuredBooksLabel}
                    >
                        <ListView
                            className={styles.bookList}
                            data={featuredBookResponse?.books?.results ?? undefined}
                            keySelector={itemKeySelector}
                            rendererParams={bookItemRendererParams}
                            renderer={BookItem}
                            errored={!!featuredBooksError}
                            pending={featuredBooksLoading}
                            filtered={false}
                            emptyMessage={strings.emptyBooksMessage}
                            pendingMessage={strings.pendingBooksMessage}
                            messageShown
                        />
                        {isDefined(selectedBook) && (
                            <BookDetailsModal
                                bookId={selectedBook}
                                onCloseButtonClick={setSelectedBook}
                            />
                        )}
                    </Container>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
