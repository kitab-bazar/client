import React, {
    useCallback,
    useState,
} from 'react';
import {
    Alert,
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
    const { book, quantity, changeQuantity } = props;
    const { id, title, price } = book;
    const handleQuantityChange = useCallback((value: number | undefined) => {
        const qty = (isDefined(value)) ? value : 1;
        changeQuantity(qty);
    }, [quantity]);

    return (
        <div className={styles.container} key={id}>
            <div className={styles.metaData}>
                <Container
                    className={styles.details}
                    heading="Confirm Order"
                >
                    <div className={styles.headerDescription}>
                        <div className={styles.quantity}>
                            <TextOutput
                                label="Book Name"
                                value={title}
                            />
                        </div>
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
                    </div>
                </Container>
                <div className={styles.orderButton}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                        icons={<IoCashOutline />}
                    >
                        Cash On Delivery
                    </Button>
                </div>
            </div>
        </div>
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

    const [placeSingleOrder,
        { data: resp, loading: submitting }] = useMutation<
            SingleOrderMutation,
            SingleOrderMutationVariables
        >(ORDER);
    const submit = useCallback(() => {
        const bookId = id ? parseInt(id, 10) : 0;
        placeSingleOrder({ variables: { bookId, qty: quantity } });
    }, [id, quantity]);

    const pending = loading || submitting;

    return (
        <div className={styles.orderList}>
            {resp && resp.placeSingleOrder && resp.placeSingleOrder.ok && !submitting
                && (
                    <>
                        <Alert
                            onCloseButtonClick={undefined}
                            onTimeout={undefined}
                            name="Alert"
                            variant="success"
                        >
                            Order #
                            {resp.placeSingleOrder.result?.orderCode}
                            For Total Price: NPR
                            {resp.placeSingleOrder.result?.totalPrice}
                            Order Status:
                            {resp.placeSingleOrder.result?.status}
                        </Alert>
                    </>

                )}
            {
                result?.book && !loading
                && (
                    <OrderItem
                        book={result.book}
                        quantity={quantity}
                        changeQuantity={setQuantity}
                    />
                )
            }
            <div className={styles.confirmButton}>
                <Button
                    name="submit"
                    variant="secondary"
                    onClick={submit}
                    disabled={pending}
                >
                    Confirm Order
                </Button>
            </div>
        </div>
    );
}

export default OrderPage;
