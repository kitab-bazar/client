import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Link,
    LinkProps,
    Container,
    ListView,
    Button,
    useModalState,
    Modal,
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
import WVLogo from '#resources/img/wv.jpg';
import TCLogo from '#resources/img/tc.png';

import {
    resolveToString,
    resolveToComponent,
} from '#base/utils/lang';
import NumberOutput from '#components/NumberOutput';

import styles from './styles.css';
import LanguageContext from '#base/context/LanguageContext';

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

const videoUrl = 'https://www.youtube.com/embed/0zgaCBVPors';
const userManualEn = 'https://docs.google.com/document/d/e/2PACX-1vSB2Vmfj54ROqwzKlgzY8IMKi_sGEg7s0PqTXth2bFIU2aQcnnt70hmwHSVm6so0r6msaDTBezuRhTj/pub';
const userManualNe = 'https://docs.google.com/document/d/e/2PACX-1vSFNuJiS4gaUF2FngC_odt9kawf_WkujSY_GZvWrbWEc2ToPI1m1zY3FGa7g_KPzYVCAesqlyxnqtpQ/pub';

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

    const [
        tutorialModalShown,
        showTutorialModal,
        hideTutorialModal,
    ] = useModalState(false);

    const [
        userManualModalShown,
        showUserManualModal,
        hideUserManualModal,
    ] = useModalState(false);

    const activeLanguage = useContext(LanguageContext);
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
            <div className={styles.footerTop}>
                <div className={styles.supportDetails}>
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
                    <Container
                        className={styles.contactUs}
                        heading={strings.contactUsLabel}
                        headingSize="extraSmall"
                        withoutExternalPadding
                        contentClassName={styles.contactContent}
                    >
                        <div>
                            {strings.contactUsDescription}
                        </div>
                        <a
                            className={styles.emailLink}
                            href="mailto:info@kitabbazar.org"
                        >
                            {resolveToString(
                                strings.sendUsEmailLabel,
                                { email: 'info@kitabbazar.org' },
                            )}
                        </a>
                        <a
                            className={styles.phoneLink}
                            href="tel:+977-9741673214"
                        >
                            {resolveToComponent(
                                strings.callUsLabel,
                                {
                                    phoneNumber: (
                                        <NumberOutput
                                            // NOTE: Currently set as TC's number
                                            value={9741673214}
                                            separatorHidden
                                        />
                                    ),
                                },
                            )}
                        </a>
                    </Container>
                </div>
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
                        route={routes.about}
                    >
                        {strings.aboutUsLabel}
                    </SmartLink>
                    <Button
                        name={undefined}
                        className={styles.videoModalButton}
                        onClick={showUserManualModal}
                        variant="transparent"
                        spacing="none"
                    >
                        {strings.userManualHeading}
                    </Button>
                    {userManualModalShown && (
                        <Modal
                            heading={strings.userManualLabel}
                            onCloseButtonClick={hideUserManualModal}
                            size="free"
                        >
                            <iframe
                                title={strings.userManualTitle}
                                src={activeLanguage.lang === 'ne'
                                    ? userManualNe
                                    : userManualEn}
                                allowFullScreen
                                width="1280"
                                height="720"
                            />
                        </Modal>
                    )}
                    <Button
                        name={undefined}
                        className={styles.videoModalButton}
                        onClick={showTutorialModal}
                        variant="transparent"
                        spacing="none"
                    >
                        {strings.tutorialModalHeading}
                    </Button>
                    <Link
                        to="https://blog.kitabbazar.org"
                    >
                        {strings.blogLabel}
                    </Link>
                    <SmartLink
                        route={routes.eBook}
                    >
                        {strings.eBookLabel}
                    </SmartLink>
                    {tutorialModalShown && (
                        <Modal
                            heading={strings.tutorialModalHeading}
                            onCloseButtonClick={hideTutorialModal}
                            size="free"
                        >
                            <iframe
                                title={strings.videoTitle}
                                src={videoUrl}
                                allowFullScreen
                                width="1280"
                                height="720"
                            />
                        </Modal>
                    )}
                </div>
            </div>
            <div className={styles.footerBottom}>
                <a
                    href="https://www.wvi.org/nepal/"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className={styles.details}>
                        {strings.supportedBy}
                    </div>
                    <img
                        className={styles.logo}
                        src={WVLogo}
                        alt="logo"
                    />
                </a>
                <a
                    href="https://www.togglecorp.com/"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className={styles.details}>
                        {strings.developedBy}
                    </div>
                    <img
                        className={styles.logo}
                        src={TCLogo}
                        alt="logo"
                    />
                </a>
            </div>
        </div>
    );
}

export default Footer;
