import React from 'react';
import {
    Modal,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import { bookDetailModal } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import {
    BookQuery,
    BookQueryVariables,
} from '#generated/types';

import BookItem from '#components/BookItem';

import styles from './styles.css';

const BOOK = gql`
query Book($id: ID!) {
    book(id: $id) {
        id
        description
        image {
            name
            url
        }
        isbn
        edition
        language
        price
        title
        numberOfPages
        authors {
            id
            name
            aboutAuthor
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
`;

interface Props {
    bookId: string;
    onCloseButtonClick: (v: undefined) => void;
}

function BookDetailModal(props: Props) {
    const {
        bookId,
        onCloseButtonClick,
    } = props;

    const strings = useTranslation(bookDetailModal);

    const {
        data,
        error,
        loading,
    } = useQuery<BookQuery, BookQueryVariables>(
        BOOK,
        { variables: { id: bookId } },
    );

    const errored = !!error;

    return (
        <Modal
            hideCloseButton
            className={styles.queryResponseModal}
            bodyClassName={styles.container}
            size="large"
        >
            {errored && (
                // FIXME: style this
                <div>
                    {strings.bookDetailFetchErrorMessage}
                </div>
            )}
            {!errored && loading && (
                // FIXME: style this
                <div>
                    {strings.loadingMessage}
                </div>
            )}
            {!errored && !loading && data?.book && (
                <BookItem
                    className={styles.detail}
                    onCloseButtonClick={onCloseButtonClick}
                    variant="detail"
                    book={data.book}
                />
            )}
        </Modal>
    );
}

export default BookDetailModal;
