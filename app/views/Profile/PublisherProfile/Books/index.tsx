import React, { useContext, useCallback, useState } from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import { IoAdd } from 'react-icons/io5';

import {
    Pager,
    Button,
    ListView,
    Container,
    useModalState,
} from '@the-deep/deep-ui';

import BookItem, { Props as BookItemsProps } from '#components/BookItem';
import { UserContext } from '#base/context/UserContext';
import {
    PublisherBooksQuery,
    PublisherBooksQueryVariables,
} from '#generated/types';

import UploadBookModal from './UploadBookModal';
import styles from './styles.css';

type Book = NonNullable<NonNullable<PublisherBooksQuery['books']>['results']>[number];
const bookKeySelector = (b: Book) => b.id;

const PUBLISHER_BOOKS = gql`
    query PublisherBooks( $page: Int!, $pageSize: Int!, $publisher: ID ) {
        books (page: $page, pageSize: $pageSize, publisher: $publisher) {
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
            totalCount
        }
    }
`;

function Books() {
    const [pageSize, setPageSize] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const {
        user,
    } = useContext(UserContext);

    const {
        data: publisherBooksResult,
        loading,
        refetch: refetchPublisherBooks,
    } = useQuery<PublisherBooksQuery, PublisherBooksQueryVariables>(
        PUBLISHER_BOOKS,
        {
            skip: isNotDefined(user?.id),
            variables: {
                page,
                pageSize,
                publisher: user?.id,
            },
        },
    );

    const books = publisherBooksResult?.books?.results ?? undefined;

    const bookItemRendererParams = useCallback((_, data: Book): BookItemsProps => ({
        book: data,
    }), []);

    const [
        uploadBookModalShown,
        showUploadBookModal,
        hideUploadBookModal,
    ] = useModalState(false);

    return (
        <Container
            className={styles.publisherBooks}
            heading="Books"
            contentClassName={styles.content}
            headerActions={(
                <Button
                    name={undefined}
                    variant="general"
                    onClick={showUploadBookModal}
                    icons={<IoAdd />}
                >
                    Upload Book
                </Button>
            )}
            footerActions={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={pageSize}
                    itemsCount={publisherBooksResult?.books?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    onItemsPerPageChange={setPageSize}
                />
            )}
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
            {uploadBookModalShown && user?.id && (
                <UploadBookModal
                    publisher={user.id}
                    onModalClose={hideUploadBookModal}
                    onUploadSuccess={refetchPublisherBooks}
                />
            )}
        </Container>
    );
}

export default Books;
