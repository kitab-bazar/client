import React, { useState, useMemo } from 'react';
import {
    ListView,
    Container,
    Pager,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    FaTruck,
    FaBookReader,
    FaHandshake,
    FaGift,
} from 'react-icons/fa';
import { isDefined } from '@togglecorp/fujs';

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import { homePage } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import BookDetailsModal from '#components/BookDetailModal';

import routes from '#base/configs/routes';
import {
    FeaturedBooksQuery,
    FeaturedBooksQueryVariables,
} from '#generated/types';

import coverImage from '#resources/img/cover.png';
import styles from './styles.css';

const FEATURED_BOOKS = gql`
query FeaturedBooks($page: Int!, $pageSize: Int!) {
    books(page: $page , pageSize: $pageSize) {
        totalCount
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

interface GoalPointProps {
    icon: React.ReactNode;
    description: string;
}

function GoalPoint(props: GoalPointProps) {
    const {
        icon,
        description,
    } = props;

    return (
        <div className={styles.goalPoint}>
            <div className={styles.icon}>
                {icon}
            </div>
            <div className={styles.goalDescription}>
                {description}
            </div>
        </div>
    );
}

const MAX_ITEMS_PER_PAGE = 4;

function HomePage() {
    const [page, setPage] = useState<number>(1);

    const orderVariables = useMemo(() => ({
        pageSize: MAX_ITEMS_PER_PAGE,
        page,
    }), [page]);

    const [selectedBook, setSelectedBook] = React.useState<string | undefined>();
    const {
        data: result,
        loading,
        error,
    } = useQuery<FeaturedBooksQuery, FeaturedBooksQueryVariables>(
        FEATURED_BOOKS,
        {
            variables: orderVariables,
        },
    );

    const bookItemRendererParams = React.useCallback((_: string, data: Book): BookItemProps => ({
        onClick: setSelectedBook,
        variant: 'compact',
        book: data,
    }), []);

    const strings = useTranslation(homePage);

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
                                route={routes.explore}
                                variant="secondary"
                                spacing="loose"
                            >
                                {strings.exploreButtonLabel}
                            </SmartButtonLikeLink>
                        </div>
                    </div>
                </div>
                <div className={styles.pageContainer}>
                    <div className={styles.description}>
                        <Container
                            className={styles.whoAreWe}
                            heading={strings.whoAreWeLabel}
                        >
                            {strings.whoAreWeDescription}
                        </Container>
                        <Container
                            className={styles.platformBackground}
                            heading={strings.backgroundLabel}
                        >
                            {strings.platformBackground}
                        </Container>
                        <Container
                            className={styles.goals}
                            heading={strings.goalsLabel}
                        >
                            <p>
                                {strings.firstGoalDescription}
                            </p>
                            <p>
                                {strings.secondGoalDescription}
                            </p>
                        </Container>
                        <Container
                            className={styles.goalPoints}
                            contentClassName={styles.goalPointList}
                        >
                            <GoalPoint
                                icon={<FaBookReader />}
                                description={strings.accessToReadingMaterialText}
                            />
                            <GoalPoint
                                icon={<FaGift />}
                                description={strings.bookCornerIncentiveText}
                            />
                            <GoalPoint
                                icon={<FaHandshake />}
                                description={strings.relationshipEnhacementText}
                            />
                            <GoalPoint
                                icon={<FaTruck />}
                                description={strings.supplyChainText}
                            />
                        </Container>
                    </div>
                    <Container
                        className={styles.featuredBooksSection}
                        heading={strings.featuredBooksLabel}
                        footerContent={(
                            <Pager
                                activePage={page}
                                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                                itemsCount={result?.books?.totalCount ?? 0}
                                onActivePageChange={setPage}
                                itemsPerPageControlHidden
                            />
                        )}
                    >
                        <ListView
                            className={styles.bookList}
                            data={result?.books?.results ?? undefined}
                            keySelector={bookKeySelector}
                            rendererParams={bookItemRendererParams}
                            renderer={BookItem}
                            errored={!!error}
                            pending={loading}
                            filtered={false}
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
