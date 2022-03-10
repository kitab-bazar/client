import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Button,
    useModalState,
} from '@the-deep/deep-ui';

import { SchoolPackage } from '../index';
import UpdatePackageModal from './UpdatePackageModal';
import RelatedOrdersModal from './RelatedOrdersModal';
import RelatedBooksModal from './RelatedBooksModal';

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
    const [
        viewRelatedOrdersModalShown,
        showRelatedOrdersModal,
        hideRelatedOrdersModal,
    ] = useModalState(false);
    const [
        viewRelatedBooksModalShown,
        showRelatedBooksModal,
        hideRelatedBooksModal,
    ] = useModalState(false);

    return (
        <div className={_cs(className)}>
            <Button
                name={undefined}
                title="Edit package"
                onClick={showUpdatePackageModal}
                disabled={disabled}
                variant="tertiary"
            >
                Edit
            </Button>
            <Button
                name={undefined}
                title="View related orders"
                onClick={showRelatedOrdersModal}
                disabled={disabled}
                variant="tertiary"
            >
                Orders
            </Button>
            <Button
                name={undefined}
                title="View related books"
                onClick={showRelatedBooksModal}
                disabled={disabled}
                variant="tertiary"
            >
                Books
            </Button>
            {updatePackageModalShown && (
                <UpdatePackageModal
                    schoolPackage={data}
                    onModalClose={hideUpdatePackageModal}
                />
            )}
            {viewRelatedOrdersModalShown && (
                <RelatedOrdersModal
                    schoolPackage={data}
                    onModalClose={hideRelatedOrdersModal}
                />
            )}
            {viewRelatedBooksModalShown && (
                <RelatedBooksModal
                    schoolPackage={data}
                    onModalClose={hideRelatedBooksModal}
                />
            )}
        </div>
    );
}

export default Actions;
