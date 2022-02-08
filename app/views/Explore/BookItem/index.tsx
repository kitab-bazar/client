import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
    Button,
    Link,
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
import { OrdersBarContext } from '#components/OrdersBar';

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
            }
        }
    }
}
`;

type BookDetails = NonNullable<NonNullable<ExploreBooksQuery['books']>['results']>[number];

export interface Props {
    className?: string;
    book: BookDetails;
}

function BookItem(props: Props) {
    const {
        className,
        book,
    } = props;

    const alert = useAlert();
    const { updateBar } = React.useContext(OrdersBarContext);

    const [addToOrder] = useMutation<AddToOrderMutation, AddToOrderMutationVariables>(
        ADD_TO_ORDER,
        {
            onCompleted: (response) => {
                if (!response?.createCartItem?.ok) {
                    alert.show(
                        'Failed to add book to the order.',
                        { variant: 'error' },
                    );
                } else {
                    updateBar();
                }
            },
            onError: (e) => {
                // eslint-disable-next-line no-console
                console.error(e);
                alert.show(e.message, { variant: 'error' });
            },
        },
    );

    const authorsDisplay = React.useMemo(() => (
        book.authors?.map((d) => d.name).join(', ')
    ), [book.authors]);

    const categoriesDisplay = React.useMemo(() => (
        book.categories?.map((d) => d.name).join(', ')
    ), [book.categories]);

    const alreadyInOrder = (book.cartDetails?.quantity ?? 0) > 0;

    const handleAddToOrderClick = React.useCallback(() => {
        addToOrder({
            variables: {
                id: book.id,
                quantity: 1,
            },
        });
    }, [book.id, addToOrder]);

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
                    <Link to={`/book/${book.id}/`}>
                        {book.title}
                    </Link>
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
                            label="Langauge"
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
                footerActions={
                    alreadyInOrder ? (
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
                            onClick={handleAddToOrderClick}
                        >
                            Add to Order
                        </Button>
                    )
                }
            />
        </div>
    );
}

export default BookItem;
