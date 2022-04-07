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
    InstitutionPackageOptionsQuery,
    InstitutionPackageOptionsQueryVariables,
    InstitutionPackageUpdateInputType,
    UpdateInstitutionPackageMutation,
    UpdateInstitutionPackageMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';
import ErrorMessage from '#components/ErrorMessage';
import { enumKeySelector, enumLabelSelector, EnumFix } from '#utils/types';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import { InstitutionPackage } from '../../index';
import styles from './styles.css';

type FormType = EnumFix<UpdateInstitutionPackageMutationVariables['data'], 'status'>;
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

const INSTITUTION_PACKAGE_OPTIONS = gql`
    query InstitutionPackageOptions {
        institutionPackageStatusOptions: __type(name: "InstitutionPackageStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

const UPDATE_INSTITUTION_PACKAGE = gql`
mutation UpdateInstitutionPackage($data: InstitutionPackageUpdateInputType!, $id: ID!) {
    moderatorMutation {
        updateInstitutionPackage(data: $data, id: $id) {
            errors
            ok
            result {
                id
                status
                statusDisplay
                totalPrice
                totalQuantity
                packageId
                institution {
                    id
                    canonicalName
                }
            }
        }
    }
}
`;

interface Props {
    institutionPackage: InstitutionPackage;
    onModalClose: () => void;
}

function UpdatePackageModal(props: Props) {
    const {
        institutionPackage,
        onModalClose,
    } = props;

    const initialValue: PartialFormType = useMemo(() => (institutionPackage ? {
        status: institutionPackage.status,
    } : {}), [institutionPackage]);

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
        data: institutionPackageOptionsQuery,
        loading: institutionPackageOptionsQueryLoading,
    } = useQuery<InstitutionPackageOptionsQuery, InstitutionPackageOptionsQueryVariables>(
        INSTITUTION_PACKAGE_OPTIONS,
    );

    const [
        updatePackage,
        { loading: updatePackagePending },
    ] = useMutation<UpdateInstitutionPackageMutation, UpdateInstitutionPackageMutationVariables>(
        UPDATE_INSTITUTION_PACKAGE,
        {
            onCompleted: (response) => {
                const { moderatorMutation } = response;
                if (!moderatorMutation?.updateInstitutionPackage) {
                    return;
                }
                const {
                    ok,
                    errors,
                } = moderatorMutation.updateInstitutionPackage;
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
                        data: val as InstitutionPackageUpdateInputType,
                        id: institutionPackage.id,
                    },
                });
            },
        );
        submit();
    }, [setError, validate, updatePackage, institutionPackage.id]);

    return (
        <Modal
            className={styles.updatePackageModal}
            heading="Edit Package"
            headingSize="small"
            onCloseButtonClick={onModalClose}
            headingDescription={institutionPackage.packageId}
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
                options={institutionPackageOptionsQuery
                    ?.institutionPackageStatusOptions?.enumValues ?? []}
                value={value?.status}
                error={error?.status}
                onChange={setFieldValue}
                disabled={institutionPackageOptionsQueryLoading}
            />
        </Modal>
    );
}

export default UpdatePackageModal;
