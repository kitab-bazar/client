import React from 'react';

import {
    Container,
    TextOutput,
    Modal,
    Message,
    Button,
} from '@the-deep/deep-ui';
import {
    IoCheckmark,
    IoClose,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
} from '@apollo/client';

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

    const {
        data: queryResponse,
    } = useQuery<BookQuery, BookQueryVariables>(
        BOOK,
        { variables: { id: bookId } },
    );
    return (
        <Modal
            hideCloseButton
            className={styles.queryResponseModal}
            bodyClassName={styles.container}
            size="large"
        >
            {queryResponse?.book && (
                <BookItem
                    className={styles.detail}
                    onCloseButtonClick={onCloseButtonClick}
                    variant="detail"
                    book={queryResponse.book}
                />
            )}
        </Modal>
    );
}

export default BookDetailModal;
