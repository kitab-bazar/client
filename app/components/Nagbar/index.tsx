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
        user,
    } = useContext(UserContext);

    const nagbarItems = [];

    if (authenticated && !user?.isVerified) {
        nagbarItems.push(strings.userNotVerifiedLabel);
    }
    if (authenticated && !orderWindow) {
        nagbarItems.push(strings.orderWindowExpiryLabel);
    }

    if (nagbarItems.length <= 0) {
        return null;
    }

    return (
        <nav className={_cs(className, styles.nagbar)}>
            {
                nagbarItems.map((item) => (
                    <div
                        className={styles.nagbarItem}
                        key={item}
                    >
                        {item}
                    </div>
                ))
            }
        </nav>
    );
}

export default Nagbar;
