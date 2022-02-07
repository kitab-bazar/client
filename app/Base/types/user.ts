import {
    UserPermissions,
    UserUserType,
} from '#generated/types';

export interface User {
    id: string;
    displayName?: string;
    displayPictureUrl?: string;
    type: UserUserType;
    permissions: UserPermissions[]
}
