import React, { useMemo, useState, useCallback } from 'react';
import {
    Modal,
    Pager,
    List,
    ListView,
    ImagePreview,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import {
    PaymentLogsQuery,
    PaymentLogsQueryVariables,
} from '#generated/types';
import EmptyMessage from '#components/EmptyMessage';

import styles from './styles.css';

const PAYMENT_LOGS = gql`
    query PaymentLogs(
        $id: ID!,
        $ordering: String,
        $page: Int,
        $pageSize: Int,
    ) {
        moderatorQuery {
            payment(id: $id) {
                id
                paymentLog(ordering: $ordering, page: $page, pageSize: $pageSize) {
                    page
                    pageSize
                    totalCount
                    results {
                        id
                        comment
                        files {
                            id
                            file {
                                name
                                url
                            }
                        }
                        snapshot
                    }
                }
            }
        }
    }
`;

function imageKeySelector(image: NonNullable<NonNullable<PaymentLog['files']>[number]>) {
    return image.id;
}

interface PaymentLogItemProps {
    data: PaymentLog;
}

function PaymentItem(props: PaymentLogItemProps) {
    const {
        data,
    } = props;

    const imageRendererParams = useCallback((_: string, file: NonNullable<PaymentLog['files']>[number]) => ({
        className: styles.imageItem,
        src: file?.file?.url ?? '',
        alt: file?.file?.name ?? '',
    }), []);

    return (
        <div
            className={styles.paymentItem}
        >
            <div className={styles.comment}>{data.comment}</div>
            <List
                data={data.files}
                rendererParams={imageRendererParams}
                renderer={ImagePreview}
                keySelector={imageKeySelector}
            />
        </div>
    );
}

interface Props {
    paymentId: string;
    onModalClose: () => void;
}

type PaymentLog = NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<PaymentLogsQuery['moderatorQuery']>>['payment']>['paymentLog']>['results']>[number];

function paymentLogKeySelector(paymentLog: PaymentLog) {
    return paymentLog.id;
}

const maxItemsPerPage = 10;
function ViewPaymentLogsModal(props: Props) {
    const {
        onModalClose,
        paymentId,
    } = props;

    const [page, setPage] = useState<number>(1);

    const variables = useMemo(() => ({
        id: paymentId,
        ordering: '-id',
        page,
        pageSize: maxItemsPerPage,
    }), [page, paymentId]);

    const {
        data: paymentLogsResponse,
        loading: paymentsLogsLoading,
        error,
    } = useQuery<PaymentLogsQuery, PaymentLogsQueryVariables>(
        PAYMENT_LOGS,
        {
            variables,
        },
    );

    const paymentLogsRendererParams = useCallback((_: string, paymentLog: PaymentLog) => ({
        data: paymentLog,
    }), []);

    return (
        <Modal
            className={styles.paymentLogsModal}
            heading="Payment Logs"
            headingSize="small"
            onCloseButtonClick={onModalClose}
            size="small"
            freeHeight
            bodyClassName={styles.content}
            footerActions={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={maxItemsPerPage}
                    itemsCount={paymentLogsResponse
                        ?.moderatorQuery?.payment?.paymentLog?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                />
            )}
        >
            <ListView
                className={styles.paymentLogsList}
                data={paymentLogsResponse?.moderatorQuery?.payment?.paymentLog?.results}
                pending={paymentsLogsLoading}
                rendererParams={paymentLogsRendererParams}
                renderer={PaymentItem}
                keySelector={paymentLogKeySelector}
                errored={!!error}
                filtered={false}
                messageShown
                emptyMessage={(
                    <EmptyMessage
                        message="Couldn't find any payment logs."
                        suggestion="Please add payment log."
                    />
                )}
            />
        </Modal>

    );
}

export default ViewPaymentLogsModal;
