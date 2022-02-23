import { createContext } from 'react';

export interface NavbarContextInterface {
    navbarVisibility: boolean;
    setNavbarVisibility: React.Dispatch<React.SetStateAction<boolean>>;

    reset: () => void;
}

export const NavbarContext = createContext<NavbarContextInterface>({
    navbarVisibility: false,
    setNavbarVisibility: (value: unknown) => {
        // eslint-disable-next-line no-console
        console.error('setNavbarVisibility called on NavbarContext without a provider', value);
    },
    reset: () => {
        // eslint-disable-next-line no-console
        console.error('reset called on NavbarContext without a provider');
    },
});

export default NavbarContext;
