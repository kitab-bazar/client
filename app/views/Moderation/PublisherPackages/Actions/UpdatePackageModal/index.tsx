import React, { useCallback, useMemo } from 'react';
import {
    Modal,
    Button,
    RadioInput,
    useAlert,
    TextArea,
} from '@the-deep/deep-ui';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    getErrorObject,
    requiredCondition,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
    PublisherPackageOptionsQuery,
    PublisherPackageOptionsQueryVariables,
    PublisherPackageUpdateInputType,
    UpdatePublisherPackageMutation,
    UpdatePublisherPackageMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';
import ErrorMessage from '#components/ErrorMessage';
import { enumKeySelector, enumLabelSelector, EnumFix } from '#utils/types';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import { PublisherPackage } from '../../index';
import styles from './styles.css';

type FormType = EnumFix<UpdatePublisherPackageMutationVariables['data'], 'status'>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;
const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            status: [requiredCondition],
            comment: [],
        };
        return basicFields;
    },
};

const PUBLISHER_PACKAGE_OPTIONS = gql`
    query PublisherPackageOptions {
        publisherPackageStatusOptions: __type(name: "PublisherPackageStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

const UPDATE_PUBLISHER_PACKAGE = gql`
mutation UpdatePublisherPackage($data: PublisherPackageUpdateInputType!, $id: ID!) {
    moderatorMutation {
        updatePublisherPackage(data: $data, id: $id) {
            errors
            ok
            result {
                id
                status
                statusDisplay
                totalPrice
                totalQuantity
                packageId
                publisher {
                    id
                    name
                }
            }
        }
    }
}
`;

interface Props {
    publisherPackage: PublisherPackage;
    onModalClose: () => void;
}

function UpdatePackageModal(props: Props) {
    const {
        publisherPackage,
        onModalClose,
    } = props;

    const initialValue: PartialFormType = useMemo(() => (publisherPackage ? {
        status: publisherPackage.status,
    } : {}), [publisherPackage]);

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const alert = useAlert();
    const error = getErrorObject(riskyError);

    const {
        data: publisherPackageOptionsQuery,
        loading: publisherPackageOptionsQueryLoading,
    } = useQuery<PublisherPackageOptionsQuery, PublisherPackageOptionsQueryVariables>(
        PUBLISHER_PACKAGE_OPTIONS,
    );

    const [
        updatePackage,
        { loading: updatePackagePending },
    ] = useMutation<UpdatePublisherPackageMutation, UpdatePublisherPackageMutationVariables>(
        UPDATE_PUBLISHER_PACKAGE,
        {
            onCompleted: (response) => {
                const { moderatorMutation } = response;
                if (!moderatorMutation?.updatePublisherPackage) {
                    return;
                }
                const {
                    ok,
                    errors,
                } = moderatorMutation.updatePublisherPackage;
                if (ok) {
                    onModalClose();
                    alert.show(
                        'Package Update successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header="Failed to update package"
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
                updatePackage({
                    variables: {
                        data: val as PublisherPackageUpdateInputType,
                        id: publisherPackage.id,
                    },
                });
            },
        );
        submit();
    }, [setError, validate, updatePackage, publisherPackage.id]);

    return (
        <Modal
            className={styles.updatePackageModal}
            heading="Edit Package"
            headingSize="small"
            headingDescription={publisherPackage.packageId}
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
                        disabled={pristine || updatePackagePending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <TextArea
                name="comment"
                onChange={setFieldValue}
                label="Comment"
                value={value?.comment}
                error={error?.comment}
                disabled={updatePackagePending}
            />
            <RadioInput
                name="status"
                label="Status"
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                options={
                    publisherPackageOptionsQuery?.publisherPackageStatusOptions?.enumValues ?? []
                }
                value={value?.status}
                error={error?.status}
                onChange={setFieldValue}
                disabled={publisherPackageOptionsQueryLoading}
            />
        </Modal>
    );
}

export default UpdatePackageModal;
