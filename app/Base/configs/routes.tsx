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
    navbarVisibility: false,
    component: lazy(() => import('#views/Register')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const login = wrap({
    path: '/login/',
    title: 'Login',
    navbarVisibility: false,
    component: lazy(() => import('#views/Login')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const home = wrap({
    path: '/',
    title: 'Home',
    navbarVisibility: true,
    component: lazy(() => import('#views/HomePage')),
    componentProps: {},
    visibility: 'is-anything',
});
const myProfile = wrap({
    path: '/my-profile/',
    title: 'My Profile',
    navbarVisibility: true,
    component: lazy(() => import('#views/Template')),
    componentProps: {
        name: 'My Profile Page',
    },
    visibility: 'is-authenticated',
});
const bookDetail = wrap({
    path: '/book/:id',
    title: 'My Book Detail',
    navbarVisibility: true,
    component: lazy(() => import('#views/BookDetail')),
    componentProps: {
        className: '',
    },
    visibility: 'is-not-authenticated',
});

const routes = {
    register,
    login,
    home,
    myProfile,
    bookDetail,
    fourHundredFour,
};
export default routes;
