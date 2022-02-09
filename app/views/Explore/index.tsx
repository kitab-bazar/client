import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    CheckListInput,
    RadioInput,
    useInputState,
    ListView,
    Button,
    Pager,
    Header,
    TextInput,
    DropdownMenu,
    DropdownMenuItem,
    TextOutput,
} from '@the-deep/deep-ui';
import { IoSearchSharp } from 'react-icons/io5';
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
import BookDetailModal from '#components/BookDetailModal';

import BookItem, { Props as BookItemProps } from '#components/BookItem';

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
    $title: String,
) {
    books(
        categories: $categories,
        publisher: $publisher,
        ordering: $ordering,
        page: $page,
        pageSize: $pageSize,
        title: $title,
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
const MAX_ITEMS_PER_PAGE = 20;
type SortKeyType = 'price' | '-price' | 'id' | '-id';

const sortOptions: {
    [key in SortKeyType]: string;
} = {
    price: 'Price (Low to High)',
    '-price': 'Price (High to Low)',
    id: 'Date added (Older first)',
    '-id': 'Date added (Newer first)',
};
const sortKeys = Object.keys(sortOptions) as SortKeyType[];

interface Props {
    className?: string;
    // TODO: read publisher and category from state
    publisher?: string;
    category?: string;
    // wishList?: string;
}

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
    const [selectedSortKey, setSelectedSortKey] = useInputState<SortKeyType>('id');
    const [search, setSearch] = useInputState<string | undefined>(undefined);
    const [publisher, setPublisher] = useInputState<string | undefined>(undefined);
    const [selectedBookId, setSelectedBookId] = React.useState<string | undefined>();

    const [pageSize, setPageSize] = useState<number>(MAX_ITEMS_PER_PAGE);
    const [page, setPage] = useState<number>(1);

    const pageTitle = React.useMemo(() => {
        if (publisherFromProps) {
            return 'Explore Books by Publisher';
        }

        if (categoryFromProps) {
            return 'Explore Books by Category';
        }

        return 'Explore all Books';
    }, [publisherFromProps, categoryFromProps]);

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
                ordering: selectedSortKey,
                categories,
                publisher: publisherFromProps ?? publisher,
                title: (search ?? '').length > 3 ? search : undefined,
                // inWishList: wishListFromProps
            },
        },
    );

    const bookItemRendererParams = (
        _: string,
        book: Book,
    ): BookItemProps => ({
        book,
        onBookTitleClick: setSelectedBookId,
        variant: 'list',
    });

    const filtered = (categories && categories.length > 0) || !!publisher;

    return (
        <div className={_cs(styles.explore, className)}>
            <div className={styles.headerContainer}>
                <Header
                    className={styles.pageHeader}
                    heading={pageTitle}
                    spacing="loose"
                >
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        icons={<IoSearchSharp />}
                        placeholder="Search by title (3 or more characters)"
                        name={undefined}
                        value={search}
                        onChange={setSearch}
                    />
                </Header>
            </div>
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
                    <div className={styles.summary}>
                        <TextOutput
                            className={styles.bookCount}
                            value={bookResponse?.books?.totalCount}
                            label="Books found"
                        />
                        <DropdownMenu
                            label={`Order by: ${sortOptions[selectedSortKey]}`}
                        >
                            {sortKeys.map((sk) => (
                                <DropdownMenuItem
                                    key={sk}
                                    name={sk}
                                    onClick={setSelectedSortKey}
                                >
                                    {sortOptions[sk]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenu>
                    </div>
                    <ListView
                        className={styles.bookList}
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
                {selectedBookId && (
                    <BookDetailModal
                        bookId={selectedBookId}
                        onCloseButtonClick={setSelectedBookId}
                    />
                )}
            </div>
        </div>
    );
}

export default Explore;
