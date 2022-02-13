import React from 'react';
import { Link } from '@the-deep/deep-ui';
import { _cs } from '@togglecorp/fujs';

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import routes from '#base/configs/routes';

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
                        {strings.tagLineLabel}
                    </div>
                </div>
            </Link>
            <div className={styles.actions}>
                <SmartButtonLikeLink
                    route={routes.about}
                    variant="action"
                >
                    {strings.faqButtonLabel}
                </SmartButtonLikeLink>
                <SmartButtonLikeLink
                    route={routes.about}
                    variant="action"
                >
                    {strings.blogsButtonLabel}
                </SmartButtonLikeLink>
                <SmartButtonLikeLink
                    route={routes.about}
                    variant="action"
                >
                    {strings.whyKitabBazarLabel}
                </SmartButtonLikeLink>
                <SmartButtonLikeLink
                    route={routes.about}
                    variant="action"
                >
                    {strings.contactUsButtonLabel}
                </SmartButtonLikeLink>
            </div>
        </div>
    );
}

export default Footer;
