import React, { useState, useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    CheckListInput,
    SegmentInput,
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
    useModalState,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
    IoAdd,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
} from '@apollo/client';

import { explore } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { UserContext } from '#base/context/UserContext';
import { resolveToString } from '#base/utils/lang';
import {
    ExploreFilterOptionsQuery,
    ExploreFilterOptionsQueryVariables,
    ExploreBooksQuery,
    ExploreBooksQueryVariables,
} from '#generated/types';
import BookDetailModal from '#components/BookDetailModal';
import UploadBookModal from '#components/UploadBookModal';
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
    $isAddedInWishlist: Boolean,
) {
    books(
        categories: $categories,
        publisher: $publisher,
        ordering: $ordering,
        page: $page,
        pageSize: $pageSize,
        title: $title,
        isAddedInWishlist: $isAddedInWishlist,
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

const MAX_ITEMS_PER_PAGE = 10;
type SortKeyType = 'price' | '-price' | 'id' | '-id';

type BookSource = 'own' | 'all';
interface BookSourceOption {
    id: BookSource;
    name: string;
}

const bookSources: BookSourceOption[] = [
    { id: 'own', name: 'My books' },
    { id: 'all', name: 'All books' },
];
const bookSourceKeySelector = (item: BookSourceOption) => item.id;
const bookSourceLabelSelector = (item: BookSourceOption) => item.name;

interface Props {
    className?: string;
    wishList?: boolean;
    // category?: string;
}

function Explore(props: Props) {
    const {
        className,
        // category: categoryFromProps,
        wishList: wishListFromProps,
    } = props;

    const { user } = useContext(UserContext);
    const strings = useTranslation(explore);

    const canAddBook = user?.permissions.includes('CAN_CREATE_BOOK');

    const [selectedBookId, setSelectedBookId] = React.useState<string | undefined>();
    const [page, setPage] = useState<number>(1);

    // NOTE: A different UI depending on if user is publisher or not
    const publisherId = user?.publisherId;
    // NOTE: only used when in publisher mode
    const [bookSource, setBookSource] = useInputState<BookSource | undefined>('own');

    const [categories, setCategories] = useInputState<string[] | undefined>(undefined);
    const [selectedSortKey, setSelectedSortKey] = useInputState<SortKeyType>('id');
    const [search, setSearch] = useInputState<string | undefined>(undefined);
    const [publisher, setPublisher] = useInputState<string | undefined>(undefined);

    // eslint-disable-next-line no-nested-ternary
    const effectivePublisher = publisherId
        ? (bookSource === 'own' ? publisherId : undefined)
        : publisher;

    const pageTitle = React.useMemo(() => {
        if (publisherId) {
            return strings.pageTitlePublisher;
        }

        /*
        if (categoryFromProps) {
            return strings.pageTitleExploreByCategory;
        }
        */

        if (wishListFromProps) {
            return strings.pageTitleWishList;
        }

        return strings.pageTitleDefault;
    }, [strings, publisherId, wishListFromProps]);

    const [
        sortOptions,
        sortKeys,
    ] = React.useMemo(() => {
        const options: {
            [key in SortKeyType]: string;
        } = {
            price: strings.sortOptionsPriceAsc,
            '-price': strings.sortOptionsPriceDsc,
            id: strings.sortOptionsDateAsc,
            '-id': strings.sortOptionsDateDsc,
        };
        const keys = Object.keys(options) as SortKeyType[];

        return [
            options,
            keys,
        ];
    }, [strings]);

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
        refetch: refetchBooks,
    } = useQuery<ExploreBooksQuery, ExploreBooksQueryVariables>(
        EXPLORE_BOOKS,
        {
            variables: {
                ordering: selectedSortKey,
                categories,
                publisher: effectivePublisher,
                title: (search && search.length > 3) ? search : undefined,
                pageSize: MAX_ITEMS_PER_PAGE,
                page,
                isAddedInWishlist: wishListFromProps,
            },
        },
    );

    const bookItemRendererParams = React.useCallback((
        _: string,
        book: Book,
    ): BookItemProps => ({
        book,
        onBookTitleClick: setSelectedBookId,
        variant: 'list',
    }), []);

    const filtered = (categories && categories.length > 0) || !!publisher;
    const [
        uploadBookModalShown,
        showUploadBookModal,
        hideUploadBookModal,
    ] = useModalState(false);

    return (
        <div className={_cs(styles.explore, className)}>
            <div className={styles.headerContainer}>
                <Header
                    className={styles.pageHeader}
                    heading={pageTitle}
                    spacing="loose"
                    actions={canAddBook && (
                        <Button
                            name={undefined}
                            onClick={showUploadBookModal}
                            icons={<IoAdd />}
                        >
                            Add New Book
                        </Button>
                    )}
                >
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        icons={<IoSearchSharp />}
                        placeholder={strings.searchInputPlaceholder}
                        name={undefined}
                        value={search}
                        onChange={setSearch}
                    />
                </Header>
                {uploadBookModalShown && effectivePublisher && (
                    <UploadBookModal
                        publisher={effectivePublisher}
                        onModalClose={hideUploadBookModal}
                        // FIXME: This might not be required
                        onUploadSuccess={refetchBooks}
                    />
                )}
            </div>
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    {publisherId && (
                        <RadioInput
                            className={styles.publisherInput}
                            listContainerClassName={styles.publisherList}
                            name={undefined}
                            options={bookSources}
                            keySelector={bookSourceKeySelector}
                            labelSelector={bookSourceLabelSelector}
                            value={bookSource}
                            onChange={setBookSource}
                            disabled={filterLoading}
                        />
                    )}
                    <CheckListInput
                        label={strings.categoriesFilterLabel}
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
                            {strings.clearCategoriesFilterButtonLabel}
                        </Button>
                    )}
                    {!publisherId && (
                        <>
                            <RadioInput
                                label={strings.publisherFilterLabel}
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
                                    {strings.clearPublisherFilterButtonLabel}
                                </Button>
                            )}
                        </>
                    )}
                </div>
                <div className={styles.bookListSection}>
                    <div className={styles.summary}>
                        <TextOutput
                            className={styles.bookCount}
                            value={bookResponse?.books?.totalCount}
                            label={strings.booksFoundLabel}
                        />
                        <DropdownMenu
                            label={resolveToString(
                                strings.activeSortLabel,
                                { sortLabel: sortOptions[selectedSortKey] },
                            )}
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
                        messageShown
                    />
                    <Pager
                        activePage={page}
                        maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                        itemsCount={bookResponse?.books?.totalCount ?? 0}
                        onActivePageChange={setPage}
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
