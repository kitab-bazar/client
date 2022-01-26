import React from 'react';
import { Button, Container, NumberInput, TextOutput } from '@the-deep/deep-ui';
import { BsCashStack } from 'react-icons/bs';

import styles from './styles.css';

function OrderItem() {
    return (
        <div className={styles.container}>
            <div className={styles.metaData}>
                <Container
                    className={styles.details}
                    heading="Confirm Order"
                >
                    <div className={styles.headerDescription}>
                        <TextOutput
                            label="Order Number"
                            value={undefined}
                        />
                        <div className={styles.quantity}>
                            <TextOutput
                                label="Book Name"
                                value={undefined}
                            />
                            <TextOutput
                                label="Quantity"
                                valueType="number"
                            />
                            <NumberInput
                                name="quantity"
                                value={undefined}
                                onChange={undefined}
                            />
                        </div>
                        <TextOutput
                            label="Price (NPR)"
                            valueType="number"
                            value={undefined}
                        />
                    </div>
                </Container>
                <div className={styles.orderButton}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                        icons={<BsCashStack />}
                    >
                        Cash On Delivery
                    </Button>
                </div>
            </div>
        </div>
    );
}

function OrderPage() {
    return (
        <div className={styles.orderList}>
            <OrderItem />
            <div className={styles.confirmButton}>
                <Button
                    name={undefined}
                    variant="secondary"
                    onClick={undefined}
                >
                    Confirm Order
                </Button>
            </div>
        </div>
    );
}

export default OrderPage;
