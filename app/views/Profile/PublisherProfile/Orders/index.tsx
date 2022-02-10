import React, { useCallback, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
    Pager,
    Container,
    ListView,
} from '@the-deep/deep-ui';

import {
    PublisherBookOrdersQuery,
    PublisherBookOrdersQueryVariables,
} from '#generated/types';

import OrderItem from '#components/OrderItem';
import styles from './styles.css';

const PUBLISHER_BOOK_ORDERS = gql`
    query PublisherBookOrders(
        $pageSize: Int,
        $page: Int,
    ) {
        orders(pageSize: $pageSize, page: $page) {
            page
            pageSize
            totalCount
            results {
                id
                orderCode
                status
                totalQuantity
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

type PublisherOrder = NonNullable<NonNullable<PublisherBookOrdersQuery['orders']>['results']>[number];
const orderKeySelector = (d: PublisherOrder) => d.id;

const MAX_ITEMS_PER_PAGE = 20;

function Orders() {
    const [page, setPage] = useState<number>(1);

    const {
        previousData,
        data: publisherBookOrdersResult = previousData,
        loading,
        error,
    } = useQuery<PublisherBookOrdersQuery, PublisherBookOrdersQueryVariables>(
        PUBLISHER_BOOK_ORDERS,
        {
            variables: {
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
            },
        },
    );

    const orders = publisherBookOrdersResult?.orders?.results ?? undefined;
    const orderItemRendererParams = useCallback((_: string, data: PublisherOrder) => ({
        className: styles.order,
        order: data,
    }), []);

    return (
        <Container
            className={styles.publisherOrders}
            contentClassName={styles.content}
            heading="Orders"
            footerContent={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                    itemsCount={publisherBookOrdersResult?.orders?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                />
            )}
        >
            <ListView
                className={styles.orders}
                data={orders}
                keySelector={orderKeySelector}
                renderer={OrderItem}
                rendererParams={orderItemRendererParams}
                errored={!!error}
                filtered={false}
                pending={loading}
            />
        </Container>
    );
}

export default Orders;
