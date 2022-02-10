import React, { useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    ListView,
    TextOutput,
    ControlledExpandableContainer,
    Pager,
    Container,
    TextInput,
    Header,
    RadioInput,
    Button,
    useInputState,
} from '@the-deep/deep-ui';
import { IoSearchSharp } from 'react-icons/io5';
import {
    OrderListWithBooksQuery,
    OrderListWithBooksQueryVariables,
    OrderType,
    OrderStatus,
    BookOrderType,
    OrderStatusOptionsQuery,
    OrderStatusOptionsQueryVariables,
} from '#generated/types';

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
const ORDER_STATUS_OPTIONS = gql`
query OrderStatusOptions {
    orderStatusList: __type(name: "OrderStatus") {
        enumValues {
            name
            description
        }
    }
}
`;

const enumKeySelector = (d: { name: string}) => d.name;
const enumLabelSelector = (d: { description?: string | null }) => d.description ?? '???';
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

function OrderItem(props: OrderListItemProps) {
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

    const orderTitle = React.useMemo(() => {
        const splits = orderCode.split('-');

        return `Order #${splits[0]}`;
    }, [orderCode]);

    return (
        <ControlledExpandableContainer
            className={styles.orderItem}
            name={orderCode}
            heading={orderTitle}
            headingSize="extraSmall"
            headerDescriptionClassName={styles.orderMeta}
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
    const [status, setStatus] = useInputState<string | undefined>(undefined);

    const orderVariables = useMemo(() => ({
        pageSize: MAX_ITEMS_PER_PAGE,
        page,
        status: status ? [status] : undefined,
    }), [page, status]);

    const filtered = !!status;

    const {
        previousData,
        data: orderList = previousData,
        loading,
        error,
    } = useQuery<OrderListWithBooksQuery, OrderListWithBooksQueryVariables>(
        ORDER_LIST_WITH_BOOKS,
        { variables: orderVariables },
    );

    const { data: statusOptions } = useQuery<
        OrderStatusOptionsQuery,
        OrderStatusOptionsQueryVariables
    >(
        ORDER_STATUS_OPTIONS,
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
        <div className={_cs(styles.orderList, className)}>
            <div className={styles.headerContainer}>
                <Header
                    className={styles.pageHeader}
                    heading="My Orders"
                    spacing="loose"
                >
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        icons={<IoSearchSharp />}
                        placeholder="Search by book title (3 or more characters)"
                        disabled
                        name={undefined}
                        value={undefined}
                        onChange={undefined}
                    />
                </Header>
            </div>
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    <RadioInput
                        className={styles.statusInput}
                        listContainerClassName={styles.statusList}
                        name={undefined}
                        label="Order Status"
                        options={statusOptions?.orderStatusList?.enumValues ?? undefined}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        value={status}
                        onChange={setStatus}
                    />
                    {status && status.length > 0 && (
                        <Button
                            name={undefined}
                            onClick={setStatus}
                            variant="transparent"
                            spacing="none"
                        >
                            Clear status filter
                        </Button>
                    )}
                </div>
                <div className={styles.ordersListSection}>
                    <div className={styles.summary}>
                        <TextOutput
                            className={styles.orderCount}
                            value={orderList?.orders?.totalCount}
                            label="Order(s) found"
                        />
                    </div>
                    <ListView
                        className={styles.orderList}
                        data={orderList?.orders?.results ?? undefined}
                        keySelector={orderListKeySelector}
                        renderer={OrderItem}
                        rendererParams={orderListRendererParams}
                        errored={!!error}
                        filtered={filtered}
                        pending={loading}
                    />
                    <Pager
                        activePage={page}
                        maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                        itemsCount={orderList?.orders?.totalCount ?? 0}
                        onActivePageChange={setPage}
                        itemsPerPageControlHidden
                    />
                </div>
            </div>
        </div>
    );
}

export default OrderList;
