import React, { useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    ListView,
    TextOutput,
    Pager,
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
    OrderStatusOptionsQuery,
    OrderStatusOptionsQueryVariables,
} from '#generated/types';
import { orderList as orderListLang } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import OrderItem, { Props as OrderItemProps } from '#components/OrderItem';

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
const orderListKeySelector = (o: OrderType) => o.id;

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
    className?: string;
}

function OrderList(props: Props) {
    const {
        className,
    } = props;

    const strings = useTranslation(orderListLang);

    const [page, setPage] = useState<number>(1);
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

    const orderListRendererParams = useCallback((_, data: Omit<OrderType, 'createdBy'>): OrderItemProps => ({
        className: styles.orderItem,
        order: data,
    }), []);

    return (
        <div className={_cs(styles.orderList, className)}>
            <div className={styles.headerContainer}>
                <Header
                    className={styles.pageHeader}
                    heading={strings.pageHeading}
                    spacing="loose"
                >
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        icons={<IoSearchSharp />}
                        placeholder={strings.searchPlaceholder}
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
                        label={strings.orderStatusFilterLabel}
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
                            {strings.clearStatusFilterButtonLabel}
                        </Button>
                    )}
                </div>
                <div className={styles.ordersListSection}>
                    <div className={styles.summary}>
                        <TextOutput
                            className={styles.orderCount}
                            value={orderList?.orders?.totalCount}
                            label={strings.orderCountLabel}
                        />
                    </div>
                    <ListView
                        borderBetweenItem
                        className={styles.orderList}
                        data={orderList?.orders?.results ?? undefined}
                        keySelector={orderListKeySelector}
                        renderer={OrderItem}
                        rendererParams={orderListRendererParams}
                        errored={!!error}
                        filtered={filtered}
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
                </div>
            </div>
        </div>
    );
}

export default OrderList;
