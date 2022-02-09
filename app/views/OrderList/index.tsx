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
            <div className={styles.coverImage}>
                <img
                    className={styles.image}
                    src={image}
                    alt=""
                />
            </div>
            <Container
                heading={title}
                headingSize="extraSmall"
                className={styles.bookDetails}
                contentClassName={styles.metaList}
            >
                <TextOutput
                    // FIXME: translate
                    label="Quantity"
                    value={quantity}
                />
                <TextOutput
                    // FIXME: translate
                    label="ISBN"
                    value={isbn}
                />
                <TextOutput
                    // FIXME: translate
                    label="Edition"
                    value={edition}
                />
                <TextOutput
                    // FIXME: translate
                    label="Price (NPR)"
                    value={price}
                />
            </Container>
        </div>
    );
}

interface OrderListItemProps {
    orderCode: string;
    totalPrice: number;
    status: OrderStatus;
    totalBooks: number;
    expanded: boolean;
    onExpansionChange: (isExpanded: boolean, orderId: string) => void;
    books: BookOrderType[] | undefined;
}

function OrderListRenderer(props: OrderListItemProps) {
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
            heading={orderCode}
            headingSize="extraSmall"
            headerDescription={(
                <>
                    <TextOutput
                        // FIXME: translate
                        label="Total book types"
                        value={totalBooks}
                    />
                    <TextOutput
                        // FIXME: translate
                        label="total price"
                        value={totalPrice}
                    />
                    <TextOutput
                        // FIXME: translate
                        label="status"
                        value={status}
                    />
                </>
            )}
            expanded={expanded}
            onExpansionChange={onExpansionChange}
        >
            <ListView
                className={styles.bookList}
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
}

function OrderList(props: Props) {
    const {
        className,
    } = props;

    const [page, setPage] = useState<number>(1);
    const [expandedOrderId, setExpandedOrderId] = useState<string | undefined>();

    const orderVariables = useMemo(() => ({
        pageSize: MAX_ITEMS_PER_PAGE,
        page,
    }), [page]);

    const {
        data: orderList,
        loading,
        error,
    } = useQuery<OrderListWithBooksQuery, OrderListWithBooksQueryVariables>(
        ORDER_LIST_WITH_BOOKS,
        { variables: orderVariables },
    );

    const handleExpansionChange = useCallback((orderExpanded: boolean, key: string) => {
        setExpandedOrderId(orderExpanded ? key : undefined);
    }, []);

    const orderListRendererParams = useCallback((_, data: Omit<OrderType, 'createdBy'>): OrderListItemProps => ({
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
            contentClassName={styles.mainContent}
            footerContent={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                    itemsCount={orderList?.orders?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                />
            )}
        >
            <ListView
                className={styles.orders}
                data={orderList?.orders?.results ?? undefined}
                keySelector={orderListKeySelector}
                renderer={OrderListRenderer}
                rendererParams={orderListRendererParams}
                errored={!!error}
                filtered={false}
                pending={loading}
            />
        </Container>
    );
}

export default OrderList;
