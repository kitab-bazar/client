import React, {
    useCallback,
    useState,
} from 'react';
import {
    Modal,
    useAlert,
    Button,
    Container,
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

interface Props {
    bookId: string;
    onClose: () => void;
    book: {
        title: string;
        price: number;
    };
}

function OrderPage(props: Props) {
    const {
        bookId,
        book: {
            title,
            price,
        },
        onClose,
    } = props;

    const [quantity, setQuantity] = useState<number>(1);

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
                    onClose();
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
            onCloseButtonClick={onClose}
            className={styles.orderList}
            heading="Confirm Order"
            footerActions={(
                <Button
                    name="submit"
                    variant="secondary"
                    onClick={submit}
                    disabled={loading}
                >
                    Confirm Order
                </Button>
            )}
        >
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
                /*
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
                */
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
        </Modal>
    );
}

export default OrderPage;
