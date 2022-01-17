export interface User {
    id: string;
    displayName?: string;
    displayPictureUrl?: string;
    type: 'ADMIN' | 'SCHOOL_ADMIN' | 'INSTITUTIONAL_USER' | 'PUBLISHER' | 'INDIVIDUAL_USER';
}
