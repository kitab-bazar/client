import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    CheckListInput,
    RadioInput,
    useInputState,
    ListView,
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
query ExploreBooks($categories: [ID!], $publisher: ID, $ordering: String, $page: Int, $pageSize: Int) {
    books(categories: $categories, publisher: $publisher, ordering: $ordering, page: $page, pageSize: $pageSize) {
        page
        pageSize
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
        }
    }
}
`;

const keySelector = (d: { id: string }) => d.id;
const labelSelector = (d: { name: string }) => d.name;

interface Props {
    className?: string;
}

function Explore(props: Props) {
    const { className } = props;

    const [categories, setCategories] = useInputState<string[]>([]);
    const [publisher, setPublisher] = useInputState<string | undefined>(undefined);

    const {
        data: optionsQueryResponse,
        loading: filterLoading,
    } = useQuery<ExploreFilterOptionsQuery, ExploreFilterOptionsQueryVariables>(
        EXPLORE_FILTER_OPTIONS,
    );

    const {
        data: bookResponse,
        loading: bookLoading,
    } = useQuery<ExploreBooksQuery, ExploreBooksQueryVariables>(
        EXPLORE_BOOKS,
        {
            variables: {
                categories,
                publisher,
            },
        },
    );

    const bookList = bookResponse?.books?.results ?? undefined;

    const bookItemRendererParams = (
        _: string,
        book: NonNullable<(typeof bookList)>[number],
    ): BookItemProps => ({
        book,
    });

    return (
        <div className={_cs(styles.explore, className)}>
            {filterLoading && bookLoading && (
                <div className={styles.loading}>
                    loading...
                </div>
            )}
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    <CheckListInput
                        label="Categories"
                        className={styles.categoriesInput}
                        listContainerClassName={styles.categoryList}
                        name={undefined}
                        options={optionsQueryResponse?.categories?.results ?? []}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        value={categories}
                        onChange={setCategories}
                    />
                    <RadioInput
                        label="Publisher"
                        className={styles.publisherInput}
                        listContainerClassName={styles.publisherList}
                        name={undefined}
                        options={optionsQueryResponse?.publishers?.results ?? []}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        value={publisher}
                        onChange={setPublisher}
                    />
                </div>
                <ListView
                    className={styles.bookList}
                    data={bookList}
                    rendererParams={bookItemRendererParams}
                    renderer={BookItem}
                    keySelector={keySelector}
                    errored={false}
                    filtered={false}
                    pending={bookLoading}
                />
            </div>
        </div>
    );
}

export default Explore;
