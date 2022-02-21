import React, { useCallback, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    ListView,
    Pager,
    Modal,
} from '@the-deep/deep-ui';
import {
    OrderListWithBooksQuery,
    OrderListWithBooksQueryVariables,
} from '#generated/types';
import OrderItem, {
    Props as OrderItemProps,
    Order,
} from '#components/OrderItem';

import OrderDetail from './OrderDetail';
import styles from './styles.css';

const ORDER_LIST_WITH_BOOKS = gql`
query OrderListWithBooks(
    $pageSize: Int,
    $page: Int,
    $status: [String!],
) {
    orders(pageSize: $pageSize, page: $page, status: $status) {
        page
        pageSize
        totalCount
        results {
            id
            orderCode
            status
            totalPrice
            bookOrders {
                totalCount
                results {
                    id
                    isbn
                    title
                    edition
                    price
                    quantity
                    image {
                        name
                        url
                    }
                }
            }
        }
    }
}
`;

const orderListKeySelector = (o: Order) => o.id;

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
    className?: string;
}

function OrderList(props: Props) {
    const {
        className,
    } = props;

    const [page, setPage] = useState<number>(1);
    const [clickedOrderId, setClickedOrderId] = useState<Order['id']>();

    const {
        previousData,
        data: orderList = previousData,
        loading,
        error,
    } = useQuery<OrderListWithBooksQuery, OrderListWithBooksQueryVariables>(
        ORDER_LIST_WITH_BOOKS,
    );

    const orderListRendererParams = useCallback((_, data: Order): OrderItemProps => ({
        className: styles.orderItem,
        order: data,
        onClick: setClickedOrderId,
    }), []);

    const handleOrderDetailModalCloseClick = useCallback(() => {
        setClickedOrderId(undefined);
    }, []);

    return (
        <div className={_cs(styles.orderList, className)}>
            <ListView
                className={styles.orderList}
                data={orderList?.orders?.results ?? undefined}
                keySelector={orderListKeySelector}
                renderer={OrderItem}
                rendererParams={orderListRendererParams}
                errored={!!error}
                filtered={false}
                pending={loading}
                messageShown
            />
            <Pager
                activePage={page}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={orderList?.orders?.totalCount ?? 0}
                onActivePageChange={setPage}
                itemsPerPageControlHidden
            />
            {clickedOrderId && (
                <Modal
                    className={styles.orderDetailModal}
                    backdropClassName={styles.modalBackdrop}
                    onCloseButtonClick={handleOrderDetailModalCloseClick}
                >
                    <OrderDetail
                        orderId={clickedOrderId}
                    />
                </Modal>
            )}
        </div>
    );
}

export default OrderList;