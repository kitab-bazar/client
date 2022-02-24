import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Pager,
    ListView,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import {
    OrderDetailsQuery,
    OrderDetailsQueryVariables,
} from '#generated/types';

import BookItem, { Props as BookItemProps } from '#components/BookItem';
import OrderItem from '#components/OrderItem';
import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import styles from './styles.css';

const keySelector = (d: { id: string }) => d.id;

const ORDER_DETAIL = gql`
query OrderDetails($id: ID!, $bookPage: Int, $bookPageSize: Int) {
    order(id: $id) {
        id
        orderCode
        status
        statusDisplay
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

type Book = NonNullable<NonNullable<NonNullable<OrderDetailsQuery['order']>['bookOrders']>['results']>[number];

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
    orderId: string;
    className?: string;
}

function OrderDetail(props: Props) {
    const {
        className,
        orderId,
    } = props;

    const strings = useTranslation(profile);

    const [page, setPage] = React.useState<number>(1);

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

    const bookItemRendererParams = React.useCallback((
        _: string,
        book: Book,
    ): BookItemProps => ({
        book,
        variant: 'order',
    }), []);

    const order = orderResponse?.order;

    return (
        <div className={_cs(styles.orderDetail, className)}>
            {order && (
                <OrderItem
                    order={order}
                />
            )}
            <ListView
                className={styles.bookList}
                data={orderResponse?.order?.bookOrders?.results ?? undefined}
                rendererParams={bookItemRendererParams}
                renderer={BookItem}
                keySelector={keySelector}
                errored={!!error}
                filtered={false}
                pending={orderLoading}
                pendingMessage={strings.pendingBookListMessage}
                emptyMessage={strings.emptyBookListMessage}
                messageShown
            />
            <Pager
                activePage={page}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={orderResponse?.order?.bookOrders?.totalCount ?? 0}
                onActivePageChange={setPage}
                itemsPerPageControlHidden
            />
        </div>
    );
}

export default OrderDetail;
