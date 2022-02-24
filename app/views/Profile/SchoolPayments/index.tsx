import React, {
    useMemo,
    useState,
} from 'react';
import {
    _cs,
} from '@togglecorp/fujs';
import {
    Container,
    Pager,
    TableView,
    SelectInput,
    createStringColumn,
    createNumberColumn,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    IndividualSchoolPaymentsQuery,
    IndividualSchoolPaymentsQueryVariables,
    PaymentOptionsQuery,
    PaymentOptionsQueryVariables,
} from '#generated/types';
import { createDateColumn } from '#components/tableHelpers';
import { enumKeySelector, enumLabelSelector } from '#utils/types';
import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

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

const INDIVIDUAL_SCHOOL_PAYMENTS = gql`
    query IndividualSchoolPayments(
        $ordering: String,
        $page: Int,
        $pageSize: Int,
        $paymentType: PaymentTypeEnum,
        $status: StatusEnum,
        $transactionType: TransactionTypeEnum,
    ) {
        schoolQuery {
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
                totalCount
                results {
                    amount
                    createdAt
                    id
                    paymentTypeDisplay
                    statusDisplay
                    transactionTypeDisplay
                }
            }
        }
    }
`;

export type SchoolPayment = NonNullable<NonNullable<NonNullable<IndividualSchoolPaymentsQuery['schoolQuery']>['payments']>['results']>[number];

function paymentKeySelector(payment: SchoolPayment) {
    return payment.id;
}

interface Props {
    className?: string;
}

function SchoolPayments(props: Props) {
    const {
        className,
    } = props;
    const strings = useTranslation(profile);

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState<string>();
    const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>();
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>();

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
    }), [
        maxItemsPerPage,
        activePage,
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
    } = useQuery<IndividualSchoolPaymentsQuery, IndividualSchoolPaymentsQueryVariables>(
        INDIVIDUAL_SCHOOL_PAYMENTS,
        { variables },
    );

    const payments = paymentsQueryResponse?.schoolQuery?.payments?.results;

    const columns = useMemo(() => ([
        createStringColumn<SchoolPayment, string>(
            'id',
            strings.idLabel,
            (item) => item.id,
            { columnWidth: 50 },
        ),
        createDateColumn<SchoolPayment, string>(
            'createdAt',
            strings.addedOnLabel,
            (item) => item.createdAt,
        ),
        createNumberColumn<SchoolPayment, string>(
            'amount',
            strings.amountLabel,
            (item) => item.amount,
        ),
        createStringColumn<SchoolPayment, string>(
            'status',
            strings.status,
            (item) => item.statusDisplay,
        ),
        createStringColumn<SchoolPayment, string>(
            'paymentType',
            strings.paymentTypeLabel,
            (item) => item.paymentTypeDisplay,
        ),
        createStringColumn<SchoolPayment, string>(
            'trasactionType',
            strings.transactionType,
            (item) => item.transactionTypeDisplay,
        ),
    ]), [strings]);

    return (
        <Container
            className={_cs(styles.payments, className)}
            heading={strings.paymentsTabLabel}
            headingSize="small"
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={paymentsQueryResponse?.schoolQuery?.payments?.totalCount ?? 0}
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
                        label={strings.paymentTypeLabel}
                        placeholder={strings.all}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.paymentTypeOptions?.enumValues}
                        value={paymentTypeFilter}
                        onChange={setPaymentTypeFilter}
                        disabled={paymentFieldOptionsLoading}
                        variant="general"
                    />
                    <SelectInput
                        className={styles.filterInput}
                        name="transactionType"
                        label={strings.transactionType}
                        placeholder={strings.all}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.transactionTypeOptions?.enumValues}
                        value={transactionTypeFilter}
                        onChange={setTransactionTypeFilter}
                        disabled={paymentFieldOptionsLoading}
                        variant="general"
                    />
                    <SelectInput
                        className={styles.filterInput}
                        name="status"
                        label={strings.status}
                        placeholder={strings.all}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.statusOptions?.enumValues}
                        value={statusFilter}
                        onChange={setStatusFilter}
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
                emptyMessage={strings.noPaymentsMessage}
                columns={columns}
                filtered={false}
                errored={!!error}
                pending={paymentsLoading}
                erroredEmptyMessage={strings.paymentsErroredMessage}
                filteredEmptyMessage={strings.paymentsFilteredEmptyMessage}
                messageShown
            />
        </Container>
    );
}

export default SchoolPayments;
