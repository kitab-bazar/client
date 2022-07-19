import React from 'react';
import {
    ListView,
    Container,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    _cs,
} from '@togglecorp/fujs';

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import { homePage } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import routes from '#base/configs/routes';
import {
    CategoryWithGradeOptionsQuery,
} from '#generated/types';
import coverImage from '#resources/img/cover.png';

import GradeItem, { Props as GradeItemProps } from './GradeItem';
import CategoryItem, { Props as CategoryItemProps } from './CategoryItem';
import TopSellingItem from './TopSellingItem';

import styles from './styles.css';

/*
const MAX_ITEMS_PER_PAGE = 4;

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

type Book = NonNullable<NonNullable<FeaturedBooksQuery['books']>['results']>[number]
*/

const CATEGORY_WITH_GRADE_OPTIONS = gql`
query CategoryWithGradeOptions {
    categories {
        results {
            id
            name
            image {
                name
                url
            }
        }
    }
    gradeList: __type(name: "BookGradeEnum") {
        enumValues {
            name
            description
        }
    }
}
`;

const itemKeySelector = (b: { id: string }) => b.id;
const enumKeySelector = (d: { name: string }) => d.name;

interface Props {
    className?: string;
}

function HomePage(props: Props) {
    const { className } = props;

    /*
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
    const bookItemRendererParams = React.useCallback((_: string, data: Book): BookItemProps => ({
        onClick: setSelectedBook,
        variant: 'compact',
        book: data,
    }), []);
    */

    const {
        data: categoryWithGradeOptionsResponse,
        loading: categoriesGradesLoading,
        error: categoriesGradesError,
    } = useQuery<CategoryWithGradeOptionsQuery>(
        CATEGORY_WITH_GRADE_OPTIONS,
    );

    const strings = useTranslation(homePage);

    const gradeItemRendererParams = React.useCallback((
        _: string,
        grade: NonNullable<NonNullable<CategoryWithGradeOptionsQuery['gradeList']>['enumValues']>[number],
    ): GradeItemProps => ({
        className: styles.gradeItem,
        grade,
    }), []);

    const categoryItemRendererParams = React.useCallback((
        _: string,
        category: NonNullable<NonNullable<CategoryWithGradeOptionsQuery['categories']>['results']>[number],
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
                        className={styles.exploreByCategoriesSection}
                        heading={strings.highestSellingBooksHeading}
                    >
                        <TopSellingItem />
                    </Container>
                    <Container
                        className={styles.exploreByGradeSection}
                        heading={strings.exploreByGradeHeading}
                    >
                        <ListView
                            className={styles.gradeList}
                            data={categoryWithGradeOptionsResponse?.gradeList?.enumValues}
                            keySelector={enumKeySelector}
                            rendererParams={gradeItemRendererParams}
                            renderer={GradeItem}
                            errored={!!categoriesGradesError}
                            pending={categoriesGradesLoading}
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
                            data={categoryWithGradeOptionsResponse?.categories?.results}
                            keySelector={itemKeySelector}
                            rendererParams={categoryItemRendererParams}
                            renderer={CategoryItem}
                            errored={!!categoriesGradesError}
                            pending={categoriesGradesLoading}
                            filtered={false}
                            emptyMessage={strings.emptyCategoriesMessage}
                            pendingMessage={strings.pendingCategoriesMessage}
                            messageShown
                        />
                    </Container>

                    {/*
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
                    */}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
