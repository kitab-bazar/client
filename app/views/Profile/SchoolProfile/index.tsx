import React, { useCallback, useMemo } from 'react';
import {
    IoPencil,
    IoArrowForward,
    IoHeart,
    IoPerson,
    IoList,
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
import { _cs } from '@togglecorp/fujs';

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
            email
            fullName
            firstName
            lastName
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

const orderListKeySelector = (o: OrderType) => o.id;

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

interface Props {
    className?: string,
}

function SchoolProfile(props: Props) {
    const { className } = props;

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
        <div
            className={_cs(
                styles.schoolProfile,
                className,
            )}
        >
            <div className={styles.pageContainer}>
                <Container
                    className={styles.profileDetails}
                    contentClassName={styles.profileDetailsContent}
                    spacing="comfortable"
                    heading={strings.profileDetailsHeading}
                    headerActions={(
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={showEditSchoolProfileModal}
                            icons={<IoPencil />}
                        >
                            {strings.editSchoolProfileButtonContent}
                        </Button>
                    )}
                >
                    <div className={styles.schoolDetails}>
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
                                label={strings.schoolNameLabel}
                                value={profileDetails?.me?.school?.name}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label={strings.emailLabel}
                                value={profileDetails?.me?.email}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
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
                    <div className={styles.usefulLinks}>
                        <SmartButtonLikeLink
                            route={routes.wishList}
                            variant="general"
                            actions={<IoHeart />}
                        >
                            {strings.myWishlistLabel}
                        </SmartButtonLikeLink>
                    </div>
                    <Container
                        className={styles.orderDetails}
                        heading={strings.orderDetailsHeading}
                    >
                        <TextOutput
                            label={strings.totalOrdersLabel}
                            value={orderList?.orders?.totalCount}
                        />
                        <TextOutput
                            label={strings.weeksOrderLabel}
                            value="2 (will come from server soon)"
                        />
                    </Container>
                </Container>
                <Container
                    className={styles.orderDetails}
                    heading={strings.orderDetailsHeading}
                    spacing="comfortable"
                    footerActions={(
                        <SmartButtonLikeLink
                            route={routes.orderList}
                            icons={<IoArrowForward />}
                            variant="tertiary"
                        >
                            {strings.viewMoreButtonContent}
                        </SmartButtonLikeLink>
                    )}
                >
                    <ListView
                        className={styles.orderList}
                        data={orderList?.orders?.results ?? undefined}
                        keySelector={orderListKeySelector}
                        renderer={OrderListRenderer}
                        rendererParams={orderListRendererParams}
                        // FIXME: handle errored and filtered
                        errored={false}
                        filtered={false}
                        pending={loading}
                        messageShown
                        // FIXME: use strings
                        // FIXME: use common component
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
        </div>
    );
}

export default SchoolProfile;
