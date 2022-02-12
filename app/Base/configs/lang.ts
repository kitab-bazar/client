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
        ne: 'Error logging out',
    },
    logoutSuccessMessage: {
        en: 'Successfully logged out',
        ne: 'Successfully logged out',
    },
    unathenticatedPageHeader: {
        en: 'Oh no!',
        ne: 'Oh no!',
    },
    unathenticatedPageContent: {
        en: 'The page does not exist or you do not have permissions to view this page.',
        ne: 'The page does not exist or you do not have permissions to view this page.',
    },
};

export const navbar = {
    searchAllBooksPlaceholder: {
        en: 'Search all books',
        ne: 'किताब खोज्नु होस्',
    },
    signUpButtonLabel: {
        en: 'Register',
        ne: 'नया दर्ता',
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
        en: 'Goto profile',
        ne: 'प्रोफाइलमा जानुहोस्',
    },
    logoutConfirmMessage: {
        en: 'Are you sure you want to logout?',
        ne: 'साचिकै लग ओउट गर्ने हो?',
    },
    logoutButtonLabel: {
        en: 'Logout',
        ne: 'लग ओउट',
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
        ne: 'लोग इन गर्न समस्या भएको छ।',
    },
    registerlabel: {
        en: 'Register',
        ne: 'दर्ता  गर्नुहोस्',
    },
};

export const register = {
    registrationSuccessMessage: {
        en: 'Registration completed successfully! Please validate your account before logging in',
        ne: 'Registration completed successfully! Please validate your account before logging in',
    },
    registrationFailureMessage: {
        en: 'Error during registration!',
        ne: 'Error during registration!',
    },
    passwordConfirmationError: {
        en: 'Password doesn\'t match',
        ne: 'Password doesn\'t match',
    },
    pageHeading: {
        en: 'Register New User',
        ne: 'Register New User',
    },
    alreadyHaveAccountMessage: {
        en: 'Already have an account? {loginLink}',
        ne: 'Already have an account? {loginLink}',
    },
    loginLinkLabel: {
        en: 'Login',
        ne: 'Login',
    },
    emailInputLabel: {
        en: 'Email',
        ne: 'Email',
    },
    passwordInputLabel: {
        en: 'Password',
        ne: 'Password',
    },
    confirmPasswordInputLabel: {
        en: 'Confirm Password',
        ne: 'Confirm Password',
    },
    phoneNumberInputLabel: {
        en: 'Phone No.',
        ne: 'Phone No.',
    },
    userTypeInputLabel: {
        en: 'User Type',
        ne: 'User Type',
    },
    firstNameInputLabel: {
        en: 'First Name',
        ne: 'First Name',
    },
    lastNameInputLabel: {
        en: 'Last Name',
        ne: 'Last Name',
    },
    registerButtonLabel: {
        en: 'Register',
        ne: 'Register',
    },
    institutionNameInputLabel: {
        en: 'Name of the Institution',
        ne: 'Name of the Institution',
    },
    publisherNameInputLabel: {
        en: 'Name of the Publisher',
        ne: 'Name of the Publisher',
    },
    schoolNameInputLabel: {
        en: 'Name of the School',
        ne: 'Name of the School',
    },
    municipalityInputLabel: {
        en: 'Municipality',
        ne: 'Municipality',
    },
    wardNumberInputLabel: {
        en: 'Ward Number',
        ne: 'Ward Number',
    },
    localAddressInputLabel: {
        en: 'Local Address',
        ne: 'Local Address',
    },
    panInputLabel: {
        en: 'PAN',
        ne: 'PAN',
    },
    vatNumberInputLabel: {
        en: 'VAT Number',
        ne: 'VAT Number',
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
        ne: 'जहाँ पढाइ राम्रो हुन्छ!',
    },
    exploreButtonLabel: {
        en: 'Explore the Platfrom',
        ne: 'Explore the Platfrom',
    },
    featuredBooksLabel: {
        en: 'Featured Books',
        ne: 'चित्रित किताबहरु',
    },
    backgroundLabel: {
        en: 'Background',
        ne: 'पृष्ठभूमि',
    },
    platformBackground: {
        en: 'The School Sector Development Plan (SSDP), of the Government of Nepal (GoN), has focused on delivering quality education in schools that includes improving the foundational reading skills of the students. National Early Grade Reading Programme (NEGRP) is a core component of the SSDP, to improve the reading skills of students in the early grades. The SSDP has made the establishment of book corners necessary in order to ensure that appropriate and relevant books are available in classrooms for grades 1 to 3. However, the establishment of book corners was constrained by many demand and supply-side challenges. To accelerate the progress towards the PMEC standards, KITAB Bazar focuses on the 5th priority of PMEC, which is the book/learning corner in all classrooms. Therefore, The Project, KITAB was designed to address these challenges and create sustainable access to quality Supplementary Reading Materials (SRM) to help achieve literacy outcomes.',
        ne: 'नेपाल सरकारको विद्यालय क्षेत्र विकास योजना (SSDP) ले विद्यार्थीहरूको आधारभूत पठन सीपमा सुधार लगायत विद्यालयहरूमा गुणस्तरीय शिक्षा प्रदान गर्नमा केन्द्रित छ। राष्ट्रिय प्रारम्भिक ग्रेड पढाइ कार्यक्रम (NEGRP) प्रारम्भिक कक्षाहरूमा विद्यार्थीहरूको पढ्ने सीपहरू सुधार गर्न SSDP को मुख्य भाग हो। कक्षा १ देखि ३ सम्मका लागि उपयुक्त र सान्दर्भिक पुस्तकहरू कक्षाकोठामा उपलब्ध छन् भनी सुनिश्चित गर्न SSDP ले बुक कर्नरहरू स्थापना गर्न आवश्यक बनाएको छ। यद्यपि, धेरै माग र आपूर्ति पक्षका चुनौतीहरूले बुक कर्नर स्थापना गर्न बाधा पुगेको थियो। PMEC मापदण्डहरूमा प्रगतिलाई गति दिन, KITAB Bazar ले PMEC को 5 औं प्राथमिकतामा केन्द्रित छ, जुन सबै कक्षाकोठाहरूमा पुस्तक/शिक्षा कुना हो। तसर्थ, परियोजना, KITAB यी चुनौतीहरूलाई सम्बोधन गर्न र साक्षरता परिणामहरू प्राप्त गर्न मद्दत गर्न गुणस्तरीय पूरक पठन सामग्री (SRM) मा दिगो पहुँच सिर्जना गर्न डिजाइन गरिएको थियो।',
    },
    whoAreWeLabel: {
        en: 'Who are we?',
        ne: 'हामी को हौं?',
    },
    whoAreWeDescription: {
        en: 'We are an online digital platform with the aim of improving access to quality supplementary reading materials in schools, in order to maintain their book corners. Collaborating with various publishing firms, we have streamlined the process of selecting, ordering, and purchasing books for children. We\'ve also included information on how book corners are implemented in schools and how they are beneficial for the children. If there is any interest in adopting what has been created so far, we will provide further information and answer any concerns about the project.',
        ne: 'हामी विद्यालयहरूमा गुणस्तरीय पूरक पठन सामग्रीहरूमा पहुँच सुधार गर्ने उद्देश्यका साथ एउटा अनलाइन डिजिटल प्लेटफर्म हौं, उनीहरूको पुस्तक कुनाहरू कायम राख्न। विभिन्न प्रकाशन फर्महरूसँग सहकार्य गर्दै, हामीले बालबालिकाका लागि पुस्तकहरू छनोट, अर्डर गर्ने र खरिद गर्ने प्रक्रियालाई सुव्यवस्थित गरेका छौं। हामीले पुस्तक कर्नरहरू स्कूलहरूमा कसरी लागू गरिन्छ र तिनीहरू बच्चाहरूको लागि कसरी लाभदायक छन् भन्ने जानकारी पनि समावेश गरेका छौं। यदि अहिलेसम्म सिर्जना गरिएको कुरालाई अपनाउन कुनै चासो छ भने, हामी थप जानकारी प्रदान गर्नेछौं र परियोजनाको बारेमा कुनै चिन्ताको जवाफ दिनेछौं।',
    },
    goalsLabel: {
        en: 'Our Goals',
        ne: 'हाम्रा लक्ष्यहरू',
    },
    firstGoalDescription: {
        en: 'To strengthen the evidence-base for the impact that Results Based Financing (RBF) can have on the education system in Nepal by ensuring that children have access to quality supplementary reading materials at their schools.',
        ne: 'रिजल्ट बेस्ड फाइनान्सिङ (RBF) ले नेपालको शिक्षा प्रणालीमा पार्न सक्ने प्रभावका लागि प्रमाण-आधारलाई बलियो बनाउन बालबालिकाहरूलाई उनीहरूको विद्यालयमा गुणस्तरीय पूरक पठन सामग्रीको पहुँच सुनिश्चित गर्न।',
    },
    secondGoalDescription: {
        en: 'To use the evidence to inform the national education debate, policy, and practice and to expand global understanding of the use of results-based financing to address supply chain issues.',
        ne: 'राष्ट्रिय शिक्षा बहस, नीति, र अभ्यासलाई सूचित गर्न प्रमाणहरू प्रयोग गर्न र आपूर्ति श्रृंखला मुद्दाहरूलाई सम्बोधन गर्न परिणामहरूमा आधारित वित्तपोषणको प्रयोगको विश्वव्यापी बुझाइ विस्तार गर्न।',
    },
    accessToReadingMaterialText: {
        en: 'Children have access to sufficient supplementary reading materials in schools',
        ne: 'बालबालिकालाई विद्यालयमा पर्याप्त पूरक पठन सामग्रीको पहुँच छ',
    },
    bookCornerIncentiveText: {
        en: 'Incentivizing schools to invest in establishment, maintenance and utilization of book corners',
        ne: 'पुस्तक कर्नरको स्थापना, मर्मत र उपयोगमा लगानी गर्न विद्यालयहरूलाई प्रोत्साहन गर्ने',
    },
    relationshipEnhacementText: {
        en: 'Enhancing relationship between publishers and Curriculum Development Center (CDC)',
        ne: 'प्रकाशक र पाठ्यक्रम विकास केन्द्र (CDC) बीचको सम्बन्ध सुधार गर्दै',
    },
    supplyChainText: {
        en: 'Strengthening supply chain mechanism for grade-appropriate supplementary reading materials to rural community schools',
        ne: 'ग्रामीण सामुदायिक विद्यालयहरूमा ग्रेड-उपयुक्त पूरक पठन सामग्रीहरूको लागि आपूर्ति श्रृंखला संयन्त्रलाई सुदृढ गर्दै',
    },
};

export const explore = {
    sortOptionsPriceAsc: {
        en: 'Price (Low to High)',
        ne: 'Price (Low to High)',
    },
    sortOptionsPriceDsc: {
        en: 'Price (High to Low)',
        ne: 'Price (High to Low)',
    },
    sortOptionsDateAsc: {
        en: 'Date added (Older first)',
        ne: 'Date added (Older first)',
    },
    sortOptionsDateDsc: {
        en: 'Date added (Newer first)',
        ne: 'Date added (Newer first)',
    },
    pageTitlePublisher: {
        en: 'Books',
        ne: 'Books',
    },
    pageTitleExploreByCategory: {
        en: 'Explore Books by Category',
        ne: 'Explore Books by Category',
    },
    pageTitleWishList: {
        en: 'Wish List',
        ne: 'Wish List',
    },
    pageTitleDefault: {
        en: 'Explore Books',
        ne: 'Explore Books',
    },
    searchInputPlaceholder: {
        en: 'Search by title (3 or more characters)',
        ne: 'Search by title (3 or more characters)',
    },
    categoriesFilterLabel: {
        en: 'Categories',
        ne: 'Categories',
    },
    clearCategoriesFilterButtonLabel: {
        en: 'Clear categories filter',
        ne: 'Clear categories filter',
    },
    publisherFilterLabel: {
        en: 'Publisher',
        ne: 'Publisher',
    },
    clearPublisherFilterButtonLabel: {
        en: 'Clear publisher filter',
        ne: 'Clear publisher filter',
    },
    booksFoundLabel: {
        en: 'Book(s) found',
        ne: 'Book(s) found',
    },
    activeSortLabel: {
        en: 'Order by: {sortLabel}',
        ne: 'Order by: {sortLabel}',
    },
    addBookButtonLabel: {
        en: 'Add New Book',
        ne: 'Add New Book',
    },
    publisherAllBooksLabel: {
        en: 'All Books',
        ne: 'All Books',
    },
    publisherOwnBooksLabel: {
        en: 'My Books',
        ne: 'My Books',
    },
};

export const footer = {
    tagLineLabel: {
        en: 'Where reading gets better!',
        ne: 'जहाँ पढाइ राम्रो हुन्छ!',
    },
    faqButtonLabel: {
        en: 'FAQs',
        ne: 'जानबुझ',
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
};

export const individualProfile = {
    userDetailHeading: {
        en: 'User Details',
        ne: 'User Details',
    },
    editProfileLabel: {
        en: 'Edit Profile',
        ne: 'Edit Profile',
    },
    nameAttributeLabel: {
        en: 'Name',
        ne: 'Name',
    },
    emailAttributeLabel: {
        en: 'Email',
        ne: 'Email',
    },
    phoneAttributeLabel: {
        en: 'Phone No.',
        ne: 'Phone No.',
    },
    wishlistLabel: {
        en: 'Wish list',
        ne: 'Wish list',
    },
    orderSummaryHeading: {
        en: 'Order Summary',
        ne: 'Order Summary',
    },
    totalOrdersLabel: {
        en: 'Total orders',
        ne: 'Total orders',
    },
    recentOrdersHeading: {
        en: 'Recent Orders',
        ne: 'Recent Orders',
    },
    viewAllLabel: {
        en: 'View all',
        ne: 'View all',
    },
    recentOrderEmptyMessage: {
        en: 'You dont have any Recent Orders',
        ne: 'You dont have any Recent Orders',
    },
    recentOrderEmptySuggestion: {
        en: 'Add Books that you want to buy later by clicking Add to Wishlist and then goto your Cart to place your Order',
        ne: 'Add Books that you want to buy later by clicking Add to Wishlist and then goto your Cart to place your Order',
    },
    profileUpdateSuccessMessage: {
        en: 'Successfully updated profile',
        ne: 'Successfully updated profile',
    },
    profileUpdateErrorMessage: {
        en: 'Error updating profile',
        ne: 'Error updating profile',
    },
    modalHeading: {
        en: 'Edit Profile',
        ne: 'Edit Profile',
    },
    editProfileSaveButtonLabel: {
        en: 'Save',
        ne: 'Save',
    },
    editProfileCancelButtonLabel: {
        en: 'Cancel',
        ne: 'Cancel',
    },
    editProfileFirstNameInputLabel: {
        en: 'First Name',
        ne: 'First Name',
    },
    editProfileLastNameInputLabel: {
        en: 'Last Name',
        ne: 'Last Name',
    },
    editProfilePhoneNumberInputLabel: {
        en: 'Phone No.',
        ne: 'Phone No.',
    },
};

export const school = {
    profileUpdateErrorLabel: {
        en: 'Error updating school profile',
        ne: 'प्रोफाइल अपडेट गर्दा समस्या ',
    },
    profileUpdateSuccessLabel: {
        en: 'Successfully updated school profile',
        ne: 'प्रोफाइल अपडेट सफलतापुर्व सम्पन्न ',
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
        ne: 'बचत गर्नुहोस्',
        // TODO: Find better word for 'save'
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
        ne: 'मेरो इच्छा सूची',
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
        ne: 'You dont have any Recent Orders',
    },
    recentOrderEmptySuggestion: {
        en: 'Add Books that you want to buy later by clicking Add to Wishlist and then goto your Cart to place your Order',
        ne: 'Add Books that you want to buy later by clicking Add to Wishlist and then goto your Cart to place your Order',
    },
};

export const publisher = {
    profileUpdateErrorLabel: {
        en: 'Error updating publisher profile',
        ne: 'Error updating publisher profile',
    },
    profileUpdateSuccessLabel: {
        en: 'Successfully updated publisher profile',
        ne: 'Successfully updated publisher profile',
    },
    editProfileModalHeading: {
        en: 'Edit Details',
        ne: 'Edit Details',
    },
    cancelLabel: {
        en: 'Cancel',
        ne: 'रद्द गर्नुहोस्',
    },
    saveLabel: {
        en: 'Save',
        ne: 'बचत गर्नुहोस्',
        // TODO: Find better word for 'save'
    },
    publisherNameLabel: {
        en: 'Publisher Name',
        ne: 'Publisher Name',
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
        ne: 'Orders',
    },
    searchPlaceholder: {
        en: 'Search by book title (3 or more characters)',
        ne: 'Search by book title (3 or more characters)',
    },
    orderCountLabel: {
        en: 'Order Count',
        ne: 'Order Count',
    },
    orderStatusFilterLabel: {
        en: 'Order Status',
        ne: 'Order Status',
    },
    clearStatusFilterButtonLabel: {
        en: 'Clear status filter',
        ne: 'Clear status filter',
    },
    numOrdersLabel: {
        en: 'Order(s) found',
        ne: 'Order(s) found',
    },
};

export const bookDetailModal = {
    bookDetailFetchErrorMessage: {
        en: 'Error while fetching book details!',
        ne: 'Error while fetching book details!',
    },
    loadingMessage: {
        en: 'Loading...',
        ne: 'Loading...',
    },
};

export const bookItem = {
    bookOrderFailedMessage: {
        en: 'Failed to add book to the order',
        ne: 'Failed to add book to the order',
    },
    wishlistAdditionFailedMessage: {
        en: 'Failed to add book to the wish list',
        ne: 'Failed to add book to the wish list',
    },
    wishlistRemovalFailedMessage: {
        en: 'Failed to remove book from the wish list',
        ne: 'Failed to remove book from the wish list',
    },
    alreadyInOrderListMessage: {
        en: 'In order list',
        ne: 'In order list',
    },
    addToOrderButtonLabel: {
        en: 'Add to Order',
        ne: 'Add to Order',
    },
    removeFromWishlistButtonLabel: {
        en: 'Remove from Wish List',
        ne: 'Remove from Wish List',
    },
    addToWishlistButtonLabel: {
        en: 'Add to Wish List',
        ne: 'Add to Wish List',
    },
    nprLabel: {
        en: 'NPR.',
        ne: 'NPR.',
    },
    priceLabel: {
        en: 'Price (NPR)',
        ne: 'Price (NPR)',
    },
    languageLabel: {
        en: 'Language',
        ne: 'Language',
    },
    numberOfPagesLabel: {
        en: 'Number of Pages',
        ne: 'Number of Pages',
    },
    isbnLabel: {
        en: 'ISBN',
        ne: 'ISBN',
    },
    publisherLabel: {
        en: 'Publisher',
        ne: 'Publisher',
    },
    quantityLabel: {
        en: 'Quantity',
        ne: 'Quantity',
    },
    editionLabel: {
        en: 'Edition',
        ne: 'Edition',
    },
    bookPrice: {
        en: 'NPR {price}',
        ne: 'NPR {price}',
    },
    editDetailsButtonLabel: {
        en: 'Edit Details',
        ne: 'Edit Details',
    },
};

export const orderItem = {
    viewDetailsLabel: {
        en: 'View order details',
        ne: 'View order details',
    },
    booksLabel: {
        en: 'Books',
        ne: 'Books',
    },
    totalPriceLabel: {
        en: 'Total price',
        ne: 'Total price',
    },
    statusLabel: {
        en: 'Status',
        ne: 'Status',
    },
    nprPrefix: {
        en: 'NPR. ',
        ne: 'NPR. ',
    },
    orderTitle: {
        en: 'Order #{code}',
        ne: 'Order #{code}',
    },
};

export const ordersBar = {
    booksSelectedMessage: {
        en: '{count} book(s) selected',
        ne: '{count} book(s) selected',
    },
    totalPriceLabel: {
        en: 'Total price (NPR)',
        ne: 'Total price (NPR)',
    },
    totalBooksLabel: {
        en: 'Total Books',
        ne: 'Total Books',
    },
    viewOrdersLabel: {
        en: 'View Orders',
        ne: 'View Orders',
    },
    orderPlacementSuccessfulMessage: {
        en: 'Your order has been submitted successfully!',
        ne: 'Your order has been submitted successfully!',
    },
    orderPlacementFailureMessage: {
        en: 'Failed to place the order!',
        ne: 'Failed to place the order!',
    },
    orderListHeading: {
        en: 'Order List',
        ne: 'Order List',
    },
    orderBooksButtonLabel: {
        en: 'Order Books',
        ne: 'Order Books',
    },
    doneButtonLabel: {
        en: 'Done',
        ne: 'Done',
    },
    orderIdLabel: {
        en: 'Order ID',
        ne: 'Order ID',
    },
    orderPlacementHelpText: {
        en: 'We will contact you once we\'ve received the order on our end for order confirmation and payment details',
        ne: 'We will contact you once we\'ve received the order on our end for order confirmation and payment details',
    },
    removeFromCartErrorMessage: {
        en: 'Failed to remove current book from the cart',
        ne: 'Failed to remove current book from the cart',
    },
    updateCartErrorMessage: {
        en: 'Failed to update the cart',
        ne: 'Failed to update the cart',
    },
    nprPrefix: {
        en: 'NPR.',
        ne: 'NPR.',
    },
};

export const newBookModal = {
    modalHeading: {
        en: 'Add New Book',
        ne: 'Add New Book',
    },
    saveButtonLabel: {
        en: 'Save',
        ne: 'Save',
    },
    cancelButtonLabel: {
        en: 'Cancel',
        ne: 'Cancel',
    },
    titleLabel: {
        en: 'Title',
        ne: 'Title',
    },
    descriptionLabel: {
        en: 'Description',
        ne: 'Description',
    },
    isbnLabel: {
        en: 'ISBN',
        ne: 'ISBN',
    },
    numberOfPagesLabel: {
        en: 'Number of Pages',
        ne: 'Number of Pages',
    },
    languageLabel: {
        en: 'Language',
        ne: 'Language',
    },
    publishedDateLabel: {
        en: 'Published Date',
        ne: 'Published Date',
    },
    priceLabel: {
        en: 'Price',
        ne: 'Price',
    },
    categoriesLabel: {
        en: 'Categories',
        ne: 'Categories',
    },
    authorsLabel: {
        en: 'Authors',
        ne: 'Authors',
    },
};

export const activateUser = {
    appLabel: common.kitabBazarAppLabel,
    userActivationMessage: {
        en: 'Activating User, Please wait..',
        ne: 'Activating User, Please wait..',
    },
    userActivationSuccessfulMessage: {
        en: 'Sucessfully activated the user!',
        ne: 'Sucessfully activated the user!',
    },
};

export const orderDetail = {
    searchInputPlaceholder: {
        en: 'Search for books',
        ne: 'Search for books',
    },
    markAsPackedButtonLabel: {
        en: 'Mark as Packed',
        ne: 'Mark as Packed',
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
