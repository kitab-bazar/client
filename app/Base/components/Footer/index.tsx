import React from 'react';
import {
    Button,
    Link,
} from '@the-deep/deep-ui';
import { _cs } from '@togglecorp/fujs';

import {
    footer,
    common,
} from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import KitabLogo from '#resources/img/KitabLogo.png';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Footer(props: Props) {
    const { className } = props;

    const footerStrings = useTranslation(footer);
    const commonStrings = useTranslation(common);

    const strings = {
        ...footerStrings,
        ...commonStrings,
    };

    return (
        <div className={_cs(styles.footer, className)}>
            <Link
                to="/"
                className={styles.appBrand}
                linkElementClassName={styles.link}
            >
                <img
                    className={styles.logo}
                    src={KitabLogo}
                    alt="logo"
                />
                <div className={styles.details}>
                    <div className={styles.appName}>
                        {strings.kitabBazarAppLabel}
                    </div>
                    <div className={styles.tagline}>
                        {strings.taglineLabel}
                    </div>
                </div>
            </Link>
            <div className={styles.actions}>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="action"
                >
                    {strings.faqButtonLabel}
                </Button>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="action"
                >
                    {strings.blogsButtonLabel}
                </Button>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="action"
                >
                    {strings.whyKitabBazarLabel}
                </Button>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="action"
                >
                    {strings.contactUsButtonLabel}
                </Button>
            </div>
        </div>
    );
}

export default Footer;
