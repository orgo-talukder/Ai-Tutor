export type Language = 'en' | 'bn';

export interface TranslationSchema {
  common: {
    appName: string;
    tagline: string;
    newChat: string;
    signIn: string;
    signOut: string;
    cancel: string;
    save: string;
    delete: string;
    close: string;
    loading: string;
    copied: string;
    copy: string;
    regenerate: string;
    export: string;
    settings: string;
    guestUser: string;
    searchPlaceholder: string;
  };
  nav: {
    learningTools: string;
    diagnosticQuiz: string;
    teachBackLab: string;
    savedNotebook: string;
    chatHistory: string;
    noHistory: string;
    today: string;
    yesterday: string;
    previous7Days: string;
    older: string;
    keyboardShortcut: string;
    profile: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
  };
  emptyState: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    greetingNight: string;
    subheading: string;
    card1Category: string;
    card1Title: string;
    card1Desc: string;
    card1Prompt: string;
    card2Category: string;
    card2Title: string;
    card2Desc: string;
    card2Prompt: string;
    card3Category: string;
    card3Title: string;
    card3Desc: string;
    card3Prompt: string;
    card4Category: string;
    card4Title: string;
    card4Desc: string;
    card4Prompt: string;
  };
  composer: {
    placeholder: string;
    tutorMode: string;
    fastMode: string;
    deepMode: string;
    socraticMode: string;
    stepByStepMode: string;
    attachFile: string;
    voiceInput: string;
    listening: string;
    send: string;
    stop: string;
    disclaimer: string;
    toolsMention: string;
  };
  tools: {
    quizTitle: string;
    quizDesc: string;
    quizTopicPlaceholder: string;
    startQuiz: string;
    teachBackTitle: string;
    teachBackDesc: string;
    teachBackTopicPlaceholder: string;
    startTeachBack: string;
    notebookTitle: string;
    notebookDesc: string;
    noNotes: string;
  };
  settings: {
    title: string;
    general: string;
    persona: string;
    data: string;
    about: string;
    languageTitle: string;
    languageDesc: string;
    themeTitle: string;
    themeDesc: string;
    tutorStyle: string;
    tutorStyleDesc: string;
    socraticIntuition: string;
    directSolver: string;
    rigorousAcademic: string;
    clearData: string;
    clearDataConfirm: string;
  };
  auth: {
    signInTitle: string;
    signUpTitle: string;
    signInDesc: string;
    signUpDesc: string;
    emailLabel: string;
    passwordLabel: string;
    nameLabel: string;
    submitSignIn: string;
    submitSignUp: string;
    googleSignIn: string;
    continueAsGuest: string;
    noAccount: string;
    hasAccount: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    common: {
      appName: 'ThinkWise AI',
      tagline: 'Your Intelligent Socratic Learning Companion',
      newChat: 'New Chat',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      loading: 'Thinking...',
      copied: 'Copied to clipboard!',
      copy: 'Copy',
      regenerate: 'Regenerate',
      export: 'Export Notebook',
      settings: 'Settings',
      guestUser: 'Guest Learner',
      searchPlaceholder: 'Search conversations...',
    },
    nav: {
      learningTools: 'Learning Tools',
      diagnosticQuiz: 'Diagnostic Quiz',
      teachBackLab: 'Teach-Back Lab',
      savedNotebook: 'Saved Notebooks',
      chatHistory: 'Recent Chats',
      noHistory: 'No recent conversations',
      today: 'Today',
      yesterday: 'Yesterday',
      previous7Days: 'Previous 7 Days',
      older: 'Older',
      keyboardShortcut: '⌘K',
      profile: 'Account Profile',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    emptyState: {
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      greetingNight: 'Good night',
      subheading: 'What would you like to master today? Explore math derivations, scientific intuition, algorithms, or complex ideas.',
      card1Category: 'Mathematics',
      card1Title: 'Quadratic Formula Derivation',
      card1Desc: 'Derive ax² + bx + c = 0 step-by-step using completing the square technique.',
      card1Prompt: 'Can you show me the step-by-step derivation of the Quadratic Formula by completing the square, with intuitive geometric explanations for each step?',
      card2Category: 'Physics',
      card2Title: "Newton's Third Law Paradox",
      card2Desc: 'Why action-reaction pairs never cancel each other out during motion.',
      card2Prompt: "Why don't action and reaction forces cancel each other out according to Newton's 3rd Law? Please explain with intuitive free-body diagram concepts.",
      card3Category: 'Biology',
      card3Title: 'Photosynthesis Light Reactions',
      card3Desc: 'Visual breakdown of photosystems I & II and the proton gradient in thylakoids.',
      card3Prompt: 'Explain how the light-dependent reactions of photosynthesis generate ATP and NADPH through electron transport and proton gradient mechanics.',
      card4Category: 'Computer Science',
      card4Title: 'Recursive Call Stack in Python',
      card4Desc: 'How stack frames, base cases, and return unwinding execute in memory.',
      card4Prompt: 'Explain recursion and call stack memory mechanics using a visual Python example like computing Fibonacci numbers or tree traversals.',
    },
    composer: {
      placeholder: 'Ask any question or type @ to mention tools...',
      tutorMode: 'Socratic Tutor',
      fastMode: 'Fast Answer',
      deepMode: 'Deep Derivation',
      socraticMode: 'Socratic Dialogue',
      stepByStepMode: 'Step-by-Step Breakdown',
      attachFile: 'Upload Image / Document',
      voiceInput: 'Voice Dictation',
      listening: 'Listening...',
      send: 'Send',
      stop: 'Stop Generating',
      disclaimer: 'ThinkWise AI can make mistakes. Verify critical academic formulas and facts.',
      toolsMention: 'Mention a tool or subject context...',
    },
    tools: {
      quizTitle: 'Diagnostic Assessment',
      quizDesc: 'Test your understanding with targeted questions and instant misconception diagnosis.',
      quizTopicPlaceholder: 'Enter subject or concept (e.g., Organic Chemistry, Linear Algebra)...',
      startQuiz: 'Generate Diagnostic Quiz',
      teachBackTitle: 'Feynman Teach-Back Lab',
      teachBackDesc: 'Explain a topic in your own words. The AI will diagnose blind spots and assess your mastery.',
      teachBackTopicPlaceholder: 'Enter concept to teach (e.g., Backpropagation, Osmosis)...',
      startTeachBack: 'Begin Teach-Back Session',
      notebookTitle: 'Concept Notebook',
      notebookDesc: 'Your saved explanations, formulas, and verified insights.',
      noNotes: 'No saved concept notes yet.',
    },
    settings: {
      title: 'Preferences & Settings',
      general: 'General',
      persona: 'Tutor Persona',
      data: 'Data & Storage',
      about: 'About',
      languageTitle: 'Display & Response Language',
      languageDesc: 'Choose your default interface language (English or বাংলা).',
      themeTitle: 'Appearance Theme',
      themeDesc: 'Switch between light, dark, or system matching appearance.',
      tutorStyle: 'Pedagogical Teaching Style',
      tutorStyleDesc: 'Adjust how the AI guides your learning process.',
      socraticIntuition: 'Socratic & Intuitive (Guides with questions)',
      directSolver: 'Direct & Concise (Immediate clear solutions)',
      rigorousAcademic: 'Rigorous Academic (Formal proofs & derivations)',
      clearData: 'Clear Local History',
      clearDataConfirm: 'Are you sure you want to delete all cached session data?',
    },
    auth: {
      signInTitle: 'Welcome Back to ThinkWise AI',
      signUpTitle: 'Create your ThinkWise AI Account',
      signInDesc: 'Sign in to sync your study notes, diagnostic quizzes, and progress across devices.',
      signUpDesc: 'Join thousands of learners mastering complex concepts with AI-powered Socratic intuition.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      submitSignIn: 'Sign In',
      submitSignUp: 'Create Account',
      googleSignIn: 'Continue with Google',
      continueAsGuest: 'Continue as Guest',
      noAccount: "Don't have an account? Sign up",
      hasAccount: 'Already have an account? Sign in',
    },
  },
  bn: {
    common: {
      appName: 'থিঙ্কওয়াইজ এআই',
      tagline: 'আপনার বুদ্ধিমান সুক্রেটিক লার্নিং সঙ্গী',
      newChat: 'নতুন চ্যাট',
      signIn: 'সাইন-ইন',
      signOut: 'সাইন-আউট',
      cancel: 'বাতিল',
      save: 'সংরক্ষণ',
      delete: 'মুছে ফেলুন',
      close: 'বন্ধ করুন',
      loading: 'ভাবছে...',
      copied: 'ক্লিপবোর্ডে কপি হয়েছে!',
      copy: 'কপি',
      regenerate: 'পুনরায় তৈরি করুন',
      export: 'নোটবুক এক্সপোর্ট',
      settings: 'সেটিংস',
      guestUser: 'গেস্ট লার্নার',
      searchPlaceholder: 'কথোপকথন খুঁজুন...',
    },
    nav: {
      learningTools: 'লার্নিং টুলস',
      diagnosticQuiz: 'ডায়াগনস্টিক কুইজ',
      teachBackLab: 'টিচ-ব্যাক ল্যাব',
      savedNotebook: 'সংরক্ষিত নোটবুক',
      chatHistory: 'সাম্প্রতিক চ্যাট',
      noHistory: 'কোনো সাম্প্রতিক চ্যাট নেই',
      today: 'আজ',
      yesterday: 'গতকাল',
      previous7Days: 'বিগত ৭ দিন',
      older: 'পূর্ববর্তী',
      keyboardShortcut: '⌘K',
      profile: 'অ্যাকাউন্ট প্রোফাইল',
      language: 'ভাষা',
      theme: 'থিম',
      light: 'লাইট',
      dark: 'ডার্ক',
      system: 'সিস্টেম',
    },
    emptyState: {
      greetingMorning: 'শুভ সকাল',
      greetingAfternoon: 'শুভ অপরাহ্ন',
      greetingEvening: 'শুভ সন্ধ্যা',
      greetingNight: 'শুভ রাত্রি',
      subheading: 'আজ কী শিখতে চান? গণিত, বিজ্ঞান, কোডিং বা যেকোনো জটিল বিষয়ের গভীরে প্রবেশ করুন।',
      card1Category: 'গণিত',
      card1Title: 'দ্বিঘাত সমীকরণ সমাধান',
      card1Desc: 'ax² + bx + c = 0 সূত্রের ধাপে ধাপে স্পষ্ট প্রতিপাদন ও জ্যামিতিক ব্যাখ্যা।',
      card1Prompt: 'দ্বিঘাত সমীকরণের সূত্রটি (ax² + bx + c = 0) কীভাবে পূর্ণবর্গ করার নিয়মে প্রতিপাদন করা যায়, তা প্রতিটি ধাপের জ্যামিতিক তাৎপর্যসহ বুঝিয়ে বলো।',
      card2Category: 'পদার্থবিজ্ঞান',
      card2Title: 'নিউটনের ৩য় গতিসূত্র',
      card2Desc: 'ক্রিয়া-প্রতিক্রিয়া বল কেন গতির সময় একে অপরকে কাটাকাটি করে না।',
      card2Prompt: 'নিউটনের ৩য় সূত্র অনুযায়ী ক্রিয়া ও প্রতিক্রিয়া বল সমান ও বিপরীতমুখী হওয়া সত্ত্বেও কেন একে অপরকে নিষ্ক্রিয় করে না? স্পষ্ট উদাহরণ দিয়ে বোঝাও।',
      card3Category: 'জীববিজ্ঞান',
      card3Title: 'সালোকসংশ্লেষণ সহজে বুঝাও',
      card3Desc: 'আলোক বিক্রিয়া, থাইলাকয়েডে প্রোটন গ্রেডিয়েন্ট ও এটিপি তৈরির কৌশল।',
      card3Prompt: 'সালোকসংশ্লেষণের আলোক-নির্ভর বিক্রিয়ায় কীভাবে ইলেকট্রন প্রবাহ ও প্রোটন গ্রেডিয়েন্টের মাধ্যমে ATP এবং NADPH উৎপন্ন হয় তা সহজ বাস্তব উপমায় বোঝাও।',
      card4Category: 'প্রোগ্রামিং',
      card4Title: 'পাইথনে রিকার্শন (Recursion)',
      card4Desc: 'কল-স্ট্যাক কীভাবে মেমরিতে কাজ করে তা সাধারণ উদাহরণ দিয়ে বুঝাও।',
      card4Prompt: 'পাইথনে রিকার্শন ও কল-স্ট্যাক মেমরি মেকানিক্স কীভাবে কাজ করে তা ফিবোনাচ্চি বা সাধারণ বাস্তব উদাহরণ দিয়ে ধাপে ধাপে বিশ্লেষণ করো।',
    },
    composer: {
      placeholder: 'যেকোনো প্রশ্ন লিখুন বা টুল মেনশন করতে @ চাপুন...',
      tutorMode: 'সুক্রেটিক টিউটর',
      fastMode: 'দ্রুত উত্তর',
      deepMode: 'গভীর বিশ্লেষণ',
      socraticMode: 'সুক্রেটিক ডায়ালগ',
      stepByStepMode: 'ধাপে ধাপে ব্যাখ্যা',
      attachFile: 'ছবি / ডকুমেন্ট আপলোড',
      voiceInput: 'ভয়েস ডিকটেশন',
      listening: 'শুনছি...',
      send: 'পাঠান',
      stop: 'থামুন',
      disclaimer: 'থিঙ্কওয়াইজ এআই ভুল করতে পারে। গুরুত্বপূর্ণ একাডেমিক তথ্য যাচাই করুন।',
      toolsMention: 'যেকোনো টুল বা কনটেক্সট @মেনশন করো...',
    },
    tools: {
      quizTitle: 'ডায়াগনস্টিক মূল্যায়ন',
      quizDesc: 'নির্দিষ্ট বিষয়ের ওপর কুইজ দিয়ে তাৎক্ষণিক ভুল ধারণা চিহ্নিত করুন।',
      quizTopicPlaceholder: 'বিষয় বা কনসেপ্ট লিখুন (যেমন: জৈব রসায়ন, লিনিয়ার অ্যালজেব্রা)...',
      startQuiz: 'কুইজ শুরু করুন',
      teachBackTitle: 'ফাইনম্যান টিচ-ব্যাক ল্যাব',
      teachBackDesc: 'নিজের ভাষায় কনসেপ্টটি ব্যাখ্যা করুন। এআই আপনার দুর্বল দিকগুলো নির্দেশ করবে।',
      teachBackTopicPlaceholder: 'যে বিষয়টি পড়াতে চান (যেমন: ব্যাকপ্রপাগেশন, অভিস্রবণ)...',
      startTeachBack: 'টিচ-ব্যাক শুরু করুন',
      notebookTitle: 'কনসেপ্ট নোটবুক',
      notebookDesc: 'আপনার সংরক্ষিত গুরুত্বপূর্ণ পয়েন্ট, সূত্র ও ব্যাখ্যা।',
      noNotes: 'এখনও কোনো নোট সংরক্ষিত নেই।',
    },
    settings: {
      title: 'পছন্দ ও সেটিংস',
      general: 'সাধারণ',
      persona: 'টিউটর ধরণ',
      data: 'ডেটা ও স্টোরেজ',
      about: 'সম্পর্কে',
      languageTitle: 'প্রদর্শনী ও উত্তরের ভাষা',
      languageDesc: 'আপনার পছন্দের ভাষা নির্বাচন করুন (English অথবা বাংলা)।',
      themeTitle: 'অ্যাপের রূপ (Theme)',
      themeDesc: 'লাইট, ডার্ক অথবা সিস্টেম সেটিংসে পরিবর্তন করুন।',
      tutorStyle: 'শেখানোর পদ্ধতি',
      tutorStyleDesc: 'এআই কীভাবে আপনাকে সাহায্য করবে তা নির্বাচন করুন।',
      socraticIntuition: 'সুক্রেটিক পদ্ধতি (প্রশ্নোত্তরের মাধ্যমে বোঝানো)',
      directSolver: 'সরাসরি উত্তর (সংক্ষিপ্ত ও স্পষ্ট সমাধান)',
      rigorousAcademic: 'গবেষণামূলক ও কাঠামোগত প্রমাণ',
      clearData: 'হিস্ট্রি মুছে ফেলুন',
      clearDataConfirm: 'আপনি কি নিশ্চিত যে সমস্ত ক্যাশড ডেটা মুছে ফেলতে চান?',
    },
    auth: {
      signInTitle: 'থিঙ্কওয়াইজ এআই-তে স্বাগতম',
      signUpTitle: 'নতুন অ্যাকাউন্ট তৈরি করুন',
      signInDesc: 'আপনার স্টাডি নোট এবং কুইজ হিস্ট্রি সিঙ্ক করতে সাইন-ইন করুন।',
      signUpDesc: 'হাজারো শিক্ষার্থীর সাথে যোগ দিন এবং জটিল বিষয়গুলো সহজে আয়ত্ত করুন।',
      emailLabel: 'ইমেইল অ্যাড্রেস',
      passwordLabel: 'পাসওয়ার্ড',
      nameLabel: 'সম্পূর্ণ নাম',
      submitSignIn: 'সাইন-ইন',
      submitSignUp: 'অ্যাকাউন্ট তৈরি করুন',
      googleSignIn: 'Google দিয়ে চালিয়ে যান',
      continueAsGuest: 'গেস্ট হিসেবে চালিয়ে যান',
      noAccount: 'অ্যাকাউন্ট নেই? সাইন-আপ করুন',
      hasAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন-ইন করুন',
    },
  },
};
