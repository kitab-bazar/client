import React, { useCallback, useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    ListView,
    Pager,
    Modal,
    TextOutput,
} from '@the-deep/deep-ui';

import OrderItem, {
    Props as OrderItemProps,
    Order,
} from '#components/OrderItem';
import NumberOutput from '#components/NumberOutput';
import useTranslation from '#base/hooks/useTranslation';
import { profile } from '#base/configs/lang';
import {
    OrderListWithBooksQuery,
    OrderListWithBooksQueryVariables,

    OrderStatusEnum,

    OrderSummaryQuery,
} from '#generated/types';

import { ORDER_SUMMARY } from './queries';
import OrderDetail from './OrderDetail';
import styles from './styles.css';

const ORDER_LIST_WITH_BOOKS = gql`
query OrderListWithBooks(
    $pageSize: Int,
    $page: Int,
    $status: [OrderStatusEnum!],
    $users: [ID!],
    $districts: [ID!],
    $municipalities: [ID!],
    $orderWindows: [ID!],
) {
    orders(
        pageSize: $pageSize,
        page: $page,
        status: $status,
        users: $users,
        districts: $districts,
        municipalities: $municipalities
        orderWindows: $orderWindows
    ) {
        page
        pageSize
        totalCount
        results {
            id
            orderCode
            status
            statusDisplay
            totalPrice
            totalQuantity
            createdAt
             createdBy {
                 canonicalName
                 id
             }
        }
    }
}
`;

const orderListKeySelector = (o: Order) => o.id;

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
    className?: string;
    user?: string;
    status?: string;
    municipalities?: string[];
    districts?: string[];
    orderWindows?: string[];
}

function OrderList(props: Props) {
    const {
        className,
        user,
        status,
        municipalities,
        districts,
        orderWindows,
    } = props;

    const [page, setPage] = useState<number>(1);
    useEffect(() => {
        setPage(1);
    }, [user, status, municipalities, districts]);

    const [clickedOrderId, setClickedOrderId] = useState<Order['id']>();

    const {
        previousData,
        data: response = previousData,
        loading,
        error,
    } = useQuery<OrderListWithBooksQuery, OrderListWithBooksQueryVariables>(
        ORDER_LIST_WITH_BOOKS,
        {
            variables: {
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
                users: user ? [user] : undefined,
                status: status ? [status as OrderStatusEnum] : undefined,
                municipalities,
                districts,
                orderWindows,
            },
        },
    );

    const {
        previousData: summaryPreviousData,
        data: summaryResponse = summaryPreviousData,
    } = useQuery<OrderSummaryQuery>(
        ORDER_SUMMARY,
    );

    const strings = useTranslation(profile);

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
            {response && summaryResponse?.orderSummary && (
                <div className={styles.summary}>
                    <TextOutput
                        spacing="compact"
                        block
                        valueContainerClassName={styles.value}
                        label={strings.totalAmountLabel}
                        value={(
                            <NumberOutput
                                value={summaryResponse.orderSummary.totalPrice ?? 0}
                            />
                        )}
                    />
                    <TextOutput
                        spacing="compact"
                        block
                        valueContainerClassName={styles.value}
                        label={strings.totalBooksLabel}
                        value={(
                            <NumberOutput
                                value={summaryResponse.orderSummary.totalBooksQuantity ?? 0}
                            />
                        )}
                    />
                    <TextOutput
                        spacing="compact"
                        block
                        valueContainerClassName={styles.value}
                        label={strings.uniqueBooksLabel}
                        value={(
                            <NumberOutput
                                value={summaryResponse.orderSummary.totalBooks ?? 0}
                            />
                        )}
                    />
                </div>
            )}
            <ListView
                className={styles.orderItemList}
                data={response?.orders?.results ?? undefined}
                keySelector={orderListKeySelector}
                renderer={OrderItem}
                rendererParams={orderListRendererParams}
                errored={!!error}
                filtered={false}
                pending={loading}
                pendingMessage={strings.pendingOrderListMessage}
                emptyMessage={strings.emptyOrderListMessage}
                messageShown
            />
            <Pager
                activePage={page}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={response?.orders?.totalCount ?? 0}
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
