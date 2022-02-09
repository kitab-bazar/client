import React, { useCallback, useState } from 'react';
import { isNotDefined, isDefined } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import { IoAdd } from 'react-icons/io5';

import {
    Pager,
    Button,
    ListView,
    Container,
    useModalState,
} from '@the-deep/deep-ui';

import BookDetailsModal from '#components/BookDetailModal';
import BookItem, { Props as BookItemsProps } from '#components/BookItem';
import {
    PublisherBooksQuery,
    PublisherBooksQueryVariables,
} from '#generated/types';

import UploadBookModal from './UploadBookModal';
import styles from './styles.css';

type Book = NonNullable<NonNullable<PublisherBooksQuery['books']>['results']>[number];
const bookKeySelector = (b: Book) => b.id;

const PUBLISHER_BOOKS = gql`
    query PublisherBooks($page: Int!, $pageSize: Int!, $publisher: ID ) {
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

const MAX_ITEMS_PER_PAGE = 20;

interface Props {
    publisherId?: string;
}

function Books(props: Props) {
    const {
        publisherId,
    } = props;

    const [page, setPage] = useState<number>(1);
    const [selectedBook, setSelectedBook] = React.useState<string | undefined>();

    const {
        data: publisherBooksResult,
        loading,
        refetch: refetchPublisherBooks,
        error,
    } = useQuery<PublisherBooksQuery, PublisherBooksQueryVariables>(
        PUBLISHER_BOOKS,
        {
            skip: isNotDefined(publisherId),
            variables: {
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
                publisher: publisherId,
            },
        },
    );

    const books = publisherBooksResult?.books?.results ?? undefined;

    const bookItemRendererParams = useCallback((_, data: Book): BookItemsProps => ({
        onClick: setSelectedBook,
        variant: 'compact',
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
                    maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                    itemsCount={publisherBooksResult?.books?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                />
            )}
        >
            <ListView
                className={styles.bookList}
                data={books}
                keySelector={bookKeySelector}
                rendererParams={bookItemRendererParams}
                renderer={BookItem}
                errored={!!error}
                pending={loading}
                filtered={false}
            />
            {uploadBookModalShown && publisherId && (
                <UploadBookModal
                    publisher={publisherId}
                    onModalClose={hideUploadBookModal}
                    onUploadSuccess={refetchPublisherBooks}
                />
            )}
            {isDefined(selectedBook) && (
                <BookDetailsModal
                    bookId={selectedBook}
                    onCloseButtonClick={setSelectedBook}
                />
            )}
        </Container>
    );
}

export default Books;
