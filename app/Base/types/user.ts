import {
    UserPermissions,
    UserUserType,
} from '#generated/types';

export interface User {
    id: string;
    displayName: string | undefined;
    displayPictureUrl: string | undefined;
    type: UserUserType;
    permissions: UserPermissions[];

    publisherId: string | undefined;
}
