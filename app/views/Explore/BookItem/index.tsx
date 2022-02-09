import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import {
    IoCheckmark,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import {
    ExploreBooksQuery,
    AddToOrderMutation,
    AddToOrderMutationVariables,
} from '#generated/types';

import styles from './styles.css';

const ADD_TO_ORDER = gql`
mutation AddToOrder($id: String!, $quantity: Int!) {
    createCartItem(data: { book: $id, quantity: $quantity }) {
        errors
        ok
        result {
            id
            book {
                id
                cartDetails {
                    id
                    quantity
                }
                wishlistId
            }
        }
    }
}
`;

type BookDetails = NonNullable<NonNullable<ExploreBooksQuery['books']>['results']>[number];

export interface Props {
    className?: string;
    book: BookDetails;
    onBookTitleClick: (bookId: string) => void;
}

function BookItem(props: Props) {
    const {
        className,
        book,
        onBookTitleClick,
    } = props;

    const alert = useAlert();

    const [
        addToOrder,
        { loading: addToOrderLoading },
    ] = useMutation<AddToOrderMutation, AddToOrderMutationVariables>(
        ADD_TO_ORDER,
        {
            onCompleted: (response) => {
                if (!response?.createCartItem?.ok) {
                    alert.show(
                        'Failed to add book to the order.',
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const authorsDisplay = React.useMemo(() => (
        book.authors?.map((d) => d.name).join(', ')
    ), [book.authors]);

    const categoriesDisplay = React.useMemo(() => (
        book.categories?.map((d) => d.name).join(', ')
    ), [book.categories]);

    const handleAddToOrder = React.useCallback(() => {
        addToOrder({
            variables: {
                id: book.id,
                quantity: 1,
            },
        });
    }, [book.id, addToOrder]);

    const actionsDisabled = addToOrderLoading;

    return (
        <div className={_cs(styles.bookItem, className)}>
            <div className={styles.preview}>
                {book.image?.url && (
                    <img
                        className={styles.image}
                        src={book.image.url}
                        alt={book.image.name ?? undefined}
                    />
                )}
            </div>
            <Container
                className={styles.details}
                heading={(
                    <Button
                        name={book.id}
                        variant="action"
                        onClick={onBookTitleClick}
                    >
                        {book.title}
                    </Button>
                )}
                headingSize="extraSmall"
                headingDescription={authorsDisplay}
                headerActions={(
                    <TextOutput
                        valueType="number"
                        label="NPR."
                        hideLabelColon
                        value={book.price}
                    />
                )}
                footerIconsContainerClassName={styles.meta}
                footerIcons={(
                    <>
                        <TextOutput
                            label="Language"
                            value={book.language}
                        />
                        <TextOutput
                            label="Publisher"
                            value={book.publisher.name}
                        />
                        <div className={styles.categories}>
                            {categoriesDisplay}
                        </div>
                    </>
                )}
                footerActionsContainerClassName={styles.actions}
                footerActions={(
                    <>
                        {book.cartDetails ? (
                            <Button
                                variant="secondary"
                                name={undefined}
                                icons={<IoCheckmark />}
                                readOnly
                            >
                                In order list
                            </Button>
                        ) : (
                            <Button
                                name={undefined}
                                variant="primary"
                                onClick={handleAddToOrder}
                                disabled={actionsDisabled}
                            >
                                Add to Order
                            </Button>
                        )}
                    </>
                )}
            />
        </div>
    );
}

export default BookItem;
