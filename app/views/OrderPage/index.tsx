import React from 'react';
import { Button, Card } from '@the-deep/deep-ui';

import styles from './styles.css';

function OrderPage() {
    return (
        <div className={styles.orderPage}>
            <div className={styles.container}>
                <Card>
                    Order Number: 123
                    Challa Qty: 2
                    Price: 450

                    Order Number: 123
                    Challa Qty: 2
                    Price: 450

                    Payment:
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                    >
                        Cash on Delivery
                    </Button>
                    Total Price:
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                    >
                        Confirm Order
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default OrderPage;
