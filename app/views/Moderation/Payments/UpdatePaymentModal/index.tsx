import React, { useMemo, useState, useCallback } from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    requiredCondition,
    defaultUndefinedType,
    greaterThanCondition,
    removeNull,
    internal,
    PurgeNull,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    NumberInput,
    RadioInput,
    useAlert,
} from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';

import {
    CreatePaymentMutation,
    CreatePaymentMutationVariables,
    UpdatePaymentMutation,
    UpdatePaymentMutationVariables,
    PaymentOptionsQuery,
    PaymentOptionsQueryVariables,
} from '#generated/types';
import UserSelectInput, { SearchUserType } from '#components/UserSelectInput';
import ErrorMessage from '#components/ErrorMessage';
import PaymentLogForm from './PaymentLogForm';
import NonFieldError from '#components/NonFieldError';
import { EnumFix, enumKeySelector, enumLabelSelector } from '#utils/types';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import { Payment } from '../index';
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

const CREATE_PAYMENT = gql`
mutation CreatePayment($data: PaymentInputType!) {
    moderatorMutation {
        createPayment(data: $data) {
            errors
            ok
            result {
                id
            }
        }
    }
}
`;

const UPDATE_PAYMENT = gql`
mutation UpdatePayment($data: PaymentUpdateInputType!, $id: ID!) {
    moderatorMutation {
        updatePayment(data: $data, id: $id) {
            errors
            ok
            result {
                id
                amount
                paidBy {
                    canonicalName
                    id
                }
                paymentType
                status
                transactionType
            }
        }
    }
}
`;
type FormType = PurgeNull<EnumFix<CreatePaymentMutationVariables['data'], 'status' | 'paymentType' | 'transactionType'>>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;
type PaymentLogType = NonNullable<FormType['paymentLog']>;
type PaymentLogSchema = ObjectSchema<PartialForm<PaymentLogType>, PartialFormType>;
type PaymentLogSchemaFields = ReturnType<PaymentLogSchema['fields']>;

const createPaymentSchema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            amount: [requiredCondition, greaterThanCondition(0)],
            paidBy: [requiredCondition],
            paymentLog: {
                fields: (): PaymentLogSchemaFields => ({
                    comment: [requiredCondition],
                    files: [defaultUndefinedType],
                }),
            },
            paymentType: [requiredCondition],
            status: [requiredCondition],
            transactionType: [requiredCondition],
        };
        return basicFields;
    },
};

const updatePaymentSchema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            amount: [requiredCondition, greaterThanCondition(0)],
            paymentLog: [defaultUndefinedType],
            status: [requiredCondition],
        };
        return basicFields;
    },
};

interface Props {
    onUpdateSuccess: () => void;
    paymentDetails: Payment | undefined | null;
    onModalClose: () => void;
}

function UpdatePaymentModal(props: Props) {
    const {
        onModalClose,
        onUpdateSuccess,
        paymentDetails,
    } = props;

    const [userOptions, setUserOptions] = useState<SearchUserType[] | undefined | null>(
        () => {
            if (paymentDetails?.paidBy) {
                return [{
                    id: paymentDetails.paidBy.id,
                    canonicalName: paymentDetails.paidBy.canonicalName,
                }];
            }
            return [];
        },
    );

    const initialValue: PartialFormType = useMemo(() => (paymentDetails ? {
        amount: paymentDetails.amount,
        status: paymentDetails.status,
    } : {
        paymentType: 'CASH',
        transactionType: 'CREDIT',
        status: 'PENDING',
    }), [paymentDetails]);

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(paymentDetails ? updatePaymentSchema : createPaymentSchema, initialValue);

    const alert = useAlert();
    const error = getErrorObject(riskyError);

    const {
        data: paymentFieldOptionsResponse,
        loading: paymentFieldOptionsLoading,
    } = useQuery<PaymentOptionsQuery, PaymentOptionsQueryVariables>(
        PAYMENT_OPTIONS,
    );

    const [
        createPayment,
        { loading: createPaymentPending },
    ] = useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(
        CREATE_PAYMENT,
        {
            onCompleted: (response) => {
                const { moderatorMutation } = response;
                if (!moderatorMutation?.createPayment) {
                    return;
                }

                const {
                    ok,
                    errors,
                } = moderatorMutation.createPayment;

                if (ok) {
                    onUpdateSuccess();
                    onModalClose();
                    alert.show(
                        'Payment added successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);

                    alert.show(
                        <ErrorMessage
                            header="Failed to add payment."
                            description={
                                isDefined(formErrorFromServer)
                                    ? formErrorFromServer[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header="Failed to add payment."
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const [
        updatePayment,
        { loading: updatePaymentPending },
    ] = useMutation<UpdatePaymentMutation, UpdatePaymentMutationVariables>(
        UPDATE_PAYMENT,
        {
            onCompleted: (response) => {
                const { moderatorMutation } = response;
                if (!moderatorMutation?.updatePayment) {
                    return;
                }

                const {
                    ok,
                    errors,
                } = moderatorMutation.updatePayment;

                if (ok) {
                    onUpdateSuccess();
                    onModalClose();
                    alert.show(
                        'Payment updated successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);

                    alert.show(
                        <ErrorMessage
                            header="Failed to update payment."
                            description={
                                isDefined(formErrorFromServer)
                                    ? formErrorFromServer[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header="Failed to update payment."
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = useCallback(() => {
        const submit = createSubmitHandler(
            validate,
            setError,
            (val) => {
                if (paymentDetails?.id) {
                    updatePayment({
                        variables: { data: val as UpdatePaymentMutationVariables['data'], id: paymentDetails.id },
                    });
                } else {
                    createPayment({
                        variables: { data: val as CreatePaymentMutationVariables['data'] },
                    });
                }
            },
        );
        submit();
    }, [createPayment, updatePayment, paymentDetails, setError, validate]);

    return (
        <Modal
            className={styles.updatePaymentModal}
            heading={paymentDetails ? 'Edit Payment' : 'Add Payment'}
            headingSize="small"
            onCloseButtonClick={onModalClose}
            size="small"
            freeHeight
            bodyClassName={styles.content}
            footerActions={(
                <>
                    <Button
                        name={undefined}
                        onClick={onModalClose}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={pristine || updatePaymentPending || createPaymentPending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <NumberInput
                name="amount"
                label="Amount"
                value={value?.amount}
                error={error?.amount}
                onChange={setFieldValue}
                disabled={updatePaymentPending}
            />
            { !paymentDetails && (
                <>
                    <UserSelectInput
                        name="paidBy"
                        label="Paid By"
                        onChange={setFieldValue}
                        value={value?.paidBy}
                        error={error?.paidBy}
                        options={userOptions}
                        onOptionsChange={setUserOptions}
                        disabled={updatePaymentPending}
                    />
                    <RadioInput
                        name="paymentType"
                        label="Payment Type"
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.paymentTypeOptions?.enumValues ?? []}
                        value={value?.paymentType}
                        error={error?.paymentType}
                        onChange={setFieldValue}
                        disabled={updatePaymentPending || paymentFieldOptionsLoading}
                    />
                    <RadioInput
                        name="transactionType"
                        label="Transaction Type"
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={paymentFieldOptionsResponse?.transactionTypeOptions
                            ?.enumValues ?? []}
                        value={value?.transactionType}
                        error={error?.transactionType}
                        onChange={setFieldValue}
                        disabled={updatePaymentPending || paymentFieldOptionsLoading}
                    />
                </>
            )}
            <PaymentLogForm
                name="paymentLog"
                value={value.paymentLog}
                onChange={setFieldValue}
                error={error?.paymentLog}
            />
            <RadioInput
                name="status"
                label="Status"
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                options={paymentFieldOptionsResponse?.statusOptions?.enumValues ?? []}
                value={value?.status}
                error={error?.status}
                onChange={setFieldValue}
                disabled={updatePaymentPending || paymentFieldOptionsLoading}
            />
        </Modal>
    );
}

export default UpdatePaymentModal;
