import React, { useCallback } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    ListView,
} from '@the-deep/deep-ui';
import {
    InstitutionsELibararyQuery,
    InstitutionsELibararyQueryVariables,
} from '#generated/types';
import EmptyMessage from '#components/EmptyMessage';
import useTranslation from '#base/hooks/useTranslation';
import { ebook } from '#base/configs/lang';

import InstitutionItem from './InstitutionItem';
import styles from './styles.css';

const INSTITUTIONS_ELIBRARY = gql`
query InstitutionsELibarary {
    institutions {
        results {
            name
            libraryUrl
            logoUrl
            websiteUrl
            id
        }
    }
}
`;

export type Institution = NonNullable<NonNullable<InstitutionsELibararyQuery['institutions']>['results']>[number];

function institutionKeySelector(d: Institution) {
    return d.id;
}

interface Props {
    className?: string;
}

function Ebook(props: Props) {
    const { className } = props;
    const {
        previousData,
        data: institutionsResponse = previousData,
        loading: institutionsLoading,
        error: institutionsError,
    } = useQuery<InstitutionsELibararyQuery, InstitutionsELibararyQueryVariables>(
        INSTITUTIONS_ELIBRARY,
    );

    const strings = useTranslation(ebook);

    const institutionRendererParams = useCallback((_, institution: Institution) => ({
        institution,
    }), []);

    const institutionsWithElibrary = institutionsResponse?.institutions
        ?.results?.filter((i) => isDefined(i.libraryUrl));

    return (
        <div className={_cs(styles.ebook, className)}>
            <div className={styles.heading}>
                {strings.ebookTitle}
            </div>
            <ListView
                className={styles.institutionList}
                data={institutionsWithElibrary}
                pending={institutionsLoading}
                rendererParams={institutionRendererParams}
                renderer={InstitutionItem}
                keySelector={institutionKeySelector}
                errored={!!institutionsError}
                filtered={false}
                messageShown
                erroredEmptyMessage={(
                    <EmptyMessage
                        message={strings.ebooksErroredMessage}
                    />
                )}
                emptyMessage={(
                    <EmptyMessage
                        message={strings.noEbooksMessage}
                    />
                )}
            />
        </div>
    );
}

export default Ebook;
