import React, { useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
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

interface BookProps {
    edition: string;
    image?: string;
    isbn: string;
    price: number;
    quantity: number;
    title: string;
}

function Book(props: BookProps) {
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
    books: BookOrderType[] | undefined;
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

    const bookListRendererParams = useCallback((_: string, data: BookOrderType): BookProps => ({
        edition: data.edition,
        image: data?.image?.url ?? undefined,
        isbn: data.isbn,
        price: data.price,
        quantity: data.quantity,
        title: data.title,
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
                renderer={Book}
                rendererParams={bookListRendererParams}
                keySelector={bookListKeySelector}
                errored={false}
                filtered={false}
                pending={false}
            />
        </ControlledExpandableContainer>
    );
}

const orderListKeySelector = (o: OrderType) => o.id;

const MAX_ITEMS_PER_PAGE = 20;

interface Props {
    className?: string;
    activeOrderId?: string;
}

function OrderList(props: Props) {
    const {
        className,
        activeOrderId,
    } = props;

    const [pageSize, setPageSize] = useState<number>(MAX_ITEMS_PER_PAGE);
    const [page, setPage] = useState<number>(1);
    const orderVariables = useMemo(() => ({
        pageSize,
        page,
    }), [pageSize, page]);

    const [expandedOrderId, setExpandedOrderId] = useState<string | undefined>(activeOrderId);

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

    const orderListRendererParams = useCallback((_, data: Omit<OrderType, 'createdBy'>): OrderListProps => ({
        totalBooks: data?.bookOrders?.totalCount ?? 0,
        orderCode: data.orderCode,
        status: data.status,
        totalPrice: data.totalPrice,
        onExpansionChange: handleExpansionChange,
        expanded: expandedOrderId === data.orderCode,
        books: data?.bookOrders?.results ?? undefined,
    }), [
        expandedOrderId,
        handleExpansionChange,
    ]);

    return (
        <Container
            className={_cs(styles.orderList, className)}
            footerContent={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={pageSize}
                    itemsCount={orderList?.orders?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    onItemsPerPageChange={setPageSize}
                />
            )}
        >
            <ListView
                className={styles.orders}
                data={orderList?.orders?.results ?? undefined}
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
