import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';

import useTranslation from '#base/hooks/useTranslation';
import { UserContext } from '#base/context/UserContext';
import { nagbar as nagbarStrings } from '#base/configs/lang';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Nagbar(props: Props) {
    const { className } = props;

    const strings = useTranslation(nagbarStrings);

    const {
        authenticated,
        orderWindow,
    } = useContext(UserContext);

    const nagbarContent = authenticated && !orderWindow
        ? strings.orderWindowExpiryLabel
        : undefined;

    if (!nagbarContent) {
        return null;
    }

    return (
        <nav className={_cs(className, styles.nagbar)}>
            {nagbarContent}
        </nav>
    );
}

export default Nagbar;
