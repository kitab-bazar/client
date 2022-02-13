import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from '@the-deep/deep-ui';

import { GradeOptionsQuery } from '#generated/types';

import routes from '#base/configs/routes';

import styles from './styles.css';

const gradePreviewMap: {
    [key: string]: number;
} = {
    GRADE_ONE: 1,
    GRADE_TWO: 2,
    GRADE_THREE: 3,
};

export interface Props {
    className?: string;
    grade: NonNullable<NonNullable<GradeOptionsQuery['gradeList']>['enumValues']>[number];
}

function GradeItem(props: Props) {
    const {
        grade,
        className,
    } = props;

    return (
        <Link
            to={{
                pathname: routes.bookList.path,
                state: { grade: grade.name },
            }}
            className={_cs(styles.gradeItem, className)}
            linkElementClassName={styles.link}
        >
            <div className={styles.preview}>
                {gradePreviewMap[grade.name]}
            </div>
            <div className={styles.description}>
                {grade.description}
            </div>
        </Link>
    );
}

export default GradeItem;
