import { Lang } from '#base/context/LanguageContext';

export type LangString = Record<Lang, string>;
export type LangStringWithTemplate = LangString & {
    var: string[];
}

export interface LangStrings {
    [key: string]: LangString | LangStringWithTemplate;
}

export const common = {
    kitabBazarAppLabel: {
        en: 'Kitab Bazar',
        ne: 'किताब बजार',
    },
    logoutErrorMessage: {
        en: 'Error logging out',
        ne: 'लग आउटमा समस्या!',
    },
    logoutSuccessMessage: {
        en: 'Successfully logged out',
        ne: 'सफलतापूर्वक लग आउट भयो',
    },
    unathenticatedPageHeader: {
        en: 'Oh no!',
        ne: 'धत्तेरिका!',
    },
    unathenticatedPageContent: {
        en: 'The page does not exist or you do not have permissions to view this page.',
        ne: 'यो पृष्ठ उपलब्ध छैन वा तपाईंसँग यो पृष्ठ हेर्ने अनुमति छैन।',
    },
    dayLabel: {
        en: 'day(s)',
        ne: 'दिन',
    },
    hourLabel: {
        en: 'hour(s)',
        ne: 'घण्टा',
    },
    minuteLabel: {
        en: 'minute(s)',
        ne: 'मिनेट',
    },
    secondLabel: {
        en: 'second(s)',
        ne: 'सेकेन्ड',
    },
};

export const nagbar = {
    orderWindowExpiryLabel: {
        en: 'We are not taking new orders at the moment.',
        ne: 'हामी अहिले नयाँ अर्डर लिइरहेका छैनौं। ',
    },
    userNotVerifiedLabel: {
        en: 'Your account has not been verified yet. You will receive a call for verification soon.',
        ne: 'तपाईंको खाता अझै प्रमाणित गरिएको छैन। तपाईंले चाँडै प्रमाणीकरणको लागि कल प्राप्त गर्नुहुनेछ।',
    },
};

export const navbar = {
    searchAllBooksPlaceholder: {
        en: 'Search all books',
        ne: 'किताब खोज्नुहोस्',
    },
    signUpButtonLabel: {
        en: 'Register',
        ne: 'दर्ता',
    },
    loginButtonLabel: {
        en: 'Login',
        ne: 'लग इन',
    },
    greetings: {
        en: 'Hello {name}!',
        ne: 'नमस्कार {name}!',
    },
    gotoProfile: {
        en: 'Profile',
        ne: 'प्रोफाइलमा जानुहोस्',
    },
    logoutConfirmMessage: {
        en: 'Are you sure you want to logout?',
        ne: 'के तपाईं साँच्चै लग आउट गर्न चाहनुहुन्छ?',
    },
    logoutButtonLabel: {
        en: 'Logout',
        ne: 'लग आउट',
    },
    orderWindowMessage: {
        en: 'Please order books by {relativeTime}',
        ne: 'कृपया {relativeTime} भित्र किताबहरू अर्डर गर्नुहोस्',
    },
    homeLabel: {
        en: 'Home',
        ne: 'गृह पृष्ठ',
    },
    booksLabel: {
        en: 'Books',
        ne: 'किताबहरु ',
    },
    moderationLabel: {
        en: 'Moderation',
        ne: 'मध्यस्थता',
    },
};

export const login = {
    loginHeaderLabel: {
        en: 'Login',
        ne: 'लग इन',
    },
    emailLabel: {
        en: 'Email',
        ne: 'इमेल',
    },
    forgotPasswordLabel: {
        en: 'Forgot Password',
        ne: 'पास्स्वोर्ड  बिर्सिए',
    },
    passwordLabel: {
        en: 'Password',
        ne: 'पासवर्ड',
    },
    loginButtonLabel: {
        en: 'Login',
        ne: 'लग इन',
    },
    donotHaveAccountYetLabel: {
        en: 'Do not have an account yet?',
        ne: 'दर्ता भएको छैन?',
    },
    errorLoggingInLabel: {
        en: 'Error while logging in.',
        ne: 'लग इनमा समस्या',
    },
    registerlabel: {
        en: 'Register',
        ne: 'दर्ता  गर्नुहोस्',
    },
};

export const register = {
    registrationSuccessMessage: {
        en: 'Registration completed successfully! Please validate your account before logging in',
        ne: 'दर्ता सफलतापूर्वक सम्पन्न भयो! कृपया लग इन गर्नुअघि आफ्नो खाता प्रमाणित गर्नुहोस्',
    },
    registrationFailureMessage: {
        en: 'Error during registration!',
        ne: 'दर्ता प्रक्रियामा समस्या!',
    },
    passwordConfirmationError: {
        en: 'Password doesn\'t match',
        ne: 'पासवर्ड मेल खाँदैन',
    },
    pageHeading: {
        en: 'Register New User',
        ne: 'नयाँ प्रयोगकर्ता दर्ता गर्नुहोस्',
    },
    alreadyHaveAccountMessage: {
        en: 'Already have an account? {loginLink}',
        ne: 'पहिले नै खाता छ? {loginLink}',
    },
    loginLinkLabel: {
        en: 'Login',
        ne: 'लग इन',
    },
    emailInputLabel: {
        en: 'Email',
        ne: 'ईमेल',
    },
    passwordInputLabel: {
        en: 'Password',
        ne: 'पासवर्ड',
    },
    confirmPasswordInputLabel: {
        en: 'Confirm Password',
        ne: 'पासवर्ड सुनिश्चित गर्नुहोस्',
    },
    phoneNumberInputLabel: {
        en: 'Phone No.',
        ne: 'फोन नम्बर',
    },
    userTypeInputLabel: {
        en: 'User Type',
        ne: 'प्रयोगकर्ता प्रकार',
    },
    firstNameInputLabel: {
        en: 'First Name',
        ne: 'पहिलो नाम',
    },
    lastNameInputLabel: {
        en: 'Last Name',
        ne: 'थर',
    },
    registerButtonLabel: {
        en: 'Register',
        ne: 'दर्ता',
    },
    institutionNameInputLabel: {
        en: 'Name of the Institution',
        ne: 'संस्थाको नाम',
    },
    publisherNameInputLabel: {
        en: 'Name of the Publisher',
        ne: 'प्रकाशकको नाम',
    },
    schoolNameInputLabel: {
        en: 'Name of the School',
        ne: 'विद्यालयको नाम',
    },
    municipalityInputLabel: {
        en: 'Municipality',
        ne: 'नगरपालिका',
    },
    wardNumberInputLabel: {
        en: 'Ward Number',
        ne: 'वडा नम्बर',
    },
    localAddressInputLabel: {
        en: 'Local Address',
        ne: 'स्थानीय ठेगाना',
    },
    panInputLabel: {
        en: 'PAN',
        ne: 'प्यान',
    },
    schoolIdLabel: {
        en: 'School ID',
        ne: 'विद्यालयको आईडी',
    },
    vatNumberInputLabel: {
        en: 'VAT Number',
        ne: 'भ्याट नम्बर',
    },
};

export const homePage = {
    kitabLabel: {
        en: 'Kitab',
        ne: 'किताब',
    },
    bazarLabel: {
        en: 'Bazar',
        ne: 'बजार',
    },
    tagLineLabel: {
        en: 'Where reading gets better!',
        ne: 'किताबको पहुँचबाट शिक्षाको बिकास।',
    },
    exploreButtonLabel: {
        en: 'Explore the Platfrom',
        ne: 'प्लेटफर्म अन्वेषण गर्नुहोस्',
    },
    featuredBooksLabel: {
        en: 'Featured Books',
        ne: 'मुख्य आकर्षण',
    },
    exploreByGradeHeading: {
        en: 'Explore by Grade',
        ne: 'कक्षा द्वारा अन्वेषण',
    },
    exploreByCategoryHeading: {
        en: 'Explore by Category',
        ne: 'कक्षा द्वारा अन्वेषण',
    },
    exploreByPublisherHeading: {
        en: 'Explore by Publisher',
        ne: 'प्रकाशक द्वारा अन्वेषण',
    },
    pendingGradeListMessage: {
        en: 'Loading grades ...',
        ne: 'कक्षाहरु लोड गर्दै',
    },
    emptyGradeListMessage: {
        en: 'No grades found.',
        ne: 'कुनै कक्षा फेला परेन',
    },
    emptyCategoriesMessage: {
        en: 'No categories found',
        ne: 'कुनै कक्षाहरु भेटिएन ',
    },
    pendingCategoriesMessage: {
        en: 'Loading categories ...',
        ne: 'कक्षाहरु लोड गर्दै ...',
    },
    emptyPublishersMessage: {
        en: 'No publishers found',
        ne: 'कुनै प्रकाशक भेटिएन',
    },
    pendingPublishersMessage: {
        en: 'Loading publishers ...',
        ne: 'प्रकाशकहरू लोड गर्दै...',
    },
    emptyBooksMessage: {
        en: 'No books found',
        ne: 'कुनै किताब भेटिएन ',
    },
    pendingBooksMessage: {
        en: 'Loading books ...',
        ne: 'किताबहरु लोड गर्दै  ...',
    },
    gotoTopTitle: {
        en: 'Go to Top',
        ne: 'शीर्षमा जानुहोस्',
    },
};

export const about = {
    backgroundLabel: {
        en: 'Background',
        ne: 'पृष्ठभूमि',
    },
    platformBackground: {
        en: 'The School Sector Development Plan (SSDP), of the Government of Nepal (GoN), has focused on delivering quality education in schools that includes improving the foundational reading skills of the students. National Early Grade Reading Programme (NEGRP) is a core component of the SSDP, to improve the reading skills of students in the early grades. The SSDP has made the establishment of book corners necessary in order to ensure that appropriate and relevant books are available in classrooms for grades 1 to 3. However, the establishment of book corners was constrained by many demand and supply-side challenges. To accelerate the progress towards the PMEC standards, KITAB Bazar focuses on the 5th priority of PMEC, which is the book/learning corner in all classrooms. Therefore, The Project, KITAB was designed to address these challenges and create sustainable access to quality Supplementary Reading Materials (SRM) to help achieve literacy outcomes.',
        ne: 'नेपाल सरकारको विद्यालय क्षेत्र विकास योजना (SSDP) ले विद्यार्थीहरूको आधारभूत पठन सीपमा सुधार लगायत विद्यालयहरूमा गुणस्तरीय शिक्षा प्रदान गर्नमा केन्द्रित छ। राष्ट्रिय प्रारम्भिक पठन कार्यक्रम (NEGRP) प्रारम्भिक कक्षाहरूमा विद्यार्थीहरूको पढ्ने सीप सुधार गर्नको निम्ति विद्यालय क्षेत्र विकास योजना (SSDP) को मुख्य भाग हो। कक्षा १ देखि ३ सम्मका लागि उपयुक्त र सान्दर्भिक किताबहरू कक्षाकोठामा उपलब्ध छन् भनी सुनिश्चित गर्न SSDP ले बुक कर्नरहरू स्थापना गर्न आवश्यक बनाएको छ। यद्यपि, धेरै माग र आपूर्ति पक्षका चुनौतीहरूले बुक कर्नर स्थापना गर्न सहज थिएन । PMEC मापदण्डहरूमा प्रगतिलाई गति दिन, किताब बजार PMEC को ५ औं प्राथमिकतामा केन्द्रित छ, जुन सबै कक्षाकोठाहरूमा किताब/शिक्षा कर्नर हो। तसर्थ, किताब परियोजना यी चुनौतीहरूलाई सम्बोधन गर्दै साक्षरता परिणाम प्राप्तिका लागि गुणस्तरीय पूरक पठन सामग्री (SRM) मा दिगो पहुँच सिर्जना गर्न डिजाइन गरिएको थियो।',
    },
    whoAreWeLabel: {
        en: 'Who are we?',
        ne: 'हामी को हौं?',
    },
    whoAreWeDescription: {
        en: 'We are an online digital platform with the aim of improving access to quality supplementary reading materials in schools, in order to maintain their book corners. Collaborating with various publishing firms, we have streamlined the process of selecting, ordering, and purchasing books for children. We\'ve also included information on how book corners are implemented in schools and how they are beneficial for the children. If there is any interest in adopting what has been created so far, we will provide further information and answer any concerns about the project.',
        ne: 'विद्यालयहरूमा गुणस्तरीय पूरक पठन सामग्रीको पहुँच सुधार गर्ने उद्देश्यका साथ बुक कर्नरको अभ्यास बनाउन केन्द्रित अनलाइन डिजिटल प्लेटफर्म हो किताब बजार । विभिन्न प्रकाशनहरूसँग सहकार्य गर्दै, हामीले बालबालिकाका लागि किताबहरू छनोट, अर्डर र खरिद गर्ने प्रक्रियालाई सुव्यवस्थित गरेका छौं। हामीले विद्यालयहरूमा बुक कर्नर कसरी लागू गरिन्छ र यो बालबालिकाहरूको लागि कसरी लाभदायक छन् भन्ने जानकारी पनि समावेश गरेका छौं। हाम्रो यस अभियानमा सम्मिलित हुन चाहने वा अहिलेसम्म भएका कामहरूबारे जानकारी आवश्यक परेमा , हामी यस परियोजना बारेमा सम्पूर्ण जानकारी दिनेछौँ ।',
    },
    goalsLabel: {
        en: 'Our Goals',
        ne: 'हाम्रा लक्ष्यहरू',
    },
    firstGoalDescription: {
        en: 'To strengthen the evidence-base for the impact that Results Based Financing (RBF) can have on the education system in Nepal by ensuring that children have access to quality supplementary reading materials at their schools.',
        ne: 'नतिजामा आधारित रिजल्ट बेस्ड फाइनान्सिङ (RBF) ले नेपालको शिक्षा प्रणालीमा पार्न सक्ने प्रभावका लागि प्रमाण-आधारलाई बलियो बनाउन बालबालिकाहरूलाई विद्यालयमा गुणस्तरीय पूरक पठन सामग्रीको पहुँच सुनिश्चित गर्न।',
    },
    secondGoalDescription: {
        en: 'To use the evidence to inform the national education debate, policy, and practice and to expand global understanding of the use of results-based financing to address supply chain issues.',
        ne: 'राष्ट्रिय शिक्षा बहस, नीति, र अभ्यासलाई सूचित गर्न प्रमाणहरू प्रयोग गर्न र आपूर्ति श्रृंखला मुद्दाहरूलाई सम्बोधन गर्न नतिजामा आधारित रिजल्ट बेस्ड फाइनान्सिङको प्रयोगको विश्वव्यापी रूपमा विस्तार गर्न।',
    },
    accessToReadingMaterialText: {
        en: 'Children have access to sufficient supplementary reading materials in schools',
        ne: 'बालबालिकालाई विद्यालयमा पर्याप्त पूरक पठन सामग्रीको पहुँच गराउन',
    },
    bookCornerIncentiveText: {
        en: 'Incentivizing schools to invest in establishment, maintenance and utilization of book corners',
        ne: 'बुक कर्नरको स्थापना, मर्मत र उपयोगमा लगानी गर्न विद्यालयहरूलाई प्रोत्साहन गर्न',
    },
    relationshipEnhacementText: {
        en: 'Enhancing relationship between publishers and Curriculum Development Center (CDC)',
        ne: 'प्रकाशक र पाठ्यक्रम विकास केन्द्र (CDC) बीचको सम्बन्ध सुधार गर्न',
    },
    supplyChainText: {
        en: 'Strengthening supply chain mechanism for grade-appropriate supplementary reading materials to rural community schools',
        ne: 'ग्रामीण सामुदायिक विद्यालयहरूमा कक्षा-उपयुक्त पूरक पठन सामग्रीहरूको लागि आपूर्ति श्रृंखला संयन्त्रलाई सुदृढ गर्न',
    },
};

export const explore = {
    sortOptionsTitleAsc: {
        en: 'Title (A-Z)',
        ne: 'शीर्षक (क-ज्ञ)',
    },
    sortOptionsTitleDsc: {
        en: 'Title (A-Z)',
        ne: 'शीर्षक (ज्ञ-क)',
    },
    sortOptionsDateAsc: {
        en: 'Date added (Older first)',
        ne: 'थपिएको मिति (पहिलो पुरानो)',
    },
    sortOptionsDateDsc: {
        en: 'Date added (Newer first)',
        ne: 'थपिएको मिति (नयाँ पहिले)',
    },
    pageTitlePublisher: {
        en: 'Books',
        ne: 'किताबहरू',
    },
    pageTitleExploreByCategory: {
        en: 'Explore Books by Category',
        ne: 'वर्ग अनुसार किताबहरू हेर्नुहोस्',
    },
    pageTitleWishList: {
        en: 'Wish List',
        ne: 'इच्छा-सूची',
    },
    pageTitleDefault: {
        en: 'Explore Books',
        ne: 'किताबहरू हेर्नुहोस्',
    },
    searchInputPlaceholder: {
        en: 'Search by title (3 or more characters)',
        ne: 'किताबको शीर्षकले खोज्नुहोस् (३ वा बढी वर्णहरू)',
    },
    filterBooksHeading: {
        en: 'Filter books',
        ne: 'किताबहरू फिल्टर गर्नुहोस्',
    },
    categoriesFilterLabel: {
        en: 'Categories',
        ne: 'वर्ग',
    },
    gradeFilterLabel: {
        en: 'Grade',
        ne: 'कक्षा',
    },
    clearGradeFilterButtonLabel: {
        en: 'Clear grade filter',
        ne: 'कक्षा फिल्टर खाली गर्नुहोस्',
    },
    languageFilterLabel: {
        en: 'Language',
        ne: 'भाषा',
    },
    clearLanguageFilterButtonLabel: {
        en: 'Clear language filter',
        ne: 'भाषा फिल्टर खाली गर्नुहोस्',
    },
    clearCategoriesFilterButtonLabel: {
        en: 'Clear categories filter',
        ne: 'वर्ग फिल्टर खाली गर्नुहोस्',
    },
    publisherFilterLabel: {
        en: 'Publisher',
        ne: 'प्रकाशक',
    },
    clearPublisherFilterButtonLabel: {
        en: 'Clear publisher filter',
        ne: 'प्रकाशक फिल्टर खाली गर्नुहोस्',
    },
    booksFoundLabel: {
        en: '{count} book(s) found',
        ne: '{count} किताब(हरू) भेटियो',
    },
    activeSortLabel: {
        en: 'Order by: {sortLabel}',
        ne: '{sortLabel} ले अर्डर गर्नुहोस्:',
    },
    addBookButtonLabel: {
        en: 'Add New Book',
        ne: 'नयाँ किताब थप्नुहोस्',
    },
    publisherAllBooksLabel: {
        en: 'All Books',
        ne: 'सबै किताबहरू',
    },
    publisherOwnBooksLabel: {
        en: 'My Books',
        ne: 'मेरा किताबहरू',
    },
    bookListEmptyMessage: {
        en: 'No books found',
        ne: 'कुनै किताब भेटिएन',
    },
    filteredBookListEmptyMessage: {
        en: 'No books match your filter criteria',
        ne: 'कुनै पनि किताब तपाईंको फिल्टर मापदण्डसँग मेल खाँदैन',
    },
    pendingBookListMessage: {
        en: 'Loading books ...',
        ne: 'किताबहरू लोड गर्दै...',
    },
    gotoFirstPageTitle: {
        en: 'Back to first page',
        ne: 'पहिलो पृष्ठमा फर्कनुहोस्',
    },
};

export const footer = {
    tagLineLabel: {
        en: 'Where reading gets better!',
        ne: 'किताबको पहुँचबाट शिक्षाको बिकास।',
    },
    faqButtonLabel: {
        en: 'FAQs',
        ne: 'बारम्बार सोधिने प्रश्नहरू',
    },
    blogsButtonLabel: {
        en: 'Blogs',
        ne: 'ब्लगहरु',
    },
    whyKitabBazarLabel: {
        en: 'Why Kitab Bazar?',
        ne: 'किन किताब बजार?',
    },
    contactUsButtonLabel: {
        en: 'Contact Us',
        ne: 'सम्पर्क गर्नुहोस',
    },
    aboutUsLabel: {
        en: 'About Us',
        ne: 'हाम्रोबारे',
    },
    blogLabel: {
        en: 'Blog',
        ne: 'Blog',
    },
    exploreByGradeHeading: {
        en: 'Grade',
        ne: 'कक्षा',
    },
    exploreByLanguageHeading: {
        en: 'Language',
        ne: 'भाषा',
    },
    exploreByCategoryHeading: {
        en: 'Category',
        ne: 'वर्ग',
    },
    contactUsLabel: {
        en: 'Contact Us',
        ne: 'हामीलाई सम्पर्क गर्नुहोस',
    },
    contactUsDescription: {
        en: 'Have feedback about Kitab Bazar or want to know more about us?',
        ne: 'किताब बजार बारे प्रतिक्रिया छ वा हाम्रो बारेमा थप जान्न चाहनुहुन्छ?',
    },
    callUsLabel: {
        en: 'Call: {phoneNumber}',
        ne: 'फोन: {phoneNumber}',
    },
    sendUsEmailLabel: {
        en: 'Send us an email at {email}',
        ne: 'हामीलाई {email} मा इमेल पठाउनुहोस्',
    },
};

export const notifications = {
    newOrderReceived: {
        en: 'You have just received a new {orderLink}',
        ne: 'तपाईंले भर्खरै एउटा {orderLink} प्राप्त गर्नुभएको छ',
    },
    orderCancelled: {
        en: 'Your {orderLink} has been cancelled.',
        ne: 'तपाईंको {orderLink} रद्द गरिएको छ।',
    },
    orderPacked: {
        en: 'Your {orderLink} has been packed.',
        ne: 'तपाईंको {orderLink} प्याक गरिएको छ।',
    },
    orderCompleted: {
        en: 'Your {orderLink} has been packed.',
        ne: 'तपाईंको {orderLink} पूरा भएको छ।',
    },
    emptyNotificationMessage: {
        en: 'You\'re all caught up.',
        ne: 'अहिले कुनै सूचनाहरू छैनन्',
    },
    pendingNotificationMessage: {
        en: 'Loading notifications ...',
        ne: 'सूचनाहरू लोड गर्दै ...',
    },
    notificationStatusUpdateSuccessMessage: {
        en: 'Successfully updated notification status to {newStatus}',
        ne: 'सूचना स्थिति सफलतापूर्वक {newStatus}मा अपडेट गरियो',
    },
    notificationStatusUpdateFaillureMessage: {
        en: 'Failed to update notification status',
        ne: 'सूचना स्थिति अपडेट गर्न असफल',
    },
};

export const profile = {
    aboutTabLabel: {
        en: 'Details',
        ne: 'विवरण',
    },
    ordersTabLabel: {
        en: 'Orders',
        ne: 'अर्डरहरु',
    },
    packagesTabLabel: {
        en: 'Packages',
        ne: 'प्याकेजहरू',
    },
    paymentsTabLabel: {
        en: 'Payments',
        ne: 'भुक्तानीहरू',
    },
    schoolNameLabel: {
        en: 'School Name',
        ne: 'विद्यालयको नाम',
    },
    publisherNameLabel: {
        en: 'Publisher Name',
        ne: 'प्रकाशकको नाम  ',
    },
    emailLabel: {
        en: 'Email',
        ne: 'इमेल',
    },
    phoneNumberLabel: {
        en: 'Phone Number',
        ne: 'फोन नम्बर',
    },
    addressLabel: {
        en: 'Address',
        ne: 'ठेगाना',
    },
    vatNumberLabel: {
        en: 'VAT No.',
        ne: 'भ्याट नम्बर',
    },
    panLabel: {
        en: 'PAN No.',
        ne: 'प्यान नं',
    },
    schoolIdLabel: {
        en: 'School ID',
        ne: 'विद्यालयको आईडी',
    },
    profileLoadFailureMessage: {
        en: 'Failed to load profile',
        ne: 'प्रोफाइल लोड गर्न असफल',
    },
    pendingOrderListMessage: {
        en: 'Loading orders ...',
        ne: 'अर्डरहरु लोड गर्दै ',
    },
    emptyOrderListMessage: {
        en: 'No orders found.',
        ne: 'कुनै अर्डर भेटिएन ',
    },
    emptyBookListMessage: {
        en: 'No books found',
        ne: 'कुनै किताब भेटिएन ',
    },
    pendingBookListMessage: {
        en: 'Loading books ...',
        ne: 'किताबहरु लोड गर्दै ...',
    },
    totalAmountLabel: {
        en: 'Total Amount',
        ne: 'कुल रकम',
    },
    totalBooksLabel: {
        en: 'Total Books',
        ne: 'कुल किताबहरू',
    },
    uniqueBooksLabel: {
        en: 'Number of distinct books',
        ne: 'फरक किताबहरूको संख्या',
    },
    addedOnLabel: {
        en: 'Added On',
        ne: 'मितिमा थपियो',
    },
    amountLabel: {
        en: 'Amount',
        ne: 'रकम',
    },
    paymentTypeLabel: {
        en: 'Payment Type',
        ne: 'भुक्तानी प्रकार',
    },
    all: {
        en: 'All',
        ne: 'सबै',
    },
    idLabel: {
        en: 'ID',
        ne: 'क्र.सं',
    },
    transactionTypeLabel: {
        en: 'Transaction Type',
        ne: 'लेनदेन प्रकार',
    },
    status: {
        en: 'Status',
        ne: 'स्थिति',
    },
    noPaymentsMessage: {
        en: 'No payments available.',
        ne: 'कुनै भुक्तानी उपलब्ध छैन।',
    },
    noPaymentsSuggestion: {
        en: 'Your payments will be visible here.',
        ne: 'तपाईंको भुक्तानीहरू यहाँ देखिने छन्।',
    },
    paymentsErroredMessage: {
        en: 'Failed to fetch payments.',
        ne: 'भुक्तानीहरू प्राप्त गर्न असफल भयो।',
    },
    paymentsErroredSuggestion: {
        en: 'Please refresh the page or contact administrator.',
        ne: 'कृपया पृष्ठ रिफ्रेस गर्नुहोस् वा प्रशासकलाई सम्पर्क गर्नुहोस्।',
    },
    paymentsFilteredEmptyMessage: {
        en: 'No matching payments found.',
        ne: 'कुनै मिल्दो भुक्तानी फेला परेन।',
    },
    paymentsFilteredEmptySuggestion: {
        en: 'Please clear filters.',
        ne: 'कृपया फिल्टरहरू खाली गर्नुहोस्।',
    },
    paymentsStatusHeading: {
        en: 'Payment Status',
        ne: 'भुक्तानी स्थिति',
    },
    totalUnverifiedPaymentLabel: {
        en: 'Unverified Payment Amount',
        ne: 'कुल अप्रमाणित भुक्तानी',
    },
    totalUnverifiedPaymentCountLabel: {
        en: 'Unverified Payments',
        ne: 'कुल अप्रमाणित भुक्तानी गणना',
    },
    totalVerifiedPaymentLabel: {
        en: 'Payment Amount',
        ne: 'कुल भुक्तानी',
    },
    totalVerifiedPaymentCountLabel: {
        en: 'Payments',
        ne: 'कुल प्रमाणित भुक्तानी गणना',
    },
};

export const school = {
    profileUpdateErrorLabel: {
        en: 'Error updating school profile',
        ne: 'विद्यालय प्रोफाइल अपडेटमा समस्या',
    },
    profileUpdateSuccessLabel: {
        en: 'Successfully updated school profile',
        ne: 'विद्यालय प्रोफाइल सफलतापूर्वक अपडेट भयो ',
    },
    editSchoolProfileModalHeading: {
        en: 'Edit School Details',
        ne: 'विद्यालय विवरण सम्पादन गर्नुहोस्',
    },
    cancelLabel: {
        en: 'Cancel',
        ne: 'रद्द गर्नुहोस्',
    },
    saveLabel: {
        en: 'Save',
        ne: 'सेभ गर्नुहोस्',
    },
    schoolNameLabel: {
        en: 'School Name',
        ne: 'विद्यालयको नाम',
    },
    municipalityLabel: {
        en: 'Municipality',
        ne: 'नगरपालिका',
    },
    wardNumberLabel: {
        en: 'Ward Number',
        ne: 'वडा नम्बर ',
    },
    localAddressLabel: {
        en: 'Local Address',
        ne: 'स्थानीय ठेगाना',
    },
    firstNameLabel: {
        en: 'First Name',
        ne: 'पहिलो नाम',
    },
    lastNameLabel: {
        en: 'Last Name',
        ne: 'थर',
    },
    phoneNumberLabel: {
        en: 'Phone Number',
        ne: 'फोन नम्बर',
    },
    panNumberLabel: {
        en: 'PAN Number',
        ne: 'प्यान नम्बर',
    },
    vatNumberLabel: {
        en: 'VAT Number',
        ne: 'भ्याट नम्बर',
    },
    booksLabel: {
        en: 'Books',
        ne: 'किताबहरु ',
    },
    totalPriceLabel: {
        en: 'Total Price',
        ne: 'कुल रकम',
    },
    rsLabel: {
        en: 'Rs. ',
        ne: 'रु.',
    },
    statusLabel: {
        en: 'Status',
        ne: 'स्थिति',
    },
    profileDetailsHeading: {
        en: 'Profile Details',
        ne: 'प्रोफाइल विवरण',
    },
    editProfileButtonContent: {
        en: 'Edit Profile',
        ne: 'प्रोफाइल सम्पादन गर्नुहोस',
    },
    editSchoolProfileButtonContent: {
        en: 'Edit School Profile',
        ne: 'विद्यालय प्रोफाइल सम्पादन गर्नुहोस्',
    },
    nameLabel: {
        en: 'Name',
        ne: 'नाम',
    },
    emailLabel: {
        en: 'Email',
        ne: 'इमेल',
    },
    addressLabel: {
        en: 'Address',
        ne: 'ठेगाना',
    },
    myWishlistLabel: {
        en: 'Wish list',
        ne: 'मेरो इच्छा-सूची',
    },
    myCartLabel: {
        en: 'Cart',
        ne: 'मेरो कार्ट',
    },
    totalOrdersLabel: {
        en: 'Total Orders',
        ne: 'कुल अर्डरहरु ',
    },
    weeksOrderLabel: {
        en: 'This week\'s order',
        ne: 'यो हप्ताको अर्डरहरु ',
    },
    orderDetailsHeading: {
        en: 'Order Details',
        ne: 'अर्डर विवरण ',
    },
    viewMoreButtonContent: {
        en: 'View More',
        ne: 'अझ धेरै हेर्नुहोस्',
    },
    recentOrderEmptyMessage: {
        en: 'You dont have any Recent Orders',
        ne: 'तपाईंसँग कुनै हालैका अर्डरहरू छैनन्',
    },
    recentOrderEmptySuggestion: {
        en: 'Add Books that you want to buy later by clicking Add to Wishlist and then goto your Cart to place your Order',
        ne: '\'इच्छासूचीमा थप्नुहोस्\' क्लिक गरी पछि किन्न चाहनुभएको किताबहरू थप्नुहोस् र त्यसपछि अर्डर राख्नको लागि तपाईंको कार्टमा जानुहोस्',
    },
};

export const publisher = {
    profileUpdateErrorLabel: {
        en: 'Error updating publisher profile',
        ne: 'प्रकाशक प्रोफाइल अपडेटमा समस्या',
    },
    profileUpdateSuccessLabel: {
        en: 'Successfully updated publisher profile',
        ne: 'प्रकाशक प्रोफाइल सफलतापूर्वक अपडेट गरियो',
    },
    editProfileModalHeading: {
        en: 'Edit Details',
        ne: 'प्रोफाइल सम्पादन गर्नुहोस्',
    },
    cancelLabel: {
        en: 'Cancel',
        ne: 'रद्द गर्नुहोस्',
    },
    saveLabel: {
        en: 'Save',
        ne: 'सेभ गर्नुहोस्',
    },
    publisherNameLabel: {
        en: 'Publisher Name',
        ne: 'प्रकाशक नाम',
    },
    municipalityLabel: {
        en: 'Municipality',
        ne: 'नगरपालिका',
    },
    wardNumberLabel: {
        en: 'Ward Number',
        ne: 'वडा नम्बर ',
    },
    localAddressLabel: {
        en: 'Local Address',
        ne: 'स्थानीय ठेगाना',
    },
    firstNameLabel: {
        en: 'First Name',
        ne: 'पहिलो नाम',
    },
    lastNameLabel: {
        en: 'Last Name',
        ne: 'थर',
    },
    phoneNumberLabel: {
        en: 'Phone Number',
        ne: 'फोन नम्बर',
    },
    panNumberLabel: {
        en: 'PAN Number',
        ne: 'प्यान नम्बर',
    },
    vatNumberLabel: {
        en: 'VAT Number',
        ne: 'भ्याट नम्बर',
    },
    booksLabel: {
        en: 'Books',
        ne: 'किताबहरु ',
    },
    totalPriceLabel: {
        en: 'Total Price',
        ne: 'कुल रकम',
    },
    rsLabel: {
        en: 'Rs. ',
        ne: 'रु.',
    },
    statusLabel: {
        en: 'Status',
        ne: 'स्थिति',
    },
    profileDetailsHeading: {
        en: 'Profile Details',
        ne: 'प्रोफाइल विवरण',
    },
    editProfileButtonContent: {
        en: 'Edit Profile',
        ne: 'प्रोफाइल सम्पादन गर्नुहोस',
    },
    nameLabel: {
        en: 'Name',
        ne: 'नाम',
    },
    emailLabel: {
        en: 'Email',
        ne: 'इमेल',
    },
    addressLabel: {
        en: 'Address',
        ne: 'ठेगाना',
    },
    myWishlistLabel: {
        en: 'My Wishlist',
        ne: 'मेरो इच्छा सूची',
    },
    myCartLabel: {
        en: 'My Cart',
        ne: 'मेरो कार्ट',
    },
    totalOrdersLabel: {
        en: 'Total Orders',
        ne: 'कुल अर्डरहरु ',
    },
    weeksOrderLabel: {
        en: 'This week\'s order',
        ne: 'यो हप्ताको अर्डरहरु ',
    },
    orderDetailsHeading: {
        en: 'Order Details',
        ne: 'अर्डर विवरण ',
    },
    viewMoreButtonContent: {
        en: 'View More',
        ne: 'अझ धेरै हेर्नुहोस्',
    },
};

export const orderList = {
    pageHeading: {
        en: 'Orders',
        ne: 'अर्डरहरू',
    },
    searchPlaceholder: {
        en: 'Search by book title (3 or more characters)',
        ne: 'किताब शीर्षक द्वारा खोज्नुहोस् (३ वा बढी वर्णहरू)',
    },
    orderCountLabel: {
        en: 'Order Count',
        ne: 'अर्डर सांख्य',
    },
    orderStatusFilterLabel: {
        en: 'Order Status',
        ne: 'अर्डर स्टेटस',
    },
    clearStatusFilterButtonLabel: {
        en: 'Clear status filter',
        ne: 'स्टेटस  फिल्टर खाली गर्नुहोस्',
    },
    numOrdersLabel: {
        en: 'Order(s) found',
        ne: 'अर्डर(हरू) भेटियो',
    },
};

export const bookDetailModal = {
    bookDetailFetchErrorMessage: {
        en: 'Error while fetching book details!',
        ne: 'किताब विवरणहरू प्राप्त गर्दा समस्या!',
    },
    loadingMessage: {
        en: 'Loading...',
        ne: 'लोड गर्दै...',
    },
};

export const bookItem = {
    bookOrderFailedMessage: {
        en: 'Failed to add book to the order',
        ne: 'अर्डरमा किताब थप्न समस्या',
    },
    bookOrderSuccessMessage: {
        en: 'Book added to order',
        ne: 'किताब सफलतापूर्वक अर्डरमा थपियो',
    },
    wishlistAdditionFailedMessage: {
        en: 'Failed to add book to the wish list',
        ne: 'इच्छा-सूचीमा किताब थप्न समस्या',
    },
    wishlistAdditionSuccessMessage: {
        en: 'Book added to wishlist',
        ne: 'किताब सफलतापूर्वक इच्छा सूचीमा थपियो',
    },
    wishlistRemovalFailedMessage: {
        en: 'Failed to remove book from the wish list',
        ne: 'इच्छा-सूचीबाट किताब हटाउन समस्या',
    },
    wishlistRemovalSuccessMessage: {
        en: 'Book removed from wishlist',
        ne: 'किताब इच्छा सूचीबाट हटाइयो',
    },
    alreadyInOrderListMessage: {
        en: 'In order list',
        ne: 'क्रम सूचीमा',
    },
    addToOrderButtonLabel: {
        en: 'Add to Order',
        ne: 'अर्डरमा थप्नुहोस्',
    },
    removeFromWishlistButtonLabel: {
        en: 'Remove from Wish List',
        ne: 'इच्छा-सूचीबाट हटाउनुहोस्',
    },
    addToWishlistButtonLabel: {
        en: 'Add to Wish List',
        ne: 'इच्छा-सूचीमा राख्नुहोस्',
    },
    nprLabel: {
        en: 'NPR.',
        ne: 'ने.रू',
    },
    priceLabel: {
        en: 'Price',
        ne: 'मूल्य',
    },
    languageLabel: {
        en: 'Language',
        ne: 'भाषा',
    },
    numberOfPagesLabel: {
        en: 'Number of Pages',
        ne: 'पृष्ठहरूको संख्या',
    },
    isbnLabel: {
        en: 'ISBN',
        ne: 'आई.एस.बी.एन (ISBN)',
    },
    publisherLabel: {
        en: 'Publisher',
        ne: 'प्रकाशक',
    },
    quantityLabel: {
        en: 'Quantity',
        ne: 'मात्रा',
    },
    editionLabel: {
        en: 'Edition',
        ne: 'संस्करण',
    },
    bookPrice: {
        en: 'NPR {price}',
        ne: 'मूल्य {ने.रू}',
    },
    editDetailsButtonLabel: {
        en: 'Edit Details',
        ne: 'विवरण सम्पादन गर्नुहोस्',
    },
};

export const orderItem = {
    viewDetailsLabel: {
        en: 'View order details',
        ne: 'अर्डर विवरण हेर्नुहोस्',
    },
    booksLabel: {
        en: 'Books',
        ne: 'किताबहरू',
    },
    totalPriceLabel: {
        en: 'Total price',
        ne: 'कुल रकम',
    },
    statusLabel: {
        en: 'Status',
        ne: 'अवस्था',
    },
    nprPrefix: {
        en: 'NPR. ',
        ne: 'ने.रू .',
    },
    orderTitle: {
        en: 'Order #{code}',
        ne: 'अर्डर #{code}',
    },
    cancelOrderFailureMessage: {
        en: 'Failed to cancel order',
        ne: 'अर्डर रद्द गर्न सकिएन',
    },
    cancelOrderSuccessMessage: {
        en: 'Order cancelled successfully.',
        ne: 'अर्डर सफलतापूर्वक रद्द गरियो',
    },
    cancelOrderButtonLabel: {
        en: 'Cancel Order',
        ne: 'अर्डर रद्द गर्नुहोस्',
    },
    cancelOrderModalHeader: {
        en: 'Cancel Order',
        ne: 'अर्डर रद्द गर्नुहोस्',
    },
    cancelOrderModalSaveButtonLabel: {
        en: 'Save',
        ne: 'सेभ गर्नुहोस्',
    },
    cancelOrderModalCancelButtonLabel: {
        en: 'Cancel',
        ne: 'रद्द गर्नुहोस्',
    },
    cancelOrderModalCommentsLabel: {
        en: 'Comments',
        ne: 'टिप्पणीहरू',
    },
};

export const ordersBar = {
    booksSelectedMessage: {
        en: '{count} book(s) selected',
        ne: '{count} किताब(हरू) चयन गरियो',
    },
    totalPriceLabel: {
        en: 'Total price',
        ne: 'कुल मूल्य',
    },
    totalBooksLabel: {
        en: 'Total Books',
        ne: 'कुल किताबहरू',
    },
    viewOrdersLabel: {
        en: 'View Orders',
        ne: 'अर्डरहरू हेर्नुहोस्',
    },
    orderPlacementSuccessfulMessage: {
        en: 'Your order has been submitted successfully!',
        ne: 'तपाईंको अर्डर सफलतापूर्वक पेश गरिएको छ!',
    },
    orderPlacementFailureMessage: {
        en: 'Failed to place the order!',
        ne: 'अर्डर राख्न असफल!',
    },
    orderListHeading: {
        en: 'Order List',
        ne: 'अर्डर सूची',
    },
    orderBooksButtonLabel: {
        en: 'Order Books',
        ne: 'किताबहरू अर्डर गर्नुहोस्',
    },
    doneButtonLabel: {
        en: 'Done',
        ne: 'सम्पन्न',
    },
    orderIdLabel: {
        en: 'Order ID',
        ne: 'अर्डर आईडी',
    },
    orderPlacementHelpText: {
        en: 'We will contact you once we\'ve received the order on our end for order confirmation and payment details',
        ne: 'अर्डर पुष्टिकरण र भुक्तानी विवरणहरूको लागि अन्तमा अर्डर प्राप्त भएपछि हामी तपाईंलाई सम्पर्क गर्नेछौं',
    },
    removeFromCartErrorMessage: {
        en: 'Failed to remove current book from the cart',
        ne: 'कार्टबाट हालको किताब हटाउन असफल',
    },
    updateCartErrorMessage: {
        en: 'Failed to update the cart',
        ne: 'कार्ट अद्यावधिक गर्न असफल',
    },
    nprPrefix: {
        en: 'NPR.',
        ne: 'ने रू ',
    },
    pendingCartItemMessage: {
        en: 'Loading cart items ...',
        ne: 'कार्ट वस्तुहरू लोड गर्दै',
    },
    emptyCartMessage: {
        en: 'Your cart is empty.',
        ne: 'तपाईंको कार्ट खाली छ',
    },
    emptyCartSuggestion: {
        en: 'Please add books to your cart.',
        ne: 'कृपया आफ्नो कार्टमा किताबहरू थप्नुहोस्',
    },
};

export const newBookModal = {
    modalHeading: {
        en: 'Add New Book',
        ne: 'नयाँ किताब थप्नुहोस्',
    },
    saveButtonLabel: {
        en: 'Save',
        ne: 'सेभ गर्नुहोस्',
    },
    cancelButtonLabel: {
        en: 'Cancel',
        ne: 'रद्द गर्नुहोस्',
    },
    titleLabel: {
        en: 'Title',
        ne: 'शीर्षक',
    },
    editionLabel: {
        en: 'Edition',
        ne: 'संस्करण',
    },
    gradeLabel: {
        en: 'Grade',
        ne: 'कक्षा',
    },
    descriptionLabel: {
        en: 'Description',
        ne: 'विवरण',
    },
    isbnLabel: {
        en: 'ISBN',
        ne: 'आई.एस.बी.एन',
    },
    numberOfPagesLabel: {
        en: 'Number of Pages',
        ne: 'पृष्ठहरूको संख्या',
    },
    languageLabel: {
        en: 'Language',
        ne: 'भाषा',
    },
    publishedDateLabel: {
        en: 'Published Date',
        ne: 'प्रकाशित मिति',
    },
    priceLabel: {
        en: 'Price',
        ne: 'मूल्य',
    },
    categoriesLabel: {
        en: 'Categories',
        ne: 'वर्गहरू',
    },
    authorsLabel: {
        en: 'Authors',
        ne: 'लेखकहरू',
    },
    newBookUploadSuccessMessage: {
        en: 'Successfully uploaded book',
        ne: 'किताब सफलतापूर्वक अपलोड गरियो',
    },
    newBookUploadFailureMessage: {
        en: 'Failed to upload book',
        ne: 'किताब अपलोड गर्न असफल ',
    },
};

export const activateUser = {
    appLabel: common.kitabBazarAppLabel,
    userActivationMessage: {
        en: 'Activating User, Please wait..',
        ne: 'प्रयोगकर्ता सक्रिय गर्दै, कृपया प्रतीक्षा गर्नुहोस्',
    },
    userActivationSuccessfulMessage: {
        en: 'Sucessfully activated the user!',
        ne: 'प्रयोगकर्तालाई सफलतापूर्वक सक्रिय गरियो',
    },
    userActivationFailureMessage: {
        en: 'Failed to activate user',
        ne: 'प्रयोगकर्ता सक्रिय गर्न असफल',
    },
};

export const orderDetail = {
    searchInputPlaceholder: {
        en: 'Search for books',
        ne: 'किताबहरू खोज्नुहोस्',
    },
    markAsPackedButtonLabel: {
        en: 'Mark as Packed',
        ne: 'प्याक भैसकेको अंकित गर्नुहोस ',
    },
    markAsPackedConfirmationMessage: {
        en: 'Are you sure you want to mark the order as packed?',
        ne: 'Are you sure you want to mark the order as packed?',
    },
    markAsCompletedConfirmationMessage: {
        en: 'Are you sure you want to mark the order as completed?',
        ne: 'Are you sure you want to mark the order as completed?',
    },
    noGoingBackWarningMessage: {
        en: 'NOTE: This action cannot be undone',
        ne: 'NOTE: This action cannot be undone',
    },
    markAsCompletedButtonLabel: {
        en: 'Mark as Completed',
        ne: 'Mark as Completed',
    },
    orderStatusUpdateFailedMessage: {
        en: 'Failed to update the Order status',
        ne: 'Failed to update the Order status',
    },
};

export const resetPassword = {
    resetPasswordHeaderLabel: {
        en: 'Reset Password',
        ne: 'पास्स्वोर्ड  बिर्सिए',
    },
    resetPasswordButtonLabel: {
        en: 'Reset Password',
        ne: 'पासवर्ड रिसेट गर्नुहोस् ',
    },
    emailLabel: {
        en: 'Email',
        ne: 'इमेल',
    },
    loginLabel: {
        en: 'Go back to login',
        ne: 'लगइन गर्न फर्कनुहोस्',
    },
    errorResettingPassword: {
        en: 'There was an error while trying to reset your password.',
        ne: 'तपाईको पासवर्ड रिसेट गर्दा त्रुटि भयो',
    },
    resetPasswordEmailSentLabel: {
        en: 'Successfully sent email to reset your password.',
        ne: ' तपाईको पासवर्ड रिसेट गर्न सफलतापूर्वक इमेल पठाइयो।',
    },
};
