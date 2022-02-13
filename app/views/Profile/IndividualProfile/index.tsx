import React, { useCallback, useMemo, useState } from 'react';
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
} from '#generated/types';

import OrderItem, { Props as OrderItemProps, Order } from '#components/OrderItem';

import { individualProfile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

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

const orderListKeySelector = (o: Order) => o.id;

const MAX_ITEMS_PER_PAGE = 4;

interface Props {
    className?: string;
}

function IndividualProfile(props: Props) {
    const { className } = props;
    const strings = useTranslation(individualProfile);

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

    const [page, setPage] = useState<number>(1);

    const orderVariables = useMemo(() => ({
        pageSize: MAX_ITEMS_PER_PAGE,
        page,
    }), [page]);

    const {
        data: orderList,
        loading,
        error,
    } = useQuery<OrderListIndividualQuery, OrderListIndividualQueryVariables>(
        ORDER_LIST_INDIVIDUAL,
        { variables: orderVariables },
    );

    const orderListRendererParams = useCallback((_, order: Order): OrderItemProps => ({
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
                    heading={strings.userDetailHeading}
                    spacing="comfortable"
                    headerActions={(
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={showEditProfileModal}
                            icons={<IoPencil />}
                        >
                            {strings.editProfileLabel}
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
                                label={strings.nameAttributeLabel}
                                value={profileDetails?.me?.fullName}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label={strings.emailAttributeLabel}
                                value={profileDetails?.me?.email}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label={strings.phoneAttributeLabel}
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
                            {strings.wishlistLabel}
                        </SmartButtonLikeLink>
                    </div>
                    <Container
                        className={styles.orderSummary}
                        contentClassName={styles.summaryItemList}
                        withoutExternalPadding
                        heading={strings.orderSummaryHeading}
                        headingSize="small"
                    >
                        <TextOutput
                            label={strings.totalOrdersLabel}
                            value={orderList?.orders?.totalCount}
                        />
                    </Container>
                </Container>
                <Container
                    className={styles.orderDetails}
                    headingSize="small"
                    heading={strings.recentOrdersHeading}
                    spacing="comfortable"
                    headerActions={(
                        <SmartButtonLikeLink
                            route={routes.orderList}
                            actions={<IoArrowForward />}
                            variant="tertiary"
                        >
                            {strings.viewAllLabel}
                        </SmartButtonLikeLink>
                    )}
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
                        className={styles.orderList}
                        data={orderList?.orders?.results ?? undefined}
                        keySelector={orderListKeySelector}
                        renderer={OrderItem}
                        rendererParams={orderListRendererParams}
                        messageShown
                        // FIXME: use common component
                        emptyMessage={(
                            <div className={styles.emptyMessage}>
                                <IoList className={styles.icon} />
                                <div className={styles.text}>
                                    <div className={styles.primary}>
                                        {strings.recentOrderEmptyMessage}
                                    </div>
                                    <div className={styles.suggestion}>
                                        {strings.recentOrderEmptySuggestion}
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
