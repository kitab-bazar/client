import { lazy } from 'react';

import { wrap } from '#base/utils/routes';

const fourHundredFour = wrap({
    path: '*',
    title: '404',
    component: lazy(() => import('#base/components/PreloadMessage')),
    componentProps: {
        heading: '404',
        content: 'What you are looking for does not exist.',
    },
    visibility: 'is-anything',
    navbarVisibility: true,
});
const register = wrap({
    path: '/register/',
    title: 'Register',
    navbarVisibility: true,
    component: lazy(() => import('#views/Register')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const login = wrap({
    path: '/login/',
    title: 'Login',
    navbarVisibility: true,
    component: lazy(() => import('#views/Login')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const forgotPassword = wrap({
    path: '/forgot-password/',
    title: 'Forgot Password',
    navbarVisibility: true,
    component: lazy(() => import('#views/ForgotPassword')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const activateUser = wrap({
    path: '/user/activate/:userId(\\d+)/:token/',
    title: 'Activate User',
    navbarVisibility: true,
    component: lazy(() => import('#views/ActivateUser')),
    componentProps: {
    },
    visibility: 'is-anything',
});

const home = wrap({
    path: '/',
    title: 'Home',
    navbarVisibility: true,
    component: lazy(() => import('#views/HomePage')),
    componentProps: {
    },
    visibility: 'is-anything',
});
const bookList = wrap({
    path: '/books/',
    title: 'Books',
    navbarVisibility: true,
    component: lazy(() => import('#views/BookList')),
    componentProps: {},
    visibility: 'is-anything',
});
const about = wrap({
    path: '/about/',
    title: 'About',
    navbarVisibility: true,
    component: lazy(() => import('#views/About')),
    componentProps: {
    },
    visibility: 'is-anything',
});

const myProfile = wrap({
    path: '/profile/',
    title: 'Profile',
    navbarVisibility: true,
    component: lazy(() => import('#views/Profile')),
    componentProps: {
    },
    visibility: 'is-authenticated',
    checkPermissions: (user) => user?.type === 'SCHOOL_ADMIN' || user?.type === 'PUBLISHER',
});
const wishList = wrap({
    path: '/wish-list/',
    title: 'Wish List',
    navbarVisibility: true,
    component: lazy(() => import('#views/BookList')),
    componentProps: {
        wishList: true,
    },
    visibility: 'is-authenticated',
    checkPermissions: (user) => user?.type === 'SCHOOL_ADMIN',
});
const moderation = wrap({
    path: '/moderation/',
    title: 'Moderation',
    navbarVisibility: true,
    component: lazy(() => import('#views/Moderation')),
    componentProps: {
    },
    visibility: 'is-authenticated',
    checkPermissions: (user) => user?.type === 'MODERATOR',
});

const routes = {
    register,
    login,
    home,
    myProfile,
    wishList,
    fourHundredFour,
    activateUser,
    bookList,
    about,
    forgotPassword,
    moderation,
};
export default routes;
