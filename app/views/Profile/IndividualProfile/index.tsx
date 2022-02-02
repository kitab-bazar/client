import React, { useCallback, useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import {
    IoPencil,
    IoHeart,
    IoCart,
    IoArrowForward,
} from 'react-icons/io5';
import { useQuery, gql } from '@apollo/client';

import {
    Container,
    Button,
    TextOutput,
    ListView,
    Card,
    Link,
} from '@the-deep/deep-ui';

import {
    IndividualProfileQuery,
    IndividualProfileQueryVariables,
    OrderListQuery,
    OrderListQueryVariables,
    OrderType,
    OrderStatus,
} from '#generated/types';
import routes from '#base/configs/routes';

import styles from './styles.css';

const INDIVIDUAL_PROFILE = gql`
    query IndividualProfile {
        me {
            email
            fullName
            id
            phoneNumber
            image {
                name
                url
            }
        }
    }
`;

const ORDER_LIST = gql`
    query OrderList(
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

interface OrderListProps {
    orderCode: string;
    totalPrice: number;
    status: OrderStatus;
    totalBookTypes: number;
}

function OrderListRenderer(props: OrderListProps) {
    const {
        orderCode,
        totalPrice,
        status,
        totalBookTypes,
    } = props;

    return (
        <Link to={generatePath(routes.orderList.path, { activeOrderId: orderCode })}>
            <Card
                className={styles.orderItem}
            >
                <TextOutput
                    label="order number"
                    value={orderCode}
                />
                <TextOutput
                    label="Total book types"
                    value={totalBookTypes}
                />
                <TextOutput
                    label="total price"
                    value={totalPrice}
                />
                <TextOutput
                    label="status"
                    value={status}
                />
            </Card>
        </Link>
    );
}

const orderListKeySelector = (o: OrderType) => o.id;

function IndividualProfile() {
    const {
        data: profileDetails,
    } = useQuery<IndividualProfileQuery, IndividualProfileQueryVariables>(
        INDIVIDUAL_PROFILE,
    );

    const orderVariables = useMemo(() => ({
        pageSize: 20,
        page: 1,
    }), []);

    const {
        data: orderList,
        loading,
    } = useQuery<OrderListQuery, OrderListQueryVariables>(
        ORDER_LIST,
        { variables: orderVariables },
    );

    const handleEditProfile = useCallback(() => {
        console.warn('handle me');
    }, []);

    const handleWishlistClick = useCallback(() => {
        console.warn('handle me');
    }, []);

    const handleCartClick = useCallback(() => {
        console.warn('handle me');
    }, []);

    const orderListRendererParams = useCallback((_, data: Omit<OrderType, 'createdBy'>): OrderListProps => ({
        totalBookTypes: data.bookOrders?.totalCount ?? 0,
        orderCode: data.orderCode,
        status: data.status,
        totalPrice: data.totalPrice,
    }), []);

    return (
        <div className={styles.individualProfile}>
            <Container
                contentClassName={styles.profileDetails}
                heading="Profile Details"
                spacing="comfortable"
            >
                <div className={styles.left}>
                    <div
                        className={styles.displayPicture}
                    >
                        <img
                            src={profileDetails?.me?.image?.url ?? undefined}
                            alt={profileDetails?.me?.image?.name ?? ''}
                        />
                    </div>
                    <div className={styles.description}>
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={handleEditProfile}
                            icons={<IoPencil />}
                        >
                            Edit Profile
                        </Button>
                        <TextOutput
                            label="Name"
                            value={profileDetails?.me?.fullName}
                        />
                        <TextOutput
                            label="Address"
                            value={profileDetails?.me?.email}
                        />
                        <TextOutput
                            label="Email"
                            value={profileDetails?.me?.email}
                        />
                        <TextOutput
                            label="Phone Number"
                            value={profileDetails?.me?.phoneNumber}
                        />
                    </div>
                </div>
                <div>
                    <div className={styles.buttons}>
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={handleWishlistClick}
                            actions={<IoHeart />}
                        >
                            My Wishlist
                        </Button>
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={handleCartClick}
                            actions={<IoCart />}
                        >
                            My Card
                        </Button>
                    </div>
                    <div>
                        <h4>Order Details</h4>
                        <TextOutput
                            label="total orders"
                            value={orderList?.orders?.totalCount}
                        />
                        <TextOutput
                            label="Orders this week"
                            value="2 (will come from server soon)"
                        />
                    </div>
                </div>
            </Container>
            <Container
                heading="Order Details"
                spacing="comfortable"
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
                <Link to={generatePath(routes.orderList.path, {})}>
                    View More
                    <IoArrowForward />
                </Link>
            </Container>
        </div>
    );
}

export default IndividualProfile;
