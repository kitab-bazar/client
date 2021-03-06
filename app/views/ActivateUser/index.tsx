import React from 'react';
import {
    useParams,
    useHistory,
} from 'react-router-dom';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    removeNull,
    internal,
} from '@togglecorp/toggle-form';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    PendingMessage,
    useAlert,
} from '@the-deep/deep-ui';

import { activateUser as activateUserLang } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import routes from '#base/configs/routes';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import {
    ActivateUserMutation,
    ActivateUserMutationVariables,
} from '#generated/types';
import ErrorMessage from '#components/ErrorMessage';
import KitabLogo from '#resources/img/KitabLogo.png';

import styles from './styles.css';

const ACTIVATE_USER = gql`
mutation ActivateUser($uid: String!, $token: String!) {
    activate(data: {uid: $uid, token: $token}) {
        errors
        ok
    }
}
`;

interface Props {
    className?: string;
}

function ActivateUser(props: Props) {
    const { className } = props;
    const strings = useTranslation(activateUserLang);
    const routeParams = useParams<{
        userId: string,
        token: string,
    }>() as { userId: string, token: string };

    const alert = useAlert();

    const history = useHistory();

    const [
        activateUser,
        {
            loading: activateUserLoading,
            error: mutationError,
        },
    ] = useMutation<ActivateUserMutation, ActivateUserMutationVariables>(
        ACTIVATE_USER,
        {
            onCompleted: (response) => {
                const { activate } = response;
                if (!activate) {
                    return;
                }

                const {
                    errors,
                    ok,
                } = activate;

                if (ok) {
                    alert.show(
                        strings.userActivationSuccessfulMessage,
                        { variant: 'success' },
                    );
                    history.replace(routes.login.path);
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    alert.show(
                        <ErrorMessage
                            header={strings.userActivationFailureMessage}
                            description={
                                isDefined(formError)
                                    ? formError[internal]
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
                        header={strings.userActivationFailureMessage}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    React.useEffect(() => {
        activateUser({
            variables: {
                uid: routeParams.userId,
                token: routeParams.token,
            },
        });
    }, [routeParams.token, routeParams.userId, activateUser]);

    return (
        <div className={_cs(styles.activateUser, className)}>
            <div className={styles.container}>
                <div className={styles.appBrand}>
                    <img
                        className={styles.kitabLogo}
                        src={KitabLogo}
                        alt=""
                    />
                    <div className={styles.appName}>
                        {strings.appLabel}
                    </div>
                </div>
                {activateUserLoading ? (
                    <div className={styles.loading}>
                        <PendingMessage
                            message={strings.userActivationMessage}
                        />
                    </div>
                ) : (
                    <>
                        {mutationError && (
                            <div className={styles.mutationError}>
                                {mutationError.message}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ActivateUser;
