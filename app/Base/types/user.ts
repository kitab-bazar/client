import {
    UserPermissions,
    UserTypeEnum,
} from '#generated/types';

export interface User {
    id: string;
    displayName: string | undefined;
    displayPictureUrl: string | undefined;
    type: UserTypeEnum;
    permissions: UserPermissions[];

    publisherId: string | undefined;
}

export interface OrderWindow {
    id: string;
    startDate: string;
    endDate: string;
}
