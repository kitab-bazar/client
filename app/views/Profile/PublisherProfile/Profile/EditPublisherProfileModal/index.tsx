import React from 'react';

import {
    Modal,
    Button,
} from '@the-deep/deep-ui';

interface Props {
    onModalClose: () => void;
}

function EditProfileModal(props: Props) {
    const {
        onModalClose,
    } = props;

    return (
        <Modal
            heading="Edit Profile"
            onCloseButtonClick={onModalClose}
            size="small"
            freeHeight
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
                    >
                        Save
                    </Button>
                </>
            )}
        />
    );
}

export default EditProfileModal;
