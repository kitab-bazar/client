import React from 'react';
import {
    ListView,
    ButtonLikeLink,
    Container,
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

import BookItem from '#components/BookItem';
import { homePage } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import {
    FeaturedBooksQuery,
    FeaturedBooksQueryVariables,
} from '#generated/types';

import coverImage from '#resources/img/cover.png';
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

function HomePage() {
    const { data: result, loading } = useQuery<FeaturedBooksQuery, FeaturedBooksQueryVariables>(
        FEATURED_BOOKS,
        {
            variables: {
                page: 1,
                pageSize: 10,
            },
        },
    );
    const books = result?.books?.results ?? undefined;

    const bookItemRendererParams = React.useCallback((_: string, data: Book) => ({
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
                            <ButtonLikeLink
                                to="#"
                                // TODO: implement page
                                // TODO: use SmartButtonLikeLink
                                variant="secondary"
                                spacing="loose"
                                // FIXME: translate
                            >
                                Explore the Platform
                            </ButtonLikeLink>
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
                    >
                        <ListView
                            className={styles.bookList}
                            data={books}
                            keySelector={bookKeySelector}
                            rendererParams={bookItemRendererParams}
                            renderer={BookItem}
                            // FIXME: handle error
                            errored={false}
                            pending={loading}
                            filtered={false}
                        />
                    </Container>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
