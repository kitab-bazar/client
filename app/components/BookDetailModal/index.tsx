import React from 'react';
import { isDefined } from '@togglecorp/fujs';
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

    const authorsDisplay = React.useMemo(() => (
        queryResponse?.book?.authors?.map((d) => d.name).join(', ')
    ), [queryResponse?.book?.authors]);

    const categoriesDisplay = React.useMemo(() => (
        queryResponse?.book?.categories?.map((d) => d.name).join(', ')
    ), [queryResponse?.book?.categories]);

    const alreadyInOrder = (queryResponse?.book?.cartDetails?.quantity ?? 0) > 0;

    return (
        <Modal
            hideCloseButton
            className={styles.queryResponseModal}
            bodyClassName={styles.container}
            size="large"
        >
            {queryResponse?.book && (
                <>
                    <div className={styles.preview}>
                        {queryResponse?.book?.image?.url ? (
                            <img
                                className={styles.image}
                                src={queryResponse.book.image.url}
                                alt={queryResponse.book.title}
                            />
                        ) : (
                            <Message
                                // FIXME: translate
                                message="Preview not available"
                            />
                        )}
                    </div>
                    <Container
                        className={styles.details}
                        heading={queryResponse.book.title}
                        headerActions={(
                            <Button
                                name={undefined}
                                variant="action"
                                onClick={onCloseButtonClick}
                            >
                                <IoClose />
                            </Button>
                        )}
                        headingSize="small"
                        headingDescription={authorsDisplay}
                        borderBelowHeader
                        headerDescription={(
                            <TextOutput
                                // FIXME: translate
                                label="Price (NPR)"
                                value={queryResponse.book.price}
                                valueType="number"
                            />
                        )}
                        contentClassName={styles.content}
                    >
                        <div className={styles.bookMeta}>
                            <TextOutput
                                // FIXME: translate
                                label="Language"
                                value={queryResponse.book.language}
                            />
                            <TextOutput
                                // FIXME: translate
                                label="Number of pages"
                                value={queryResponse.book.numberOfPages}
                                valueType="number"
                            />
                            <TextOutput
                                // FIXME: translate
                                label="ISBN"
                                value={queryResponse.book.isbn}
                            />
                            <TextOutput
                                // FIXME: translate
                                label="Publisher"
                                value={queryResponse.book.publisher.name}
                            />
                            <div className={styles.categories}>
                                {categoriesDisplay}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            {alreadyInOrder ? (
                                <Button
                                    variant="secondary"
                                    name={undefined}
                                    icons={<IoCheckmark />}
                                    readOnly
                                >
                                    Added to Order
                                </Button>
                            ) : (
                                <Button
                                    name={undefined}
                                    variant="primary"
                                >
                                    Add to Order
                                </Button>
                            )}
                        </div>
                        <div
                            // TODO: sanitize description
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={
                                { __html: queryResponse.book.description ?? '' }
                            }
                        />
                    </Container>
                </>
            )}
        </Modal>
    );
}

export default BookDetailModal;
