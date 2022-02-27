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
                    canonicalName
                }
                paidBy {
                    canonicalName
                    id
                }
                paymentType
                status
                statusDisplay
                transactionType
                transactionTypeDisplay
            }
            totalCount
        }
    }
}
`;

export type Payment = NonNullable<NonNullable<NonNullable<PaymentsQuery['moderatorQuery']>['payments']>['results']>[number];

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
        status: statusFilter as PaymentOptionsQueryVariables['status'],
        paymentType: paymentTypeFilter as PaymentOptionsQueryVariables['paymentType'],
        transactionType: transactionTypeFilter as PaymentOptionsQueryVariables['transactionType'],
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
        error,
        refetch,
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

    const handleSetStatusFilter = useCallback((status: string | undefined) => {
        setActivePage(1);
        setStatusFilter(status);
    }, []);

    const handleSetPaymentTypeFilter = useCallback((paymentType: string | undefined) => {
        setActivePage(1);
        setPaymentTypeFilter(paymentType);
    }, []);

    const handleSetTransactionTypeFilter = useCallback((transactionType: string | undefined) => {
        setActivePage(1);
        setTransactionTypeFilter(transactionType);
    }, []);

    const handleUpdateSuccess = useCallback(() => {
        setSelectedPaymentId(undefined);
        // FIXME: only refetch on create (not on update)
        refetch();
    }, [refetch]);

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
                (item) => item.createdBy.canonicalName,
            ),
            createStringColumn<Payment, string>(
                'paidBy',
                'Paid By',
                (item) => item.paidBy.canonicalName,
            ),
            createStringColumn<Payment, string>(
                'status',
                'Status',
                (item) => item.statusDisplay,
            ),
            createStringColumn<Payment, string>(
                'paymentType',
                'Payment Type',
                (item) => item.paymentType,
            ),
            createStringColumn<Payment, string>(
                'trasactionType',
                'Type',
                (item) => item.transactionTypeDisplay,
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
                        onChange={handleSetPaymentTypeFilter}
                        disabled={paymentFieldOptionsLoading}
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
                        onChange={handleSetTransactionTypeFilter}
                        disabled={paymentFieldOptionsLoading}
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
                        onChange={handleSetStatusFilter}
                        disabled={paymentFieldOptionsLoading}
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
