import React, { useCallback, useMemo, useState } from 'react';

import { useQuery, gql } from '@apollo/client';
import {
    ListView,
    TextOutput,
    ControlledExpandableContainer,
    Pager,
    Container,
} from '@the-deep/deep-ui';

import {
    OrderListWithBooksQuery,
    OrderListWithBooksQueryVariables,
    OrderType,
    OrderStatus,
    BookOrderType,
} from '#generated/types';

import styles from './styles.css';

const ORDER_LIST_WITH_BOOKS = gql`
    query OrderListWithBooks(
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

const bookListKeySelector = (b: BookOrderType) => b.id;

interface BookListProps {
    title: string;
    quantity: number;
    isbn: string;
    price: number;
    edition: string;
    image: string;
}

function BookListRenderer(props: BookListProps) {
    const {
        title,
        quantity,
        isbn,
        price,
        edition,
        image,
    } = props;

    return (
        <div className={styles.bookItem}>
            <img
                src={image}
                alt="book cover"
            />
            <div className={styles.description}>
                <TextOutput
                    value={title}
                />
                <TextOutput
                    label="Quantity"
                    value={quantity}
                />
                <TextOutput
                    label="ISBN"
                    value={isbn}
                />
                <TextOutput
                    label="Edition"
                    value={edition}
                />
                <TextOutput
                    label="price"
                    value={price}
                />
            </div>
        </div>
    );
}

interface OrderListProps {
    orderCode: string;
    totalPrice: number;
    status: OrderStatus;
    totalBooks: number;
    expanded: boolean;
    onExpansionChange: (isExpanded: boolean, orderId: string) => void;
    books: unknown[];
}

function OrderListRenderer(props: OrderListProps) {
    const {
        orderCode,
        totalPrice,
        status,
        totalBooks,
        expanded,
        onExpansionChange,
        books,
    } = props;

    const bookListRendererParams: BookListProps = useCallback((_: string, data: BookOrderType) => ({
        title: data.title,
        quantity: data.quantity,
        isbn: data.isbn,
        edition: data.edition,
        price: data.price,
        image: data.image.url,
    }), []);

    return (
        <ControlledExpandableContainer
            className={styles.orderItem}
            name={orderCode}
            heading={(
                <>
                    <TextOutput
                        // label="order number"
                        value={orderCode}
                    />
                    <TextOutput
                        label="Total book types"
                        value={totalBooks}
                    />
                    <TextOutput
                        label="total price"
                        value={totalPrice}
                    />
                    <TextOutput
                        label="status"
                        value={status}
                    />
                </>
            )}
            expanded={expanded}
            onExpansionChange={onExpansionChange}
        >
            <ListView
                data={books}
                renderer={BookListRenderer}
                rendererParams={bookListRendererParams}
                keySelector={bookListKeySelector}
            />
        </ControlledExpandableContainer>
    );
}

const orderListKeySelector = (o: OrderType) => o.id;

const MAX_ITEMS_PER_PAGE = 20;

function OrderList() {
    const [pageSize, setPageSize] = useState<number>(MAX_ITEMS_PER_PAGE);
    const [page, setPage] = useState<number>(1);
    const orderVariables = useMemo(() => ({
        pageSize,
        page,
    }), []);

    const [expandedOrderId, setExpandedOrderId] = useState<string | undefined>();

    const {
        data: orderList,
        loading,
    } = useQuery<OrderListWithBooksQuery, OrderListWithBooksQueryVariables>(
        ORDER_LIST_WITH_BOOKS,
        { variables: orderVariables },
    );

    const handleExpansionChange = useCallback((orderExpanded: boolean, key: string) => {
        setExpandedOrderId(orderExpanded ? key : undefined);
    }, []);

    const orderListRendererParams: OrderListProps = useCallback((_, data: OrderType) => ({
        totalBooks: data.bookOrders.totalCount,
        orderCode: data.orderCode,
        status: data.status,
        totalPrice: data.totalPrice,
        onExpansionChange: handleExpansionChange,
        expanded: expandedOrderId === data.orderCode,
        books: data.bookOrders.results,
    }), [
        expandedOrderId,
        handleExpansionChange,
    ]);

    return (
        <Container
            className={styles.orderList}
            contentClassName={styles.orderListContent}
            footerClassName={styles.footer}
            footerContent={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={pageSize}
                    itemsCount={orderList?.orders?.totalCount}
                    onActivePageChange={setPage}
                    onItemsPerPageChange={setPageSize}
                />
            )}
        >
            <ListView
                className={styles.orders}
                data={orderList?.orders?.results}
                keySelector={orderListKeySelector}
                renderer={OrderListRenderer}
                rendererParams={orderListRendererParams}
                errored={false}
                filtered={false}
                pending={loading}
            />
        </Container>
    );
}

export default OrderList;
