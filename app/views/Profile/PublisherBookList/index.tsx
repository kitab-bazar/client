import React, { useCallback, useState } from 'react';
import { IoAdd } from 'react-icons/io5';

import { gql, useQuery } from '@apollo/client';
import {
    ListView,
    Button,
    useModalState,
} from '@the-deep/deep-ui';

import useTranslation from '#base/hooks/useTranslation';
import { profile } from '#base/configs/lang';
import BookDetailModal from '#components/BookDetailModal';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import UploadBookModal from '#components/UploadBookModal';
import {
    PublisherBookListQuery,
    PublisherBookListQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const PUBLISHER_BOOK_LIST = gql`
query PublisherBookList($publisherId: ID) {
    books(publisher: $publisherId){
        results {
            id
            title
            price
            gradeDisplay
            languageDisplay
            isbn
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
        }
    }
}
`;

type Book = NonNullable<NonNullable<PublisherBookListQuery['books']>['results']>[number];
const keySelector = (d: Book) => d.id;

interface Props {
    publisherId: string;
}

function PublisherBookList(props: Props) {
    const {
        publisherId,
    } = props;

    const strings = useTranslation(profile);
    const [selectedBookId, setSelectedBookId] = useState<string | undefined>();

    const [
        uploadBookModalShown,
        showUploadBookModal,
        hideUploadBookModal,
    ] = useModalState(false);

    const {
        previousData,
        data: publisherBooksResponse = previousData,
        loading: publisherBooksLoading,
        error: publisherBooksError,
    } = useQuery<PublisherBookListQuery, PublisherBookListQueryVariables>(
        PUBLISHER_BOOK_LIST,
        {
            variables: {
                publisherId,
            },
        },
    );

    const bookItemRendererParams = useCallback((
        _: string,
        book: Book,
    ): BookItemProps => ({
        book,
        onBookTitleClick: setSelectedBookId,
        variant: 'list',
    }), [setSelectedBookId]);

    return (
        <div className={styles.publisherBooks}>
            <Button
                name={undefined}
                className={styles.uploadBookButton}
                icons={<IoAdd />}
                onClick={showUploadBookModal}
            >
                {strings.uploadBookModalButtonLabel}
            </Button>
            <ListView
                className={styles.bookList}
                data={publisherBooksResponse?.books?.results ?? undefined}
                rendererParams={bookItemRendererParams}
                renderer={BookItem}
                keySelector={keySelector}
                errored={!!publisherBooksError}
                filtered={false}
                pending={publisherBooksLoading}
                pendingMessage={strings.publisherBooksPendingMessage}
                emptyMessage={strings.publisherBooksErrorMessage}
                messageShown
            />
            {selectedBookId && (
                <BookDetailModal
                    bookId={selectedBookId}
                    onCloseButtonClick={setSelectedBookId}
                />
            )}
            {uploadBookModalShown && (
                <UploadBookModal
                    publisher={publisherId}
                    onModalClose={hideUploadBookModal}
                    onUploadSuccess={() => { console.warn('Book Upload Success'); }}
                />
            )}
        </div>
    );
}

export default PublisherBookList;
