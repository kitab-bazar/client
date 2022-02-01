import React, {
    useCallback,
    useState,
} from 'react';
import {
    ContainerCard,
    useAlert,
    Button,
    Container,
    NumberInput,
    TextOutput,
} from '@the-deep/deep-ui';
import { IoCashOutline } from 'react-icons/io5';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { isDefined } from '@togglecorp/fujs';
import {
    BookByIdQuery,
    BookByIdQueryVariables,
    SingleOrderMutation,
    SingleOrderMutationVariables,
} from '#generated/types';

import styles from './styles.css';

const ORDER = gql`
mutation SingleOrder($bookId: Int!, $qty: Int!) {
    placeSingleOrder(data: { bookId: $bookId, quantity: $qty }) {
        errors
        ok
        result {
            orderCode
            id
            status
            totalPrice
        }
    }
}
`;

const BOOK_DETAIL = gql`
query BookById($id: ID!) {
    book(id: $id) {
        id
        title
        price
    }
}
`;

type Book = NonNullable<BookByIdQuery['book']>

interface ItemProps {
    book: Book;
    quantity: number;
    changeQuantity: (qty: number) => void;
}

function OrderItem(props: ItemProps) {
    const {
        book,
        quantity,
        changeQuantity,
    } = props;

    const {
        title,
        price,
    } = book;

    const handleQuantityChange = useCallback((value: number | undefined) => {
        const qty = isDefined(value) ? value : 1;
        changeQuantity(qty);
    }, [changeQuantity]);

    return (
        <Container
            className={styles.container}
            heading={(
                <TextOutput
                    label="Book Name"
                    value={title}
                />
            )}
            spacing="loose"
            borderBelowHeader
            footerActions={(
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="secondary"
                    icons={<IoCashOutline />}
                >
                    Cash On Delivery
                </Button>
            )}
            contentClassName={styles.content}
        >
            <NumberInput
                name="quantity"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
            />
            <TextOutput
                label="Price (NPR)"
                valueType="number"
                value={price}
            />
            <TextOutput
                label="Amount (NPR)"
                valueType="number"
                value={isDefined(quantity) ? price * quantity : 0}
            />
        </Container>
    );
}

function OrderPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('book');
    const [quantity, setQuantity] = useState<number>(1);
    const { data: result, loading } = useQuery<
        BookByIdQuery,
        BookByIdQueryVariables
    >(BOOK_DETAIL, {
        skip: !id,
        variables: id ? { id } : undefined,
    });

    const alert = useAlert();

    const [
        placeSingleOrder,
        {
            loading: submitting,
        },
    ] = useMutation<
            SingleOrderMutation,
            SingleOrderMutationVariables
    >(
        ORDER,
        {
            onCompleted: (response) => {
                if (response?.placeSingleOrder?.ok) {
                    alert.show(
                        `Order #
                        ${response?.placeSingleOrder?.result?.orderCode}
                        For Total Price: NPR
                        ${response?.placeSingleOrder?.result?.totalPrice}
                        Order Status:
                        ${response?.placeSingleOrder?.result?.status}`,
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    alert.show(
                        'Failed to place order',
                        {
                            variant: 'error',
                        },
                    );
                }
            },
        },
    );

    const submit = useCallback(() => {
        if (!id) {
            return;
        }

        placeSingleOrder({
            variables: {
                // FIXME: bookId should always be string, fix on backend
                bookId: Number(id),
                qty: quantity,
            },
        });
    }, [id, quantity, placeSingleOrder]);

    const pending = loading || submitting;

    return (
        <ContainerCard
            className={styles.orderList}
            heading="Confirm Order"
            footerActions={(
                <Button
                    name="submit"
                    variant="secondary"
                    onClick={submit}
                    disabled={pending}
                >
                    Confirm Order
                </Button>
            )}
        >
            {result?.book && !loading && (
                <OrderItem
                    book={result.book}
                    quantity={quantity}
                    changeQuantity={setQuantity}
                />
            )}
        </ContainerCard>
    );
}

export default OrderPage;
