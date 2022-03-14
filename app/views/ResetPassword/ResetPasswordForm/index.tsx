import React, { useCallback, useState } from 'react';
import {
    useParams,
    useHistory,
} from 'react-router-dom';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
    internal,
    createSubmitHandler,
    getErrorObject,
    removeNull,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
} from '@togglecorp/toggle-form';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    PasswordInput,
    Container,
    Button,
    useAlert,
} from '@the-deep/deep-ui';

import { resetPassword as resetPasswordLang } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import routes from '#base/configs/routes';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import {
    ResetPasswordMutation,
    ResetPasswordMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';

import styles from './styles.css';

const RESET_PASSWORD = gql`
mutation ResetPassword($uid: String!, $token: String!, $newPassword: String!) {
    resetPassword(data: {passwordResetToken: $token, uid: $uid, newPassword: $newPassword}) {
        errors
        ok
    }
}
`;

type FormType = ResetPasswordMutationVariables;
type PartialFormType = PartialForm<FormType>;

type FormSchema = ObjectSchema<PartialFormType>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            newPassword: [
                requiredStringCondition,
                lengthGreaterThanCondition(4),
                lengthSmallerThanCondition(129),
            ],
        };
        return basicFields;
    },
};

const initialValue: PartialFormType = {};

interface Props {
    className?: string;
}

function ResetPasswordForm(props: Props) {
    const { className } = props;

    const strings = useTranslation(resetPasswordLang);
    const routeParams = useParams<{
        userId: string,
        token: string,
    }>() as { userId: string, token: string };

    const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);
    const alert = useAlert();

    const history = useHistory();
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const error = getErrorObject(riskyError);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.newPassword) {
            return undefined;
        }

        return strings.passwordConfirmationError;
    }, [strings.passwordConfirmationError, confirmPassword, value?.newPassword]);

    const [
        resetPassword,
        {
            loading: resetPasswordLoading,
        },
    ] = useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(
        RESET_PASSWORD,
        {
            onCompleted: (response) => {
                if (!response.resetPassword) {
                    return;
                }

                const {
                    errors,
                    ok,
                } = response.resetPassword;

                if (ok) {
                    alert.show(
                        strings.passwordUpdateSuccessfulMessage,
                        { variant: 'success' },
                    );
                    history.replace(routes.login.path);
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        <div>
                            <div>
                                {strings.passwordUpdateFailureMessage}
                            </div>
                            {isDefined(formError) && (
                                <div>
                                    {formError[internal]}
                                </div>
                            )}
                        </div>,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <div>
                        <div>
                            {strings.passwordUpdateFailureMessage}
                        </div>
                        <div>
                            {errors.message}
                        </div>
                    </div>,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        resetPassword({
            variables: {
                uid: routeParams.userId,
                token: routeParams.token,
                newPassword: finalValue.newPassword,
            } as FormType,
        });
    }, [resetPassword, routeParams.userId, routeParams.token]);

    return (
        <form
            className={_cs(styles.resetPasswordForm, className)}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <Container
                className={styles.resetPasswordFormContainer}
                heading={strings.resetPasswordHeaderLabel}
                headingSize="large"
                headingClassName={styles.heading}
                contentClassName={styles.inputContainer}
                spacing="loose"
                footerActions={(
                    <Button
                        className={styles.submitButton}
                        name="resetPassword"
                        type="submit"
                        variant="primary"
                        disabled={resetPasswordLoading || pristine}
                    >
                        {strings.resetPasswordButtonLabel}
                    </Button>
                )}
            >
                <NonFieldError error={error} />
                <PasswordInput
                    name="newPassword"
                    onChange={setFieldValue}
                    label={strings.newPasswordLabel}
                    value={value?.newPassword}
                    error={error?.newPassword}
                    disabled={resetPasswordLoading}
                />
                <PasswordInput
                    name={undefined}
                    label={strings.confirmPasswordInputLabel}
                    value={confirmPassword}
                    error={confirmationError}
                    onChange={setConfirmPassword}
                    disabled={resetPasswordLoading}
                />
            </Container>
        </form>
    );
}

export default ResetPasswordForm;
