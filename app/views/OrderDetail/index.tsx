import React from 'react';
import { useParams } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import {
    Pager,
    useInputState,
    TextInput,
    Header,
    ListView,
    // ConfirmButton,
    // useAlert,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
    // useMutation,
} from '@apollo/client';

import {
    OrderDetailsQuery,
    OrderDetailsQueryVariables,
    // UpdateOrderStatusMutation,
    // UpdateOrderStatusMutationVariables,
} from '#generated/types';

import { orderDetail } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import OrderItem from '#components/OrderItem';

import styles from './styles.css';

const keySelector = (d: { id: string }) => d.id;
// const labelSelector = (d: { name: string }) => d.name;

const ORDER_DETAIL = gql`
query OrderDetails($id: ID!, $bookPage: Int, $bookPageSize: Int) {
    order(id: $id) {
        id
        orderCode
        status
        totalPrice
        totalQuantity
        bookOrders(page: $bookPage, pageSize: $bookPageSize) {
            page
            pageSize
            totalCount
            results {
                id
                edition
                image {
                    url
                    name
                }
                isbn
                price
                quantity
                title
            }
        }
    }
}
`;

/*
const UPDATE_ORDER_STATUS = gql`
mutation UpdateOrderStatus($id: ID!, $status: status) {
    updateOrder(id: $id, data: {status: $status}) {
        ok
        errors
        result {
            id
            status
        }
    }
}
`;
*/

const MAX_ITEMS_PER_PAGE = 10;
interface Props {
    className?: string;
}
function OrderDetail(props: Props) {
    const { className } = props;

    const [page, setPage] = React.useState<number>(1);
    const [search, setSearch] = useInputState<string | undefined>(undefined);

    const strings = useTranslation(orderDetail);
    // const alert = useAlert();
    const { orderId } = useParams<{
        orderId: string;
    }>() as { orderId: string };

    const {
        data: orderResponse,
        error,
        loading: orderLoading,
    } = useQuery<OrderDetailsQuery, OrderDetailsQueryVariables>(
        ORDER_DETAIL,
        {
            variables: {
                id: orderId,
                bookPage: page,
                bookPageSize: MAX_ITEMS_PER_PAGE,
            },
        },
    );

    /*
    const [
        updateOrder,
        { loading: updateOrderLoading },
    ] = useMutation<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>(
        UPDATE_ORDER_STATUS,
        {
            onCompleted: (response) => {
                if (!response?.updateOrder?.ok) {
                    alert.show(
                        strings.orderStatusUpdateFailedMessage,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleMarkAsPacked = React.useCallback(() => {
        updateOrder({
            variables: {
                id: orderId,
                status: 'PACKED',
            },
        });
    }, [orderId, updateOrder]);

    const handleMarkAsCompleted = React.useCallback(() => {
        updateOrder({
            variables: {
                id: orderId,
                status: 'COMPLETED',
            },
        });
    }, [orderId, updateOrder]);
    */

    const bookItemRendererParams = React.useCallback((
        _: string,
        book: NonNullable<NonNullable<NonNullable<OrderDetailsQuery['order']>['bookOrders']>['results']>[number],
    ): BookItemProps => ({
        book,
        variant: 'order',
    }), []);

    const order = orderResponse?.order;

    return (
        <div className={_cs(styles.orderDetail, className)}>
            <div className={styles.headerContainer}>
                <Header
                    className={styles.pageHeader}
                    heading={order?.orderCode}
                    spacing="loose"
                    /*
                    actions={(
                        <>
                            {order?.status === 'RECEIVED' && (
                                <ConfirmButton
                                    name={undefined}
                                    onConfirm={handleMarkAsPacked}
                                    disabled={updateOrderLoading}
                                    message={(
                                        <>
                                            <strong>
                                                {strings.markAsPackedConfirmationMessage}
                                            </strong>
                                            <p>
                                                {strings.noGoingBackWarningMessage}
                                            </p>
                                        </>
                                    )}
                                >
                                    {strings.markAsPackedButtonLabel}
                                </ConfirmButton>
                            )}
                            {order?.status === 'PACKED' && (
                                <ConfirmButton
                                    name={undefined}
                                    onConfirm={handleMarkAsCompleted}
                                    disabled={updateOrderLoading}
                                    message={(
                                        <>
                                            <strong>
                                                {strings.markAsCompletedConfirmationMessage}
                                            </strong>
                                            <p>
                                                {strings.noGoingBackWarningMessage}
                                            </p>
                                        </>
                                    )}
                                >
                                    {strings.markAsCompletedButtonLabel}
                                </ConfirmButton>
                            )}
                        </>
                    )}
                    */
                >
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        icons={<IoSearchSharp />}
                        placeholder={strings.searchInputPlaceholder}
                        name={undefined}
                        value={search}
                        type="search"
                        onChange={setSearch}
                        disabled
                    />
                </Header>
            </div>
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    {order && (
                        <OrderItem
                            className={styles.pageHeader}
                            order={order}
                            detailsLinkHidden
                        />
                    )}
                </div>
                <div className={styles.bookListSection}>
                    <ListView
                        className={styles.bookList}
                        data={orderResponse?.order?.bookOrders?.results ?? undefined}
                        rendererParams={bookItemRendererParams}
                        renderer={BookItem}
                        keySelector={keySelector}
                        messageShown
                        errored={!!error}
                        filtered={false}
                        pending={orderLoading}
                    />
                    <Pager
                        activePage={page}
                        maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                        itemsCount={orderResponse?.order?.bookOrders?.totalCount ?? 0}
                        onActivePageChange={setPage}
                        itemsPerPageControlHidden
                    />
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
