import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
    _cs,
} from '@togglecorp/fujs';
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
    Border,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
} from '@apollo/client';

import { explore } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import useDidUpdateEffect from '#base/hooks/useDidUpdateEffect';
import { UserContext } from '#base/context/UserContext';
import { resolveToString, resolveToComponent } from '#base/utils/lang';
import {
    ExploreFilterOptionsQuery,
    ExploreFilterOptionsQueryVariables,
    ExploreBooksQuery,
    ExploreBooksQueryVariables,
    BookGradeEnum,
    BookLanguageEnum,
    GradeFilterOptionsQuery,
    GradeFilterOptionsQueryVariables,
} from '#generated/types';
import BookDetailModal from '#components/BookDetailModal';
// import UploadBookModal from '#components/UploadBookModal';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import NumberOutput from '#components/NumberOutput';

import styles from './styles.css';

const enumKeySelector = (d: { name: string}) => d.name;
const enumLabelSelector = (d: { description?: string | null }) => d.description ?? '???';

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

const GRADE_FILTER_OPTIONS = gql`
query GradeFilterOptions {
    gradeList: __type(name: "BookGradeEnum") {
        enumValues {
            name
            description
        }
    }
    languageList: __type(name: "BookLanguageEnum") {
        enumValues {
            name
            description
        }
    }
}
`;

const EXPLORE_BOOKS = gql`
query ExploreBooks(
    $categories: [ID!],
    $publishers: [ID!],
    $ordering: String,
    $page: Int,
    $pageSize: Int,
    $title: String,
    $grades: [BookGradeEnum!],
    $languages: [BookLanguageEnum!],
    $isAddedInWishlist: Boolean,
) {
    books(
        categories: $categories,
        publishers: $publishers,
        ordering: $ordering,
        page: $page,
        pageSize: $pageSize,
        search: $title,
        isAddedInWishlist: $isAddedInWishlist,
        grade: $grades,
        language: $languages,
    ) {
        page
        pageSize
        totalCount
        results {
            id
            title
            grade
            price
            language
            languageDisplay
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

const bookSourceKeySelector = (item: BookSourceOption) => item.id;
const bookSourceLabelSelector = (item: BookSourceOption) => item.name;

interface Props {
    className?: string;
    wishList?: boolean;
}

function Explore(props: Props) {
    const {
        className,
        wishList: wishListFromProps,
    } = props;

    const { user } = useContext(UserContext);
    const strings = useTranslation(explore);
    const location = useLocation();
    const locationState = location.state as {
        grade?: string;
        category?: string;
        publisher?: string;
        language?: string;
    } | undefined;

    // const canAddBook = user?.permissions.includes('CAN_CREATE_BOOK');

    // NOTE: A different UI depending on if user is publisher or not
    const publisherId = user?.publisherId;

    const [selectedBookId, setSelectedBookId] = React.useState<string | undefined>();
    const [selectedSortKey, setSelectedSortKey] = useInputState<SortKeyType>('id');
    const [page, setPage] = useState<number>(1);

    // Filters

    // NOTE: only used when in publisher mode
    const [bookSource, setBookSource] = useInputState<BookSource | undefined>('own');

    const [grades, setGrades] = useInputState<string[] | undefined>(
        locationState?.grade ? [locationState.grade] : undefined,
    );
    const [languages, setLanguages] = useInputState<string[] | undefined>(
        locationState?.language ? [locationState.language] : undefined,
    );
    const [categories, setCategories] = useInputState<string[] | undefined>(
        locationState?.category ? [locationState?.category] : undefined,
    );
    const [search, setSearch] = useInputState<string | undefined>(undefined);
    const [publishers, setPublishers] = useInputState<string[] | undefined>(
        locationState?.publisher ? [locationState.publisher] : undefined,
    );

    useDidUpdateEffect(() => {
        if (locationState) {
            setCategories(locationState.category ? [locationState.category] : []);
            setGrades(locationState.grade ? [locationState.grade] : []);
            setLanguages(locationState.language ? [locationState.language] : []);
            setPublishers(locationState.publisher ? [locationState.publisher] : []);
            setSearch(undefined);
        }
    }, [locationState, setCategories, setGrades, setPublishers, setSearch, setLanguages]);

    const filtered = (categories && categories.length > 0)
        || !!publishers
        || !!grades
        || !!languages;

    // eslint-disable-next-line no-nested-ternary
    const effectivePublisher = publisherId
        ? (bookSource === 'own' ? [publisherId] : undefined)
        : publishers;

    const pageTitle = React.useMemo(() => {
        if (publisherId) {
            return strings.pageTitlePublisher;
        }

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

    const bookSources: BookSourceOption[] = React.useMemo(() => ([
        { id: 'own', name: strings.publisherOwnBooksLabel },
        { id: 'all', name: strings.publisherAllBooksLabel },
    ]), [strings]);

    const {
        data: optionsQueryResponse,
        loading: filterLoading,
    } = useQuery<ExploreFilterOptionsQuery, ExploreFilterOptionsQueryVariables>(
        EXPLORE_FILTER_OPTIONS,
    );

    const {
        data: gradeOptionsResponse,
        loading: gradeLoading,
    } = useQuery<GradeFilterOptionsQuery, GradeFilterOptionsQueryVariables>(
        GRADE_FILTER_OPTIONS,
    );

    const {
        previousData,
        data: bookResponse = previousData,
        loading: bookLoading,
        error: bookError,
        // refetch: refetchBooks,
    } = useQuery<ExploreBooksQuery, ExploreBooksQueryVariables>(
        EXPLORE_BOOKS,
        {
            variables: {
                ordering: selectedSortKey,
                categories,
                publishers: effectivePublisher,
                grades: grades as BookGradeEnum[] | undefined,
                languages: languages as BookLanguageEnum[] | undefined,
                title: (search && search.length >= 3) ? search : undefined,
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

    /*
    const [
        uploadBookModalShown,
        showUploadBookModal,
        hideUploadBookModal,
    ] = useModalState(false);
    */

    return (
        <div className={_cs(styles.explore, className)}>
            <div className={styles.headerContainer}>
                <Header
                    className={styles.pageHeader}
                    heading={pageTitle}
                    spacing="loose"
                    /*
                    actions={canAddBook && (
                        <Button
                            name={undefined}
                            onClick={showUploadBookModal}
                            icons={<IoAdd />}
                        >
                            {strings.addBookButtonLabel}
                        </Button>
                    )}
                    */
                >
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        icons={<IoSearchSharp />}
                        placeholder={strings.searchInputPlaceholder}
                        name={undefined}
                        value={search}
                        type="search"
                        onChange={setSearch}
                    />
                </Header>
                {/* uploadBookModalShown && effectivePublisher && (
                    <UploadBookModal
                        publisher={effectivePublisher}
                        onModalClose={hideUploadBookModal}
                        // FIXME: This might not be required
                        onUploadSuccess={refetchBooks}
                    />
                ) */}
            </div>
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    <Header
                        headingSize="extraSmall"
                        heading={strings.filterBooksHeading}
                        spacing="loose"
                    />
                    {publisherId && (
                        <>
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
                            <Border
                                inline
                                width="thin"
                            />
                        </>
                    )}
                    <CheckListInput
                        className={styles.gradeInput}
                        listContainerClassName={styles.gradeList}
                        label={strings.gradeFilterLabel}
                        name={undefined}
                        options={gradeOptionsResponse?.gradeList?.enumValues ?? undefined}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        value={grades}
                        onChange={setGrades}
                    />
                    {grades && grades.length > 0 && (
                        <>
                            <Button
                                name={undefined}
                                onClick={setGrades}
                                variant="transparent"
                                spacing="none"
                                disabled={gradeLoading}
                            >
                                {strings.clearGradeFilterButtonLabel}
                            </Button>
                        </>
                    )}
                    <Border
                        inline
                        width="thin"
                    />
                    <CheckListInput
                        className={styles.languageInput}
                        listContainerClassName={styles.languageList}
                        label={strings.languageFilterLabel}
                        name={undefined}
                        options={gradeOptionsResponse?.languageList?.enumValues ?? undefined}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        value={languages}
                        onChange={setLanguages}
                    />
                    {languages && languages.length > 0 && (
                        <Button
                            name={undefined}
                            onClick={setLanguages}
                            variant="transparent"
                            spacing="none"
                            disabled={gradeLoading}
                        >
                            {strings.clearLanguageFilterButtonLabel}
                        </Button>
                    )}
                    <Border
                        inline
                        width="thin"
                    />
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
                    <Border
                        inline
                        width="thin"
                    />
                    {!publisherId && (
                        <>
                            <CheckListInput
                                label={strings.publisherFilterLabel}
                                className={styles.publisherInput}
                                listContainerClassName={styles.publisherList}
                                name={undefined}
                                options={optionsQueryResponse?.publishers?.results ?? undefined}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                value={publishers}
                                onChange={setPublishers}
                                disabled={filterLoading}
                            />
                            {publishers && (
                                <Button
                                    name={undefined}
                                    onClick={setPublishers}
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
                        <Header
                            headingClassName={styles.heading}
                            headingSize="extraSmall"
                            heading={(
                                resolveToComponent(
                                    strings.booksFoundLabel,
                                    {
                                        count: (
                                            <NumberOutput
                                                value={bookResponse?.books?.totalCount}
                                            />
                                        ),
                                    },
                                )
                            )}
                            spacing="loose"
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
                        pendingMessage={strings.pendingBookListMessage}
                        emptyMessage={strings.bookListEmptyMessage}
                        filteredEmptyMessage={strings.filteredBookListEmptyMessage}
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
