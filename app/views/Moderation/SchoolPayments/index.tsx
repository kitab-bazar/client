import React, { useMemo, useState, useCallback } from 'react';
import { isDefined } from '@togglecorp/fujs';
import { IoBanOutline, IoSearchOutline, IoFilterSharp } from 'react-icons/io5';
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
    SelectInput,
    useModalState,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import {
    PaymentsQuery,
    PaymentsQueryVariables,
    PaymentOptionsQuery,
    PaymentOptionsQueryVariables,
} from '#generated/types';
import { enumKeySelector, enumLabelSelector } from '#utils/types';
import { createDateColumn } from '#components/tableHelpers';

import Actions, { Props as ActionsProps } from './Actions';
import UpdatePaymentModal from './UpdatePaymentModal';
import styles from './styles.css';

const PAYMENT_OPTIONS = gql`
    query PaymentOptions {
        statusOptions: __type(name: "StatusEnum") {
            enumValues {
                name
                description
            }
        }
        transactionTypeOptions: __type(name: "TransactionTypeEnum") {
            enumValues {
                name
                description
            }
        }
        paymentTypeOptions: __type(name: "PaymentTypeEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;
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
    const [statusFilter, setStatusFilter] = useState<string>();
    const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>();
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>();

    const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined | null>();

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        status: statusFilter as Payment['status'],
        paymentType: paymentTypeFilter as Payment['paymentType'],
        transactionType: transactionTypeFilter as Payment['transactionType'],
    }), [
        maxItemsPerPage,
        activePage,
        statusFilter,
        paymentTypeFilter,
        transactionTypeFilter,
    ]);

    const {
        data: paymentFieldOptionsResponse,
        loading: paymentFieldOptionsLoading,
    } = useQuery<PaymentOptionsQuery, PaymentOptionsQueryVariables>(
        PAYMENT_OPTIONS,
    );

    const {
        data: paymentsQueryResponse,
        loading: paymentsLoading,
        refetch: refetchPayments,
        error,
    } = useQuery<PaymentsQuery, PaymentsQueryVariables>(
        PAYMENTS,
        { variables },
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
                disabled: paymentsLoading,
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
    }, [handleEditPayment, paymentsLoading]);

    const selectedPayment = payments?.find((payment) => payment.id === selectedPaymentId);
    const filtered = isDefined(paymentTypeFilter)
                  || isDefined(statusFilter)
                  || isDefined(transactionTypeFilter);

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
            <div className={styles.filters}>
                <SelectInput
                    name="paymentType"
                    label="Payment Type"
                    keySelector={enumKeySelector}
                    labelSelector={enumLabelSelector}
                    options={paymentFieldOptionsResponse?.paymentTypeOptions?.enumValues}
                    value={paymentTypeFilter}
                    onChange={setPaymentTypeFilter}
                    disabled={paymentsLoading || paymentFieldOptionsLoading}
                />
                <SelectInput
                    name="transactionType"
                    label="Transaction Type"
                    keySelector={enumKeySelector}
                    labelSelector={enumLabelSelector}
                    options={paymentFieldOptionsResponse?.transactionTypeOptions?.enumValues}
                    value={transactionTypeFilter}
                    onChange={setTransactionTypeFilter}
                    disabled={paymentsLoading || paymentFieldOptionsLoading}
                />
                <SelectInput
                    name="status"
                    label="Status"
                    keySelector={enumKeySelector}
                    labelSelector={enumLabelSelector}
                    options={paymentFieldOptionsResponse?.statusOptions?.enumValues}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    disabled={paymentsLoading || paymentFieldOptionsLoading}
                />
            </div>
            <TableView
                data={payments}
                keySelector={paymentKeySelector}
                emptyMessage="No payments available."
                columns={columns}
                filtered={filtered}
                errored={!!error}
                pending={paymentsLoading}
                erroredEmptyIcon={<IoSearchOutline />}
                erroredEmptyMessage="Failed to fetch payments."
                filteredEmptyMessage="No matching payments found."
                filteredEmptyIcon={<IoFilterSharp />}
                emptyIcon={<IoBanOutline />}
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
