import React, {
    useCallback,
    useState,
} from 'react';
import {
    Modal,
    useAlert,
    Button,
    Message,
    NumberInput,
    TextOutput,
} from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { isDefined } from '@togglecorp/fujs';
import {
    SingleOrderMutation,
    SingleOrderMutationVariables,
    BookDetailQuery,
} from '#generated/types';

import styles from './styles.css';

const ORDER = gql`
mutation SingleOrder($bookId: ID!, $qty: Int!) {
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

interface Props {
    bookId: string;
    onClose: () => void;
    book: NonNullable<BookDetailQuery['book']>;
    initialQuantity: number | undefined,
}

function OrderPage(props: Props) {
    const {
        bookId,
        book,
        onClose,
        initialQuantity,
    } = props;

    const [quantity, setQuantity] = useState<number>(initialQuantity || 1);

    const alert = useAlert();

    const [
        placeSingleOrder,
        { loading },
    ] = useMutation<
            SingleOrderMutation,
            SingleOrderMutationVariables
    >(
        ORDER,
        {
            onCompleted: (response) => {
                if (response?.placeSingleOrder?.ok) {
                    alert.show(`
                        Order # ${response?.placeSingleOrder?.result?.orderCode}
                        For Total Price: NPR ${response?.placeSingleOrder?.result?.totalPrice}
                        Order Status: ${response?.placeSingleOrder?.result?.status}
                    `, { variant: 'success' });
                    onClose();
                } else {
                    alert.show(
                        'Failed to place order',
                        { variant: 'error' },
                    );
                }
            },
        },
    );

    const submit = useCallback(() => {
        if (!bookId) {
            return;
        }

        placeSingleOrder({
            variables: {
                // FIXME: bookId should always be string, fix on backend
                bookId: Number(bookId),
                qty: quantity,
            },
        });
    }, [bookId, quantity, placeSingleOrder]);

    const handleQuantityChange = useCallback((value: number | undefined) => {
        const qty = isDefined(value) ? value : 1;
        setQuantity(qty);
    }, []);

    return (
        <Modal
            size="small"
            onCloseButtonClick={onClose}
            className={styles.orderConfirmModal}
            bodyClassName={styles.content}
            heading={book.title}
            headingSize="small"
            footerActions={(
                <Button
                    name="submit"
                    variant="primary"
                    onClick={submit}
                    disabled={loading || !quantity || quantity < 1}
                >
                    Confirm Order
                </Button>
            )}
        >
            <div className={styles.preview}>
                {book?.image?.url ? (
                    <img
                        className={styles.image}
                        src={book.image.url}
                        alt={book.title}
                    />
                ) : (
                    <Message
                        message="Preview not available"
                    />
                )}
            </div>
            <div className={styles.details}>
                <TextOutput
                    label="Quantity"
                    value={(
                        <NumberInput
                            className={styles.quantityInput}
                            name="quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            type="number"
                        />
                    )}
                />
                <TextOutput
                    label="Price (NPR)"
                    valueType="number"
                    value={book.price}
                />
                <TextOutput
                    label="Amount (NPR)"
                    valueType="number"
                    value={isDefined(quantity) ? book.price * quantity : 0}
                />
            </div>
        </Modal>
    );
}

export default OrderPage;
