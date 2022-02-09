import React, { useCallback, useMemo, useState } from 'react';
import {
    IoPencil,
    IoArrowForward,
    IoHeart,
    IoCart,
    IoPerson,
    IoList,
} from 'react-icons/io5';
import { useQuery, gql } from '@apollo/client';
import {
    Button,
    Container,
    ListView,
    Pager,
    TextOutput,
    useModalState,
} from '@the-deep/deep-ui';
import { removeNull } from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';

import routes from '#base/configs/routes';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import {
    IndividualProfileQuery,
    IndividualProfileQueryVariables,
    OrderListIndividualQuery,
    OrderListIndividualQueryVariables,
    OrderType,
} from '#generated/types';

import OrderItem, { Props as OrderItemProps } from '#components/OrderItem';

import EditProfileModal from './EditProfileModal';
import styles from './styles.css';

const INDIVIDUAL_PROFILE = gql`
    query IndividualProfile {
        me {
            id
            email
            fullName
            firstName
            lastName
            phoneNumber
            image {
                name
                url
            }
        }
    }
`;

const ORDER_LIST_INDIVIDUAL = gql`
    query OrderListIndividual(
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

const orderListKeySelector = (o: OrderType) => o.id;

const MAX_ITEMS_PER_PAGE = 3;

interface Props {
    className?: string;
}

function IndividualProfile(props: Props) {
    const { className } = props;

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

    const [pageSize, setPageSize] = useState<number>(MAX_ITEMS_PER_PAGE);
    const [page, setPage] = useState<number>(1);

    const orderVariables = useMemo(() => ({
        pageSize,
        page,
    }), [pageSize, page]);

    const {
        data: orderList,
        loading,
        error,
    } = useQuery<OrderListIndividualQuery, OrderListIndividualQueryVariables>(
        ORDER_LIST_INDIVIDUAL,
        { variables: orderVariables },
    );

    const orderListRendererParams = useCallback((_, order: Omit<OrderType, 'createdBy'>): OrderItemProps => ({
        order,
    }), []);

    return (
        <div
            className={_cs(
                styles.individualProfile,
                className,
            )}
        >
            <div className={styles.pageContainer}>
                <Container
                    className={styles.userDetails}
                    contentClassName={styles.userDetailContent}
                    heading="User Details"
                    spacing="comfortable"
                    headerActions={(
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={showEditProfileModal}
                            icons={<IoPencil />}
                        >
                            Edit Profile
                        </Button>
                    )}
                >
                    <div className={styles.personalDetails}>
                        <div className={styles.displayPicture}>
                            {profileDetails?.me?.image?.url ? (
                                <img
                                    className={styles.image}
                                    src={profileDetails.me.image.url}
                                    alt={profileDetails.me.image.name}
                                />
                            ) : (
                                <IoPerson className={styles.fallbackIcon} />
                            )}
                        </div>
                        <div className={styles.attributes}>
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label="Name"
                                value={profileDetails?.me?.fullName}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label="Email"
                                value={profileDetails?.me?.email}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label="Phone Number"
                                value={profileDetails?.me?.phoneNumber ?? 'Not available'}
                            />
                        </div>
                    </div>
                    <div className={styles.usefulLinks}>
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
                    <Container
                        className={styles.orderSummary}
                        contentClassName={styles.summaryItemList}
                        withoutExternalPadding
                        heading="Order Summary"
                        headingSize="small"
                    >
                        <TextOutput
                            label="Total orders"
                            value={orderList?.orders?.totalCount}
                        />
                        {/*
                        <TextOutput
                            label="Orders this week"
                            value="2"
                        />
                        */}
                    </Container>
                </Container>
                <Container
                    className={styles.orderDetails}
                    headingSize="small"
                    heading="Recent Orders"
                    spacing="comfortable"
                    headerActions={(
                        <SmartButtonLikeLink
                            route={routes.orderList}
                            actions={<IoArrowForward />}
                            variant="tertiary"
                        >
                            View all
                        </SmartButtonLikeLink>
                    )}
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
                        className={styles.orderList}
                        data={orderList?.orders?.results ?? undefined}
                        keySelector={orderListKeySelector}
                        renderer={OrderItem}
                        rendererParams={orderListRendererParams}
                        messageShown
                        emptyMessage={(
                            <div className={styles.emptyMessage}>
                                <IoList className={styles.icon} />
                                <div className={styles.text}>
                                    <div className={styles.primary}>
                                        You dont have any Recent Orders
                                    </div>
                                    <div className={styles.suggestion}>
                                        Add Books that you want to buy
                                        later by clicking Add to Wishlist
                                        and then goto your Cart to place your Order
                                    </div>
                                </div>
                            </div>
                        )}
                        errored={!!error}
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
        </div>
    );
}

export default IndividualProfile;
