import React, {
    useMemo,
    useState,
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
    IndividualInstitutionPaymentsQuery,
    IndividualInstitutionPaymentsQueryVariables,
    PaymentOptionsQuery,
    PaymentOptionsQueryVariables,
} from '#generated/types';
import { enumKeySelector, enumLabelSelector } from '#utils/types';
import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import EmptyMessage from '#components/EmptyMessage';
import NumberOutput from '#components/NumberOutput';
import useStateWithCallback from '#hooks/useStateWithCallback';

import PaymentItem from '#components/PaymentItem';
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

const INDIVIDUAL_INSTITUTION_PAYMENTS = gql`
    query IndividualInstitutionPayments(
        $ordering: String,
        $page: Int,
        $pageSize: Int,
        $paymentType: PaymentTypeEnum,
        $status: StatusEnum,
        $transactionType: TransactionTypeEnum,
    ) {
        institutionQuery {
            paymentSummary {
                outstandingBalance
                paymentCreditSum
                paymentDebitSum
            }
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
                    status
                    statusDisplay
                    transactionTypeDisplay
                }
            }
        }
    }
`;

export type InstitutionPayment = NonNullable<NonNullable<NonNullable<IndividualInstitutionPaymentsQuery['institutionQuery']>['payments']>['results']>[number];

function institutionPaymentItemKeySelector(payment: InstitutionPayment) {
    return payment.id;
}

interface Props {
    className?: string;
}

function InstitutionPayments(props: Props) {
    const {
        className,
    } = props;
    const strings = useTranslation(profile);

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useStateWithCallback(10, setActivePage);
    const [
        statusFilter,
        setStatusFilter,
    ] = useStateWithCallback<string | undefined>(undefined, setActivePage);
    const [
        paymentTypeFilter,
        setPaymentTypeFilter,
    ] = useStateWithCallback<string | undefined>(undefined, setActivePage);
    const [
        transactionTypeFilter,
        setTransactionTypeFilter,
    ] = useStateWithCallback<string | undefined>(undefined, setActivePage);

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        status: statusFilter as IndividualInstitutionPaymentsQueryVariables['status'],
        paymentType: paymentTypeFilter as IndividualInstitutionPaymentsQueryVariables['paymentType'],
        transactionType: transactionTypeFilter as IndividualInstitutionPaymentsQueryVariables['transactionType'],
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
    } = useQuery<IndividualInstitutionPaymentsQuery, IndividualInstitutionPaymentsQueryVariables>(
        INDIVIDUAL_INSTITUTION_PAYMENTS,
        { variables },
    );

    const payments = paymentsQueryResponse?.institutionQuery?.payments?.results;

    const filtered = isDefined(paymentTypeFilter)
        || isDefined(statusFilter)
        || isDefined(transactionTypeFilter);

    const institutionPaymentItemRendererParams = React.useCallback(
        (_: string, payment: InstitutionPayment) => ({
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
                    label={strings.outstandingBalanceLabel}
                    value={(
                        <NumberOutput
                            value={paymentsQueryResponse
                                ?.institutionQuery?.paymentSummary?.outstandingBalance ?? 0}
                            currency
                        />
                    )}
                />
                <TextOutput
                    spacing="compact"
                    block
                    valueContainerClassName={styles.value}
                    hideLabelColon
                    label={strings.totalCreditAmountLabel}
                    value={(
                        <NumberOutput
                            value={paymentsQueryResponse
                                ?.institutionQuery?.paymentSummary?.paymentCreditSum ?? 0}
                            currency
                        />
                    )}
                />
                <TextOutput
                    spacing="compact"
                    block
                    valueContainerClassName={styles.value}
                    label={strings.totalDebitAmountLabel}
                    hideLabelColon
                    value={(
                        <NumberOutput
                            value={paymentsQueryResponse
                                ?.institutionQuery?.paymentSummary?.paymentDebitSum ?? 0}
                            currency
                        />
                    )}
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
                        itemsCount={paymentsQueryResponse
                            ?.institutionQuery?.payments?.totalCount ?? 0}
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
                            label={strings.transactionTypeLabel}
                            placeholder={strings.all}
                            keySelector={enumKeySelector}
                            labelSelector={enumLabelSelector}
                            options={
                                paymentFieldOptionsResponse
                                    ?.transactionTypeOptions?.enumValues
                            }
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
                <ListView
                    className={styles.institutionPaymentList}
                    data={payments}
                    pending={paymentsLoading}
                    rendererParams={institutionPaymentItemRendererParams}
                    renderer={PaymentItem}
                    keySelector={institutionPaymentItemKeySelector}
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

export default InstitutionPayments;
