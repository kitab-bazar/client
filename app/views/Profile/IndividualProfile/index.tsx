import React, { useCallback, useMemo } from 'react';
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
    ContainerCard,
    useModalState,
} from '@the-deep/deep-ui';
import { removeNull } from '@togglecorp/toggle-form';
import {
    IndividualProfileQuery,
    IndividualProfileQueryVariables,
    OrderListQuery,
    OrderListQueryVariables,
    OrderType,
    OrderStatus,
} from '#generated/types';
import routes from '#base/configs/routes';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';

import EditProfileModal from './EditProfileModal';
import styles from './styles.css';

const INDIVIDUAL_PROFILE = gql`
    query IndividualProfile {
        me {
            email
            fullName
            firstName
            lastName
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
        <ContainerCard
            className={styles.orderItem}
            heading={orderCode}
            headingClassName={styles.heading}
            headingSize="extraSmall"
            footerActions={(
                <SmartButtonLikeLink
                    route={routes.orderList}
                    state={{ orderId: orderCode }}
                >
                    View details
                </SmartButtonLikeLink>
            )}
        >
            <TextOutput
                label="Books"
                labelContainerClassName={styles.label}
                valueType="number"
                hideLabelColon
                value={totalBookTypes}
            />
            <TextOutput
                label="total price"
                labelContainerClassName={styles.label}
                valueType="number"
                hideLabelColon
                value={totalPrice}
                valueProps={{
                    prefix: 'Rs.',
                }}
            />
            <TextOutput
                label="status"
                labelContainerClassName={styles.label}
                hideLabelColon
                value={status}
            />
        </ContainerCard>
    );
}

const orderListKeySelector = (o: OrderType) => o.id;

function IndividualProfile() {
    const [
        editProfileModalShown,
        showEditProfileModal,
        hideEditProfileModal,
    ] = useModalState(false);

    const {
        data,
        refetch: refetchProfileDetails,
    } = useQuery<IndividualProfileQuery, IndividualProfileQueryVariables>(
        INDIVIDUAL_PROFILE,
    );

    const profileDetails = removeNull(data);

    const orderVariables = useMemo(() => ({
        pageSize: 4,
        page: 1,
    }), []);

    const {
        data: orderList,
        loading,
    } = useQuery<OrderListQuery, OrderListQueryVariables>(
        ORDER_LIST,
        { variables: orderVariables },
    );

    const orderListRendererParams = useCallback((_, order: Omit<OrderType, 'createdBy'>): OrderListProps => ({
        totalBookTypes: order.bookOrders?.totalCount ?? 0,
        orderCode: order.orderCode,
        status: order.status,
        totalPrice: order.totalPrice,
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
                            onClick={showEditProfileModal}
                            icons={<IoPencil />}
                        >
                            Edit Profile
                        </Button>
                        <TextOutput
                            label="Name"
                            value={profileDetails?.me?.fullName}
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
                        <SmartButtonLikeLink
                            route={routes.wishList}
                            variant="general"
                            actions={<IoHeart />}
                        >
                            My Wishlist
                        </SmartButtonLikeLink>
                        <SmartButtonLikeLink
                            route={routes.cartPage}
                            variant="general"
                            actions={<IoCart />}
                        >
                            My Cart
                        </SmartButtonLikeLink>
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
                footerActions={(
                    <SmartButtonLikeLink
                        route={routes.orderList}
                    >
                        View More
                        <IoArrowForward />
                    </SmartButtonLikeLink>
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
            {editProfileModalShown && (
                <EditProfileModal
                    onModalClose={hideEditProfileModal}
                    onEditSuccess={refetchProfileDetails}
                    profileDetails={profileDetails?.me}
                />
            )}
        </div>
    );
}

export default IndividualProfile;
