import React, { useCallback } from 'react';
import {
    Modal,
    ListView,
} from '@the-deep/deep-ui';

import OrderItem, { Order } from '#components/OrderItem';
import styles from './styles.css';

function orderListKeySelector(d: Order) {
    return d.id;
}

interface PackageType {
    id: string;
    packageId: string;
    relatedOrders?: Order[] | undefined | null;
}

interface Props {
    packageItem: PackageType;
    onModalClose: () => void;
}

function RelatedOrders(props: Props) {
    const {
        packageItem,
        onModalClose,
    } = props;

    const orderListRendererParams = useCallback((_, data: Order) => ({
        order: data,
    }), []);

    return (
        <Modal
            className={styles.relatedOrdersModal}
            backdropClassName={styles.modalBackdrop}
            onCloseButtonClick={onModalClose}
            heading={packageItem.packageId}
        >
            <ListView
                className={styles.orderItemList}
                data={packageItem.relatedOrders}
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
