import {
    isDefined,
    _cs,
} from '@togglecorp/fujs';
import React, {
    useMemo,
    useState,
    useCallback,
} from 'react';
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
        previousData,
        data: paymentsQueryResponse = previousData,
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
            Payment,
            string,
            ActionsProps,
            TableHeaderCellProps
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
            columnWidth: 120,
        };

        return [
            createStringColumn<Payment, string>(
                'id',
                'ID',
                (item) => item.id,
                { columnWidth: 50 },
            ),
            createDateColumn<Payment, string>(
                'createdAt',
                'Added On',
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
                // FIXME: use canonicalName
                (item) => item.paidBy.fullName || 'Will be fixed by server',
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
            className={_cs(styles.schoolPayments, className)}
            heading="Payments"
            headingSize="small"
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
            headerDescriptionClassName={styles.filters}
            headerDescription={(
                <>
                    <SelectInput
                        className={styles.filterInput}
                        name="paymentType"
                        label="Payment Type"
                        placeholder="All"
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.paymentTypeOptions?.enumValues}
                        value={paymentTypeFilter}
                        onChange={setPaymentTypeFilter}
                        disabled={paymentsLoading || paymentFieldOptionsLoading}
                        variant="general"
                    />
                    <SelectInput
                        className={styles.filterInput}
                        name="transactionType"
                        label="Transaction Type"
                        placeholder="All"
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.transactionTypeOptions?.enumValues}
                        value={transactionTypeFilter}
                        onChange={setTransactionTypeFilter}
                        disabled={paymentsLoading || paymentFieldOptionsLoading}
                        variant="general"
                    />
                    <SelectInput
                        className={styles.filterInput}
                        name="status"
                        label="Status"
                        placeholder="All"
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.statusOptions?.enumValues}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        disabled={paymentsLoading || paymentFieldOptionsLoading}
                        variant="general"
                    />
                </>
            )}
        >
            <TableView
                className={styles.table}
                data={payments}
                keySelector={paymentKeySelector}
                emptyMessage="No payments available."
                columns={columns}
                filtered={filtered}
                errored={!!error}
                pending={paymentsLoading}
                erroredEmptyMessage="Failed to fetch payments."
                filteredEmptyMessage="No matching payments found."
                messageShown
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
