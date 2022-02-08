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
        np: 'तपाईंले भर्खरै एउटा {orderLink} प्राप्त गर्नुभएको छ',
    },
    orderCancelled: {
        en: 'Your {orderLink} has been cancelled.',
        np: 'तपाईंको {orderLink} रद्द गरिएको छ।',
    },
    orderPacked: {
        en: 'Your {orderLink} has been packed.',
        np: 'तपाईंको {orderLink} प्याक गरिएको छ।',
    },
    orderCompleted: {
        en: 'Your {orderLink} has been packed.',
        np: 'तपाईंको {orderLink} पूरा भएको छ।',
    },
};
