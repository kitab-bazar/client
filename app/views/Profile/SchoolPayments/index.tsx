import React, {
    useMemo,
    useState,
    useCallback,
} from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    Container,
    Pager,
    SelectInput,
    ListView,
    ContainerCard,
    TextOutput,
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
import { enumKeySelector, enumLabelSelector } from '#utils/types';
import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import EmptyMessage from '#components/EmptyMessage';
import NumberOutput from '#components/NumberOutput';

import SchoolPaymentItem from './SchoolPaymentItem';
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
                totalUnverifieldPayment
                totalUnverifieldPaymentCount
                totalVerifieldPayment
                totalVerifieldPaymentCount
                results {
                    amount
                    createdAt
                    id
                    paymentTypeDisplay
                    status
                    statusDisplay
                    transactionTypeDisplay
                }
            }
        }
    }
`;

export type SchoolPayment = NonNullable<NonNullable<NonNullable<IndividualSchoolPaymentsQuery['schoolQuery']>['payments']>['results']>[number];

function schoolPaymentItemKeySelector(payment: SchoolPayment) {
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

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        status: statusFilter as IndividualSchoolPaymentsQueryVariables['status'],
        paymentType: paymentTypeFilter as IndividualSchoolPaymentsQueryVariables['paymentType'],
        transactionType: transactionTypeFilter as IndividualSchoolPaymentsQueryVariables['transactionType'],
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
    } = useQuery<IndividualSchoolPaymentsQuery, IndividualSchoolPaymentsQueryVariables>(
        INDIVIDUAL_SCHOOL_PAYMENTS,
        { variables },
    );

    const payments = paymentsQueryResponse?.schoolQuery?.payments?.results;

    const filtered = isDefined(paymentTypeFilter)
                  || isDefined(statusFilter)
                  || isDefined(transactionTypeFilter);

    const schoolPaymentItemRendererParams = React.useCallback(
        (_: string, payment: SchoolPayment) => ({
            payment,
        }),
        [],
    );
    return (
        <div className={styles.paymentsContainer}>
            <ContainerCard
                heading={strings.paymentsStatusHeading}
                headingSize="extraSmall"
                contentClassName={styles.paymentsStatus}
            >
                <TextOutput
                    spacing="compact"
                    block
                    valueContainerClassName={styles.value}
                    hideLabelColon
                    label={strings.totalVerifieldPaymentLabel}
                    value={(
                        <NumberOutput
                            value={paymentsQueryResponse
                                ?.schoolQuery?.payments?.totalVerifieldPayment}
                            currency
                        />
                    )}
                />
                <TextOutput
                    spacing="compact"
                    block
                    valueContainerClassName={styles.value}
                    label={strings.totalUnverifieldPaymentLabel}
                    hideLabelColon
                    value={(
                        <NumberOutput
                            value={paymentsQueryResponse
                                ?.schoolQuery?.payments?.totalUnverifieldPayment}
                            currency
                        />
                    )}
                />
                <TextOutput
                    spacing="compact"
                    block
                    valueContainerClassName={styles.value}
                    hideLabelColon
                    label={strings.totalVerifieldPaymentCountLabel}
                    value={paymentsQueryResponse
                        ?.schoolQuery?.payments?.totalVerifieldPaymentCount}
                />
                <TextOutput
                    spacing="compact"
                    block
                    valueContainerClassName={styles.value}
                    hideLabelColon
                    label={strings.totalUnverifieldPaymentCountLabel}
                    value={paymentsQueryResponse
                        ?.schoolQuery?.payments?.totalUnverifieldPaymentCount}
                />
            </ContainerCard>
            <Container
                className={_cs(styles.payments, className)}
                heading={strings.paymentsTabLabel}
                headingSize="small"
                footerActions={(
                    <Pager
                        className={styles.pager}
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
                            onChange={handleSetPaymentTypeFilter}
                            disabled={paymentFieldOptionsLoading}
                            variant="general"
                        />
                        <SelectInput
                            className={styles.filterInput}
                            name="transactionType"
                            label={strings.transactionTypeLabel}
                            placeholder={strings.all}
                            keySelector={enumKeySelector}
                            labelSelector={enumLabelSelector}
                            options={
                                paymentFieldOptionsResponse
                                    ?.transactionTypeOptions?.enumValues
                            }
                            value={transactionTypeFilter}
                            onChange={handleSetTransactionTypeFilter}
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
                            onChange={handleSetStatusFilter}
                            disabled={paymentFieldOptionsLoading}
                            variant="general"
                        />
                    </>
                )}
            >
                <ListView
                    className={styles.schoolPaymentList}
                    data={payments}
                    pending={paymentsLoading}
                    rendererParams={schoolPaymentItemRendererParams}
                    renderer={SchoolPaymentItem}
                    keySelector={schoolPaymentItemKeySelector}
                    errored={!!error}
                    filtered={filtered}
                    messageShown
                    erroredEmptyMessage={(
                        <EmptyMessage
                            message={strings.paymentsErroredMessage}
                            suggestion={strings.paymentsErroredSuggestion}
                        />
                    )}
                    filteredEmptyMessage={(
                        <EmptyMessage
                            message={strings.paymentsFilteredEmptyMessage}
                            suggestion={strings.paymentsFilteredEmptySuggestion}
                        />
                    )}
                    emptyMessage={(
                        <EmptyMessage
                            message={strings.noPaymentsMessage}
                            suggestion={strings.noPaymentsSuggestion}
                        />
                    )}
                />
            </Container>
        </div>
    );
}

export default SchoolPayments;
