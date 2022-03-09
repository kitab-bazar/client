import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Button,
    useModalState,
} from '@the-deep/deep-ui';

import { SchoolPackage } from '../index';
import UpdatePackageModal from './UpdatePackageModal';

export interface Props {
    className?: string;
    data: SchoolPackage;
    disabled: boolean;
}

function Actions(props: Props) {
    const {
        className,
        data,
        disabled,
    } = props;

    const [
        updatePackageModalShown,
        showUpdatePackageModal,
        hideUpdatePackageModal,
    ] = useModalState(false);

    const handleEditClick = useCallback(() => {
        showUpdatePackageModal();
    }, [showUpdatePackageModal]);

    return (
        <div className={_cs(className)}>
            <Button
                name={undefined}
                title="Edit package"
                onClick={handleEditClick}
                disabled={disabled}
                variant="tertiary"
            >
                Edit
            </Button>
            {updatePackageModalShown && (
                <UpdatePackageModal
                    schoolPackage={data}
                    onModalClose={hideUpdatePackageModal}
                />
            )}
        </div>
    );
}

export default Actions;
