import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    CheckListInput,
    RadioInput,
    useInputState,
    ListView,
    Button,
    Pager,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import {
    ExploreFilterOptionsQuery,
    ExploreFilterOptionsQueryVariables,
    ExploreBooksQuery,
    ExploreBooksQueryVariables,
} from '#generated/types';

import BookItem, { Props as BookItemProps } from './BookItem';

import styles from './styles.css';

const EXPLORE_FILTER_OPTIONS = gql`
query ExploreFilterOptions {
    categories {
        results {
            id
            name
        }
    }
    publishers {
        results {
            id
            name
        }
    }
}
`;

const EXPLORE_BOOKS = gql`
query ExploreBooks(
    $categories: [ID!],
    $publisher: ID,
    $ordering: String,
    $page: Int,
    $pageSize: Int,
) {
    books(
    categories: $categories,
    publisher: $publisher,
    ordering: $ordering,
    page: $page,
    pageSize: $pageSize,
) {
        page
        pageSize
        totalCount
        results {
            id
            title
            price
            language
            image {
                name
                url
            }
            authors {
                id
                name
            }
            categories {
                id
                name
            }
            publisher {
                id
                name
            }

            cartDetails {
                id
                quantity
            }
            wishlistId
        }
    }
}
`;

type Book = NonNullable<NonNullable<ExploreBooksQuery['books']>['results']>[number];

const keySelector = (d: { id: string }) => d.id;
const labelSelector = (d: { name: string }) => d.name;

interface Props {
    className?: string;
    // TODO: read publisher and category from state
    publisher?: string;
    category?: string;
    // wishList?: string;
}

const MAX_ITEMS_PER_PAGE = 20;

function Explore(props: Props) {
    const {
        className,
        publisher: publisherFromProps,
        category: categoryFromProps,
        // wishList: wishListFromProps,
    } = props;

    const [categories, setCategories] = useInputState<string[] | undefined>(
        categoryFromProps
            ? [categoryFromProps]
            : undefined,
    );
    const [publisher, setPublisher] = useInputState<string | undefined>(undefined);

    const [pageSize, setPageSize] = useState<number>(MAX_ITEMS_PER_PAGE);
    const [page, setPage] = useState<number>(1);

    const {
        data: optionsQueryResponse,
        loading: filterLoading,
    } = useQuery<ExploreFilterOptionsQuery, ExploreFilterOptionsQueryVariables>(
        EXPLORE_FILTER_OPTIONS,
    );

    const {
        previousData,
        data: bookResponse = previousData,
        loading: bookLoading,
        error: bookError,
    } = useQuery<ExploreBooksQuery, ExploreBooksQueryVariables>(
        EXPLORE_BOOKS,
        {
            variables: {
                categories,
                publisher: publisherFromProps ?? publisher,
                // inWishList: wishListFromProps
            },
        },
    );

    const bookItemRendererParams = (
        _: string,
        book: Book,
    ): BookItemProps => ({
        book,
    });

    const filtered = (categories && categories.length > 0) || !!publisher;

    return (
        <div className={_cs(styles.explore, className)}>
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    <CheckListInput
                        label="Categories"
                        className={styles.categoriesInput}
                        listContainerClassName={styles.categoryList}
                        name={undefined}
                        options={optionsQueryResponse?.categories?.results ?? undefined}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        value={categories}
                        onChange={setCategories}
                        disabled={filterLoading}
                    />
                    {categories && categories.length > 0 && (
                        <Button
                            name={undefined}
                            onClick={setCategories}
                            variant="transparent"
                            spacing="none"
                            disabled={filterLoading}
                        >
                            Clear categories filter
                        </Button>
                    )}
                    {!publisherFromProps && (
                        <>
                            <RadioInput
                                label="Publisher"
                                className={styles.publisherInput}
                                listContainerClassName={styles.publisherList}
                                name={undefined}
                                options={optionsQueryResponse?.publishers?.results ?? undefined}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                value={publisher}
                                onChange={setPublisher}
                                disabled={filterLoading}
                            />
                            {publisher && (
                                <Button
                                    name={undefined}
                                    onClick={setPublisher}
                                    variant="transparent"
                                    spacing="none"
                                    disabled={filterLoading}
                                >
                                    Clear publisher filter
                                </Button>
                            )}
                        </>
                    )}
                </div>
                <div className={styles.bookList}>
                    <ListView
                        data={bookResponse?.books?.results ?? undefined}
                        rendererParams={bookItemRendererParams}
                        renderer={BookItem}
                        keySelector={keySelector}
                        errored={!!bookError}
                        filtered={filtered}
                        pending={bookLoading}
                    />
                    <Pager
                        activePage={page}
                        maxItemsPerPage={pageSize}
                        itemsCount={bookResponse?.books?.totalCount ?? 0}
                        onActivePageChange={setPage}
                        onItemsPerPageChange={setPageSize}
                        itemsPerPageControlHidden
                    />
                </div>
            </div>
        </div>
    );
}

export default Explore;
