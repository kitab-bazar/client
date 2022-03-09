import React, { useCallback } from 'react';
import {
    Modal,
    ListView,
} from '@the-deep/deep-ui';

import { SchoolPackage } from '../../index';
import OrderItem, { Order } from '#components/OrderItem';
import styles from './styles.css';

function orderListKeySelector(d: Order) {
    return d.id;
}

interface Props {
    schoolPackage: SchoolPackage;
    onModalClose: () => void;
}

function RelatedOrders(props: Props) {
    const {
        schoolPackage,
        onModalClose,
    } = props;

    const orderListRendererParams = useCallback((_, data: Order) => ({
        className: styles.orderItem,
        order: data,
    }), []);

    return (
        <Modal
            className={styles.relatedOrdersModal}
            backdropClassName={styles.modalBackdrop}
            onCloseButtonClick={onModalClose}
        >
            <ListView
                className={styles.orderItemList}
                data={schoolPackage.relatedOrders}
                keySelector={orderListKeySelector}
                renderer={OrderItem}
                rendererParams={orderListRendererParams}
                filtered={false}
                errored={false}
                pending={false}
            />
        </Modal>
    );
}
export default RelatedOrders;
