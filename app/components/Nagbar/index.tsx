import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import { ListView, Link } from '@the-deep/deep-ui';
import { IoEllipse } from 'react-icons/io5';

import useTranslation from '#base/hooks/useTranslation';
import { UserContext } from '#base/context/UserContext';
import { nagbar as nagbarStrings } from '#base/configs/lang';
import { isStaging } from '#base/configs/env';
import { resolveToComponent } from '#base/utils/lang';

import styles from './styles.css';

interface NagbarItemProps {
    className?: string;
    item: string;
}

function NagbarItem(props: NagbarItemProps) {
    const {
        className,
        item,
    } = props;

    return (
        <div
            className={_cs(styles.nagbarItem, className)}
            key={item}
        >
            <IoEllipse className={styles.dot} />
            {item}
        </div>
    );
}

const itemKeySelector = (item: string) => item;
const itemRendererParams = (item: string) => ({
    item,
});

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

    if (authenticated && !user?.isVerified && user?.type !== 'MODERATOR') {
        nagbarItems.push(strings.userNotVerifiedLabel);
    }
    if (authenticated && !orderWindow && user?.type !== 'MODERATOR') {
        nagbarItems.push(strings.orderWindowExpiryLabel);
    }
    if (isStaging) {
        nagbarItems.push(resolveToComponent(
            strings.isStagingLabel,
            {
                link: (
                    <Link
                        to="https://www.kitabbazar.org/"
                        replace
                        target={undefined}
                        rel={undefined}
                    >
                        {strings.kitabBazarAppLabel}
                    </Link>
                ),
            },
        ));
    }

    if (nagbarItems.length <= 0) {
        return null;
    }

    return (
        <ListView
            className={_cs(className, styles.nagbar)}
            data={nagbarItems}
            rendererParams={itemRendererParams}
            keySelector={itemKeySelector}
            renderer={NagbarItem}
            filtered={false}
            errored={false}
            pending={false}
        />
    );
}

export default Nagbar;
