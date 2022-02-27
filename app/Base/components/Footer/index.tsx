import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Link,
    LinkProps,
    Container,
    ListView,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import SmartLink from '#base/components/SmartLink';
import routes from '#base/configs/routes';
import {
    FooterGradeOptionsQuery,
    FooterGradeOptionsQueryVariables,
} from '#generated/types';

import {
    footer,
    common,
} from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import KitabLogo from '#resources/img/KitabLogo.png';

import styles from './styles.css';

const GRADE_OPTIONS = gql`
query FooterGradeOptions {
    categories {
        results {
            id
            name
        }
    }
    gradeList: __type(name: "BookGradeEnum") {
        enumValues {
            name
            description
        }
    }
    languageList: __type(name: "BookLanguageEnum") {
        enumValues {
            name
            description
        }
    }
}
`;

const enumKeySelector = (d: { name: string }) => d.name;
const itemKeySelector = (b: { id: string }) => b.id;

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

    const {
        data: gradeResponse,
        loading: gradeLoading,
        error: gradeError,
    } = useQuery<FooterGradeOptionsQuery, FooterGradeOptionsQueryVariables>(
        GRADE_OPTIONS,
    );

    const gradeItemRendererParams = React.useCallback((
        _: string,
        grade: NonNullable<NonNullable<FooterGradeOptionsQuery['gradeList']>['enumValues']>[number],
    ): LinkProps => ({
        className: styles.link,
        children: grade.description,
        to: {
            pathname: routes.bookList.path,
            state: { grade: grade.name },
        },
    }), []);

    const languageItemRendererParams = React.useCallback((
        _: string,
        language: NonNullable<NonNullable<FooterGradeOptionsQuery['languageList']>['enumValues']>[number],
    ): LinkProps => ({
        className: styles.link,
        children: language.description,
        to: {
            pathname: routes.bookList.path,
            state: { language: language.name },
        },
    }), []);

    const categoryItemRendererParams = React.useCallback((
        _: string,
        category: NonNullable<NonNullable<FooterGradeOptionsQuery['categories']>['results']>[number],
    ): LinkProps => ({
        className: styles.link,
        children: category.name,
        to: {
            pathname: routes.bookList.path,
            state: { category: category.id },
        },
    }), []);

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
                    <div>
                        {strings.tagLineLabel}
                    </div>
                </div>
            </Link>
            <div className={styles.explore}>
                <Container
                    heading={strings.exploreByGradeHeading}
                    headingSize="extraSmall"
                    spacing="loose"
                >
                    <ListView
                        className={styles.gradeList}
                        data={gradeResponse?.gradeList?.enumValues}
                        keySelector={enumKeySelector}
                        rendererParams={gradeItemRendererParams}
                        renderer={Link}
                        errored={!!gradeError}
                        pending={gradeLoading}
                        filtered={false}
                    />
                </Container>
                <Container
                    heading={strings.exploreByLanguageHeading}
                    headingSize="extraSmall"
                    spacing="loose"
                >
                    <ListView
                        className={styles.languageList}
                        data={gradeResponse?.languageList?.enumValues}
                        keySelector={enumKeySelector}
                        rendererParams={languageItemRendererParams}
                        renderer={Link}
                        errored={!!gradeError}
                        pending={gradeLoading}
                        filtered={false}
                    />
                </Container>
                <Container
                    heading={strings.exploreByCategoryHeading}
                    headingSize="extraSmall"
                    spacing="loose"
                >
                    <ListView
                        className={styles.categoryList}
                        data={gradeResponse?.categories?.results}
                        keySelector={itemKeySelector}
                        rendererParams={categoryItemRendererParams}
                        renderer={Link}
                        errored={!!gradeError}
                        pending={gradeLoading}
                        filtered={false}
                    />
                </Container>
            </div>
            <div className={styles.actions}>
                {/*
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
                */}
                <SmartLink
                    className={styles.aboutUsLink}
                    route={routes.about}
                >
                    {strings.aboutUsButtonLabel}
                </SmartLink>
            </div>
        </div>
    );
}

export default Footer;
