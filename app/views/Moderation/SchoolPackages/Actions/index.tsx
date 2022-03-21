import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Button,
    useModalState,
} from '@the-deep/deep-ui';

import RelatedOrdersModal from '#components/RelatedOrdersModal';

import { SchoolPackage } from '../index';
import UpdatePackageModal from './UpdatePackageModal';
import RelatedBooksModal from './RelatedBooksModal';
import styles from './styles.css';

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
                className={styles.button}
                name={undefined}
                title="Edit package"
                onClick={showUpdatePackageModal}
                disabled={disabled}
                variant="tertiary"
            >
                Edit
            </Button>
            <Button
                className={styles.button}
                name={undefined}
                title="View related orders"
                onClick={showRelatedOrdersModal}
                disabled={disabled}
                variant="tertiary"
            >
                Orders
            </Button>
            <Button
                className={styles.button}
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
                    packageItem={data}
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
