import React, { useMemo, useCallback } from 'react';
import {
    IoPencil,
    IoArrowForward,
    IoHeart,
    IoCart,
} from 'react-icons/io5';
import { useQuery, gql } from '@apollo/client';
import {
    Button,
    Container,
    ContainerCard,
    ListView,
    TextOutput,
    useModalState,
} from '@the-deep/deep-ui';
import { removeNull } from '@togglecorp/toggle-form';

import routes from '#base/configs/routes';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import {
    SchoolProfileQuery,
    SchoolProfileQueryVariables,
    OrderListSchoolQuery,
    OrderListSchoolQueryVariables,
    OrderType,
    OrderStatus,
} from '#generated/types';
import { school } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import EditSchoolProfileModal from './EditSchoolProfileModal';
import styles from './styles.css';

const SCHOOL_PROFILE = gql`
    query SchoolProfile {
        me {
            id
            firstName
            lastName
            fullName
            email
            phoneNumber
            image {
              name
              url
            }
            school {
                id
                name
                localAddress
                panNumber
                vatNumber
                wardNumber
                municipality {
                    id
                    name
                    district {
                        id
                        name
                    }
                    province {
                        id
                        name
                    }
                }
            }
        }
    }
`;

const ORDER_LIST_SCHOOL = gql`
    query OrderListSchool(
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

    const strings = useTranslation(school);

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
                label={strings.booksLabel}
                labelContainerClassName={styles.label}
                valueType="number"
                hideLabelColon
                value={totalBookTypes}
            />
            <TextOutput
                label={strings.totalPriceLabel}
                labelContainerClassName={styles.label}
                valueType="number"
                hideLabelColon
                value={totalPrice}
                valueProps={{
                    prefix: strings.rsLabel,
                }}
            />
            <TextOutput
                label={strings.statusLabel}
                labelContainerClassName={styles.label}
                hideLabelColon
                value={status}
            />
        </ContainerCard>
    );
}

const orderListKeySelector = (o: OrderType) => o.id;

function SchoolProfile() {
    const [
        editSchoolProfileModalShown,
        showEditSchoolProfileModal,
        hideEditSchoolProfileModal,
    ] = useModalState(false);

    const strings = useTranslation(school);

    const {
        data,
        refetch: refetchProfileDetails,
    } = useQuery<SchoolProfileQuery, SchoolProfileQueryVariables>(
        SCHOOL_PROFILE,
    );

    const profileDetails = removeNull(data);

    const orderVariables = useMemo(() => ({
        pageSize: 4,
        page: 1,
    }), []);

    const {
        data: orderList,
        loading,
    } = useQuery<OrderListSchoolQuery, OrderListSchoolQueryVariables>(
        ORDER_LIST_SCHOOL,
        { variables: orderVariables },
    );

    const orderListRendererParams = useCallback((_, order: Omit<OrderType, 'createdBy'>): OrderListProps => ({
        totalBookTypes: order.bookOrders?.totalCount ?? 0,
        orderCode: order.orderCode,
        status: order.status,
        totalPrice: order.totalPrice,
    }), []);

    const schoolDetails = {
        ...profileDetails?.me?.school,
        municipality: profileDetails?.me?.school?.municipality?.id,
    };

    return (
        <div className={styles.schoolProfile}>
            <Container
                contentClassName={styles.profileDetails}
                spacing="comfortable"
                heading={strings.profileDetailsHeading}
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
                            onClick={showEditSchoolProfileModal}
                            icons={<IoPencil />}
                        >
                            {strings.editSchoolProfileButtonContent}
                        </Button>
                        <TextOutput
                            label={strings.schoolNameLabel}
                            value={profileDetails?.me?.school?.name}
                        />
                        <TextOutput
                            label={strings.nameLabel}
                            value={profileDetails?.me?.fullName}
                        />
                        <TextOutput
                            label={strings.emailLabel}
                            value={profileDetails?.me?.email}
                        />
                        <TextOutput
                            label={strings.phoneNumberLabel}
                            value={profileDetails?.me?.phoneNumber}
                        />
                        <TextOutput
                            label={strings.addressLabel}
                            value={`${
                                profileDetails
                                    ?.me
                                    ?.school
                                    ?.localAddress
                            }, ${
                                profileDetails
                                    ?.me
                                    ?.school
                                    ?.municipality
                                    ?.district
                                    ?.name
                            }`}
                        />
                        <TextOutput
                            label={strings.wardNumberLabel}
                            value={profileDetails?.me?.school?.wardNumber}
                        />
                        <TextOutput
                            label={strings.panNumberLabel}
                            value={profileDetails?.me?.school?.panNumber}
                        />
                        <TextOutput
                            label={strings.vatNumberLabel}
                            value={profileDetails?.me?.school?.vatNumber}
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
                            {strings.myWishlistLabel}
                        </SmartButtonLikeLink>
                        <SmartButtonLikeLink
                            route={routes.cartPage}
                            variant="general"
                            actions={<IoCart />}
                        >
                            {strings.myCartLabel}
                        </SmartButtonLikeLink>
                    </div>
                    <div>
                        <h4>Order Details</h4>
                        <TextOutput
                            label={strings.totalOrdersLabel}
                            value={orderList?.orders?.totalCount}
                        />
                        <TextOutput
                            label={strings.weeksOrderLabel}
                            value="2 (will come from server soon)"
                        />
                    </div>
                </div>
            </Container>
            <Container
                heading={strings.orderDetailsHeading}
                spacing="comfortable"
                footerActions={(
                    <SmartButtonLikeLink
                        route={routes.orderList}
                    >
                        {strings.viewMoreButtonContent}
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
            {editSchoolProfileModalShown && (
                <EditSchoolProfileModal
                    onModalClose={hideEditSchoolProfileModal}
                    onEditSuccess={refetchProfileDetails}
                    profileDetails={schoolDetails}
                />
            )}
        </div>
    );
}

export default SchoolProfile;
