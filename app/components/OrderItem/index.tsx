import React, { useState, useCallback } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import { gql, useMutation } from '@apollo/client';
import {
    internal,
    removeNull,
} from '@togglecorp/toggle-form';
import {
    Container,
    TextOutput,
    DateOutput,
    Button,
    useBooleanState,
    useAlert,
    Modal,
    TextArea,
} from '@the-deep/deep-ui';
import { orderItem } from '#base/configs/lang';
import { resolveToString } from '#base/utils/lang';
import useTranslation from '#base/hooks/useTranslation';
import {
    OrderType,
    CancelOrderMutation,
    CancelOrderMutationVariables,
} from '#generated/types';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import NumberOutput from '#components/NumberOutput';
import ErrorMessage from '#components/ErrorMessage';

// FIXME: this components should not import from views
import { ORDER_SUMMARY } from '#views/Profile/OrderList/queries';

import styles from './styles.css';

const CANCEL_ORDER = gql`
mutation CancelOrder($id: ID!, $comment: String) {
    updateOrder(data: {comment: $comment, status: CANCELLED}, id: $id) {
        result {
            id
            status
            statusDisplay
        }
        errors
        ok
    }
}
`;

export type Order = Pick<OrderType, 'id' | 'orderCode' | 'totalPrice' | 'status' | 'totalQuantity' | 'statusDisplay' | 'createdAt'> & {
    createdBy?: {
        id: string;
        canonicalName: string;
    }
}

export interface Props {
    className?: string;
    order: Order;
    onClick?: (name: Order['id']) => void;
}

function OrderItem(props: Props) {
    const {
        className,
        order,
        onClick,
    } = props;

    const {
        orderCode,
        totalPrice,
        totalQuantity,
        status,
        statusDisplay,
        createdBy,
        createdAt,
    } = order;

    const alert = useAlert();

    const [
        orderCancelModalShown,
        showModal,
        hideModal,
    ] = useBooleanState(false);

    const [comments, setComments] = useState<string | undefined>('');

    const strings = useTranslation(orderItem);
    const title = resolveToString(
        strings.orderTitle,
        { code: orderCode?.split('-')?.[0] },
    );

    const handleClick = useCallback(() => {
        if (onClick) {
            onClick(order.id);
        }
    }, [onClick, order.id]);

    const [
        cancelOrder,
        { loading: cancelOrderLoading },
    ] = useMutation<CancelOrderMutation, CancelOrderMutationVariables>(
        CANCEL_ORDER,
        {
            refetchQueries: ORDER_SUMMARY ? [ORDER_SUMMARY] : undefined,
            onCompleted: (response) => {
                const {
                    updateOrder,
                } = response;

                if (!updateOrder) {
                    return;
                }

                const {
                    errors,
                    ok,
                } = updateOrder;
                if (ok) {
                    alert.show(
                        strings.cancelOrderSuccessMessage,
                        { variant: 'success' },
                    );
                    hideModal();
                } else if (errors) {
                    const formError = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header={strings.cancelPackedOrderSucessMessage}
                            description={
                                isDefined(formError)
                                    ? formError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                    hideModal();
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header={strings.cancelOrderFailureMessage}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleOrderCancel = useCallback(
        () => {
            cancelOrder({
                variables: {
                    id: order.id,
                    comment: comments,
                },
            });
        },
        [order.id, comments, cancelOrder],
    );

    return (
        <Container
            className={_cs(
                styles.orderItem,
                className,
            )}
            contentClassName={styles.orderMeta}
            heading={(
                <Button
                    className={styles.bookTitle}
                    name={undefined}
                    variant="action"
                    onClick={onClick ? handleClick : undefined}
                >
                    {title}
                </Button>
            )}
            headingSize="extraSmall"
            headerActions={statusDisplay}
            headerActionsContainerClassName={styles.status}
            footerActions={(
                status === 'PENDING' && (
                    <Button
                        name={undefined}
                        variant="tertiary"
                        onClick={showModal}
                    >
                        {strings.cancelOrderButtonLabel}
                    </Button>
                )
            )}
        >
            {createdBy?.canonicalName && (
                <TextOutput
                    label={strings.orderedByLabel}
                    value={createdBy?.canonicalName}
                />
            )}
            {createdAt && (
                <TextOutput
                    label={strings.createdAtLabel}
                    value={(
                        <DateOutput
                            format="dd-MM-yyyy"
                            value={createdAt}
                        />
                    )}
                />
            )}
            <TextOutput
                label={strings.booksLabel}
                value={(
                    <NumberOutput
                        value={totalQuantity}
                    />
                )}
            />
            <TextOutput
                label={strings.totalPriceLabel}
                value={(
                    <NumberOutput
                        value={totalPrice}
                        currency
                    />
                )}
            />
            {orderCancelModalShown && (
                <Modal
                    heading={strings.cancelOrderModalHeader}
                    onCloseButtonClick={hideModal}
                    size="medium"
                    freeHeight
                    footerActions={(
                        <>
                            <Button
                                name={undefined}
                                onClick={hideModal}
                                variant="secondary"
                            >
                                {strings.cancelOrderModalCancelButtonLabel}
                            </Button>
                            <Button
                                name={undefined}
                                variant="primary"
                                onClick={handleOrderCancel}
                                disabled={!comments || cancelOrderLoading}
                            >
                                {strings.cancelOrderModalSaveButtonLabel}
                            </Button>
                        </>
                    )}
                >
                    <TextArea
                        name="comments"
                        value={comments}
                        onChange={setComments}
                        variant="general"
                        label={strings.cancelOrderModalCommentsLabel}
                    />
                </Modal>
            )}
        </Container>
    );
}

export default OrderItem;
