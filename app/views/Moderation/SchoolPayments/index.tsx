import React, { useMemo, useState, useCallback } from 'react';
import { IoBanOutline } from 'react-icons/io5';
import {
    Button,
    Container,
    Pager,
    TableView,
    TableColumn,
    TableHeaderCell,
    TableHeaderCellProps,
    createStringColumn,
    createNumberColumn,
    useModalState,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    PaymentsQuery,
    PaymentsQueryVariables,
} from '#generated/types';

import { createDateColumn } from '#components/tableHelpers';

import Actions, { Props as ActionsProps } from './Actions';
import UpdatePaymentModal from './UpdatePaymentModal';

const PAYMENTS = gql`
    query Payments(
        $ordering: String,
        $page: Int,
        $pageSize: Int,
        $paymentType: PaymentTypeEnum,
        $status: StatusEnum,
        $transactionType: TransactionTypeEnum,
    ) {
        moderatorQuery {
            payments(
                ordering: $ordering,
                page: $page,
                pageSize: $pageSize,
                paymentType: $paymentType,
                status: $status,
                transactionType: $transactionType,
            ) {
                page
                pageSize
                results {
                    id
                    amount
                    createdAt
                    createdBy {
                        id
                        fullName
                    }
                    paidBy {
                        fullName
                        id
                    }
                    paymentType
                    status
                    transactionType
                }
                totalCount
            }
        }
    }
`;

export type Payment = NonNullable<NonNullable<NonNullable<PaymentsQuery['moderatorQuery']>['payments']>['results']>[number];

const statusLabelMap: { [key in Payment['status']]: string } = {
    PENDING: 'Pending',
    VERIFIED: 'Verified',
    CANCELLED: 'Canceled',
};

const transactionTypeLabelMap: {[key in Payment['transactionType']]: string} = {
    CREDIT: 'Credit',
    DEBIT: 'Debit',
};

function paymentKeySelector(payment: Payment) {
    return payment.id;
}

interface Props {
    className?: string;
}

function SchoolPayments(props: Props) {
    const {
        className,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined | null>();
    const {
        data: paymentsQueryResponse,
        loading: paymentsLoading,
        refetch: refetchPayments,
    } = useQuery<PaymentsQuery, PaymentsQueryVariables>(
        PAYMENTS,
    );

    const payments = paymentsQueryResponse?.moderatorQuery?.payments?.results;

    const [
        updatePaymentModalShown,
        showUpdatePaymentModal,
        hideUpdatePaymentModal,
    ] = useModalState(false);

    const handleEditPayment = useCallback((id: string) => {
        setSelectedPaymentId(id);
        showUpdatePaymentModal();
    }, [showUpdatePaymentModal]);

    const handleAddPayment = useCallback(() => {
        setSelectedPaymentId(undefined);
        showUpdatePaymentModal();
    }, [showUpdatePaymentModal]);

    const handleUpdateSuccess = useCallback(() => {
        setSelectedPaymentId(undefined);
        refetchPayments();
    }, [refetchPayments]);

    const columns = useMemo(() => {
        const actionsColumn: TableColumn<
            Payment, string, ActionsProps, TableHeaderCellProps
        > = {
            id: 'actions',
            title: '',
            headerCellRenderer: TableHeaderCell,
            headerCellRendererParams: {
                sortable: false,
            },
            cellRenderer: Actions,
            cellRendererParams: (_, data) => ({
                data,
                onEditClick: handleEditPayment,
            }),
        };
        return [
            createStringColumn<Payment, string>(
                'id',
                'Payment ID',
                (item) => item.id,
            ),
            createDateColumn<Payment, string>(
                'createdAt',
                'Payment Added On',
                (item) => item.createdAt,
            ),
            createNumberColumn<Payment, string>(
                'amount',
                'Amount',
                (item) => item.amount,
            ),
            createStringColumn<Payment, string>(
                'createdBy',
                'Created By',
                (item) => item.createdBy.fullName,
            ),
            createStringColumn<Payment, string>(
                'paidBy',
                'Paid By',
                (item) => item.paidBy.fullName,
            ),
            createStringColumn<Payment, string>(
                'status',
                'Status',
                (item) => statusLabelMap[item.status],
            ),
            createStringColumn<Payment, string>(
                'trasactionType',
                'Type',
                (item) => transactionTypeLabelMap[item.transactionType],
            ),
            actionsColumn,
        ];
    }, [handleEditPayment]);

    const selectedPayment = payments?.find((payment) => payment.id === selectedPaymentId);

    return (
        <Container
            className={className}
            heading="Payments"
            headerActions={(
                <Button
                    name={undefined}
                    onClick={handleAddPayment}
                    variant="primary"
                >
                    Add Payment
                </Button>
            )}
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={paymentsQueryResponse?.moderatorQuery?.payments?.totalCount ?? 0}
                    maxItemsPerPage={maxItemsPerPage}
                    onItemsPerPageChange={setMaxItemsPerPage}
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <TableView
                data={payments}
                keySelector={paymentKeySelector}
                emptyMessage="No payments available"
                columns={columns}
                filtered={false}
                errored={false}
                pending={paymentsLoading}
                emptyIcon={(
                    <IoBanOutline />
                )}
                messageShown
                messageIconShown
            />
            {updatePaymentModalShown && (
                <UpdatePaymentModal
                    onUpdateSuccess={handleUpdateSuccess}
                    paymentDetails={selectedPayment}
                    onModalClose={hideUpdatePaymentModal}
                />
            )}
        </Container>
    );
}

export default SchoolPayments;
