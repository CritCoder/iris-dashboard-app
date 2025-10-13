export interface Organization {
  id: number
  category: string
  name: string
  totalMembers: number
  topInfluencers: string[]
  socialMedia: {
    facebook: string | null
    twitter: string | null
    instagram: string | null
    youtube: string | null
  }
  contact: {
    physicalAddress: string | null
    phoneNumber: string | null
    email: string | null
    website: string | null
  }
}

export const organizationsData: Organization[] = [
  // Existing Hindu Nationalist Organizations (IDs 1-10)
  {
    id: 1,
    category: "Hindu Nationalist Organizations",
    name: "ಕಠೋರ ಹಿಂದುತ್ವವಾದಿಗಳು ಹಿಂದೂ ಜಾಗೃತಿ ಸೇನೆ",
    totalMembers: 3543,
    topInfluencers: [
      "Shivbhagath Bhagathsingh",
      "ಕೆಂಪೇಗೌಡ ಒಕ್ಕಲಿಗರ ಮೀಸಲಾತಿ ಹೋರಾಟ ಸಮಿತಿ(Admin)",
      "Vinaygowda"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/481726962295310/?ref=share",
      twitter: null,
      instagram: "https://www.instagram.com/hindhu_jagruthii_sene/",
      youtube: null
    },
    contact: {
      physicalAddress: "Yalahanka",
      phoneNumber: "1919381307652",
      email: "rg065726@gmail.com",
      website: null
    }
  },
  {
    id: 2,
    category: "Hindu Nationalist Organizations",
    name: "ಅಖಿಲಾ ಕರ್ನಾಟಕ ಹಿಂದೂ ಸಾಮ್ರಾಟ್ ಶಿವಾಜಿ ಸೇನಾ",
    totalMembers: 100,
    topInfluencers: [
      "Parashuram Segurkar (Admin1)",
      "Ambaresh Hindu (Admin2)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/503501497182282/members",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Yadagiri",
      phoneNumber: "9449477555",
      email: null,
      website: null
    }
  },
  {
    id: 3,
    category: "Hindu Nationalist Organizations",
    name: "ಬಲಿಷ್ಠ ಹಿಂದೂರಾಷ್ಟ್ರ",
    totalMembers: 19905,
    topInfluencers: [
      "Sharath Chandra"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/126680487914954/members",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 4,
    category: "Hindu Nationalist Organizations",
    name: "ಕೇಸರಿ ಭಾರತ",
    totalMembers: 83906,
    topInfluencers: [
      "Raghavendra Reddy"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1578203138931997/members",
      twitter: null,
      instagram: "https://www.instagram.com/kesari_bharata/",
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 5,
    category: "Hindu Nationalist Organizations",
    name: "ಹಿಂದೂ ರಾಷ್ಟ್ರ",
    totalMembers: 4567,
    topInfluencers: [
      "Mantesh M"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/3522107411173491/members",
      twitter: "https://twitter.com/GlobalHindu",
      instagram: "https://www.instagram.com/hindu._.rastra/",
      youtube: null
    },
    contact: {
      physicalAddress: "Vijaypura",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 6,
    category: "Hindu Nationalist Organizations",
    name: "ಜಯತು ಸನಾತನ ರಾಷ್ಟ್ರ",
    totalMembers: 1767,
    topInfluencers: [
      "Anil Kumar SV (Admin1)",
      "Anil Sv Gowda's(Admin2)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1217587278614217/?ref=share",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: "anilsv106@gmail.com",
      website: null
    }
  },
  {
    id: 7,
    category: "Hindu Nationalist Organizations",
    name: "ಹಿಂದೂ ಹುಲಿ ಬಸನಗೌಡ ಪಾಟೀಲ ಅಭಿಮಾನಿಗಳು",
    totalMembers: 9141,
    topInfluencers: [
      "Hanamant Yamagar(Admin1)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1592825204237356/members",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Jamakandi",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 8,
    category: "Hindu Nationalist Organizations",
    name: "ಯೋಗಿಜೀ ಫ್ಯಾನ್ಸ್ ಕರ್ನಾಟಕ",
    totalMembers: 30892,
    topInfluencers: [
      "Mahesh Vikram Hegde",
      "India with Modi(Admin)"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/410546292958298",
      twitter: null,
      instagram: "https://www.instagram.com/yogiji_ni_moj/",
      youtube: null
    },
    contact: {
      physicalAddress: "Bengaluru",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 9,
    category: "Hindu Nationalist Organizations",
    name: "ನರೇಂದ್ರ ಮೋದಿ ಅಭಿಮಾನಿಗಳು ಕರ್ನಾಟಕ.",
    totalMembers: 99106,
    topInfluencers: [
      "Modi fans for karunadu"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/2114701415476878/members",
      twitter: null,
      instagram: "https://www.instagram.com/narendra_modi_fns_club_karnatk/",
      youtube: null
    },
    contact: {
      physicalAddress: "Mangalore",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 10,
    category: "Hindu Nationalist Organizations",
    name: "Postcard ಕನ್ನಡ",
    totalMembers: 156388,
    topInfluencers: [
      "Mahesh Vikram Hegade"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/PostcardKanada",
      twitter: "https://twitter.com/PostcardKannada",
      instagram: "https://www.instagram.com/postcard_news/",
      youtube: null
    },
    contact: {
      physicalAddress: "Mangalore",
      phoneNumber: null,
      email: null,
      website: null
    }
  },

  // Student Organizations (IDs 11-20)
  {
    id: 11,
    category: "Student Organizations",
    name: "All India Student Federation Karnataka (AISF)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/AISF-Karnataka-316228082538407/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 12,
    category: "Student Organizations",
    name: "All India Youth Federation (AIYF)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/AIYFKarnataka10/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 13,
    category: "Student Organizations",
    name: "Ignite - All Karnataka Engineering Students Association",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/IgniteAKESA/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 14,
    category: "Student Organizations",
    name: "Karnataka Engineers Association - KEA",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Karnataka-Engineers-Association-KEA-114279496609935/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 15,
    category: "Student Organizations",
    name: "ABVP (Akhil Bharatiya Vidyarthi Parishad)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/ABVPVOICE",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 16,
    category: "Student Organizations",
    name: "SFI Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/sfikarnatakastatecommittee/?ref=page_internal",
      twitter: "https://twitter.com/SfiKarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "No 12, 2nd Floor, 18th cross, Sampangiramanagara, Bangalore - 560027",
      phoneNumber: "97417 16864",
      email: "sfikarnataka1970@gmail.com",
      website: "http://www.sfikarnataka.wordpress.com/"
    }
  },
  {
    id: 17,
    category: "Student Organizations",
    name: "AIDSO Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/aidsokarnatakaofficial/",
      twitter: "https://twitter.com/KarnatakaAidso?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "#31, 3rd cross, Malleshwaram, Bangalore - 560003",
      phoneNumber: "88610 28159",
      email: "aidsokarnataka@gmail.com",
      website: "http://www.aidso.in/"
    }
  },
  {
    id: 18,
    category: "Student Organizations",
    name: "SSF Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/ssfkarnataka/?ref=page_internal",
      twitter: "https://twitter.com/ssfkarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "http://www.ssfkarnataka.com/"
    }
  },
  {
    id: 19,
    category: "Student Organizations",
    name: "Campus Front of India Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaCampusFront",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 20,
    category: "Youth Organizations",
    name: "KVS - Karnataka Vidyarthi Sanghatane",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KVS4BetterWorld/?ref=page_internal",
      twitter: "https://twitter.com/kvs_karnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Vijaya nagar, Hosalli Main Road, Bangalore - 560041",
      phoneNumber: "96868 42196",
      email: "kvsmailbox2@gmail.com",
      website: "https://kvsmailbox2.wixsite.com/kvs4betterworld"
    }
  },

  // Political Organizations (IDs 21-35)
  {
    id: 21,
    category: "Political Organizations",
    name: "Indian National Congress - Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/INCKarnataka/?ref=page_internal",
      twitter: "https://twitter.com/INCKarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Karnataka Pradesh Congress Committee, Queens Road, Bangalore - 560 001",
      phoneNumber: "91-80-22250651",
      email: "natarajgowdakpcc@gmail.com",
      website: "http://www.karnatakapcc.com/"
    }
  },
  {
    id: 22,
    category: "Political Organizations",
    name: "BJP Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/BJP4Karnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "karnataka.bjp.org"
    }
  },
  {
    id: 23,
    category: "Political Organizations",
    name: "SDPI Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/SDPIKarnatakaOfficial/?ref=page_internal",
      twitter: "https://twitter.com/sdpikarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "SF 14C, Dignity Center, Hameed Shah Complex, Near-Ulsur Gate, Cubbonpet Main Rd, Bengaluru, Karnataka 560002",
      phoneNumber: "080 2222 2346",
      email: "sdpikarnataka@gmail.com",
      website: "http://sdpikarnataka.in/"
    }
  },
  {
    id: 24,
    category: "Political Organizations",
    name: "CPIM Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/CPIM-Karnataka-676308822425477/?ref=page_internal",
      twitter: "https://twitter.com/cpimkarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "EMS BHAVANA, No. 37/A, 8th cross, Mahalakashmi Layout, Bangalore - 560 086",
      phoneNumber: "80-23496462",
      email: "cpimkar@gmail.com",
      website: "http://cpimkarnataka.org/"
    }
  },
  {
    id: 25,
    category: "Political Organizations",
    name: "Popular Front of India - Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/PopularfrontKarnataka/?ref=page_internal",
      twitter: "https://twitter.com/PFIkarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Deccan House, Bangalore - 570001",
      phoneNumber: "80 3295 7534",
      email: "popularfrontmail@gmail.com",
      website: "http://www.popularfrontindia.org/"
    }
  },
  {
    id: 26,
    category: "Political Organizations",
    name: "JD(S) Bengaluru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/JDS_Bengaluru?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "jds.ind.in"
    }
  },
  {
    id: 27,
    category: "Political Organizations",
    name: "JDS State IT Wing",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/JDS_ITWing?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "jds.ind.in"
    }
  },
  {
    id: 28,
    category: "Political Organizations",
    name: "RKS Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/RKS-Karnataka-111959427192511/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Malleswaram 31, 3rd cross, Bangalore - 560003",
      phoneNumber: "98801 31556",
      email: "rkskarnataka@gmail.com",
      website: "http://www.aikkms.com/"
    }
  },
  {
    id: 29,
    category: "Political Organizations",
    name: "KRS Party Bengaluru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/krspartybengaluru/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "86184 03123",
      email: "swamibyrathy@gmail.com",
      website: "http://www.krsparty.org/"
    }
  },
  {
    id: 30,
    category: "Political Organizations",
    name: "Karnataka Rashtra Samithi",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/krs_party?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 31,
    category: "Political Organizations",
    name: "Aam Aadmi Party Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/AamAadmiPartyKarnataka",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "1675 - 1st floor, HAL 3rd Stage, New Tippasandra - 560075",
      phoneNumber: null,
      email: "contact@aapkarnataka.org",
      website: "http://karnataka.aamaadmiparty.org/"
    }
  },
  {
    id: 32,
    category: "Political Organizations",
    name: "AAP Bangalore",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/AamAadmiPartyBangalore",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "074120 42042",
      email: "aap4bbmp@aapkarnataka.org",
      website: "https://www.bbmp.aamaadmiparty.org/"
    }
  },
  {
    id: 33,
    category: "Political Organizations",
    name: "Swaraj Abhiyan Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/SwarajAbhiyanKA?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "http://swarajabhiyan.org"
    }
  },
  {
    id: 34,
    category: "Political Organizations",
    name: "Karnataka Pradesh Mahila Congress",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/KarnatakaPMC?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 35,
    category: "Political Organizations",
    name: "AIPF Bengaluru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/AIPFblr?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },

  // Cultural & Social Organizations (IDs 36-60)
  {
    id: 36,
    category: "Cultural Organizations",
    name: "Karnataka Rakshana Vedike",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRakshanaVedike/?ref=page_internal",
      twitter: "https://twitter.com/karave_KRV?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "80 2237 0032",
      email: null,
      website: "http://www.karnatakarakshanavedike.org/"
    }
  },
  {
    id: 37,
    category: "Cultural Organizations",
    name: "Karnataka Itihasa Academy",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaItihasaAcademy",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 38,
    category: "Cultural Organizations",
    name: "Kannada Kattuva Kelasa",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/kannadakattuvakelasa/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "79756 25575",
      email: null,
      website: null
    }
  },
  {
    id: 39,
    category: "Cultural Organizations",
    name: "Kannadiga",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Kannadigaru/?ref=page_internal",
      twitter: "https://twitter.com/Kannadiga71?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: "admin@kannadiga.co.in",
      website: "https://karnataka.xn--nsce3a1aa3lxd.com/"
    }
  },
  {
    id: 40,
    category: "Government Organizations",
    name: "ಕನ್ನಡ ಅಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ (Kannada Development Authority)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100006043816127",
      twitter: "https://twitter.com/kdabengaluru?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "ವಿಧಾನಸೌಧ ಬೆಂಗಳೂರು",
      phoneNumber: null,
      email: null,
      website: "https://kannadapraadhikaara.karnataka.gov.in/"
    }
  },
  {
    id: 41,
    category: "Cultural Organizations",
    name: "Kannada Grahakara Koota (KGK)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/KannadaGrahaka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "kannadagrahakarakoota.org"
    }
  },
  {
    id: 42,
    category: "Social Organizations",
    name: "Sakala Maratha Samaj Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1116003755465178/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 43,
    category: "Social Organizations",
    name: "Akhila Karnataka Kshatriya Samaj",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/kakshatriya/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Mahalakshmi Layout, Bangalore - 560010",
      phoneNumber: "98865 10009",
      email: null,
      website: "http://Kshatriyasamaja.org/"
    }
  },
  {
    id: 44,
    category: "Social Organizations",
    name: "SSK Samaj Seva Samiti",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/SSKSamajSevaSamiti",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "098865 10009",
      email: null,
      website: "http://www.ssksamaj.org/"
    }
  },
  {
    id: 45,
    category: "Social Organizations",
    name: "Karnataka Rajya Savita Samaj",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRajyaSavitaSamaj",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 46,
    category: "Social Service Organizations",
    name: "Karunada Sevakaru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarunadaSevakaruofficial/?ref=page_internal",
      twitter: "https://twitter.com/KSevakaru?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "karunadasevakaru.org"
    }
  },
  {
    id: 47,
    category: "Social Service Organizations",
    name: "Karnataka Janaseva Trust",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaJanasevaTrust",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "96866 33888",
      email: "karnataka.jsto@gmail.com",
      website: "http://www.kjst.org/"
    }
  },
  {
    id: 48,
    category: "Social Organizations",
    name: "Gauri Lankesh Balaga",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/337106830285378/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 49,
    category: "Media Organizations",
    name: "Gauri Memorial Trust",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/gaurimemorialtrust",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 50,
    category: "Social Organizations",
    name: "Bhumi-Vasati Hakku Vanchitara Horata Samiti",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/bvhvhs",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 51,
    category: "Social Organizations",
    name: "Kalpataru Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KalpataruKarnataka",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 52,
    category: "Social Organizations",
    name: "Namma Nada Rakshana Vedike",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/NammaNadaRakshanaVedike",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "98861 45548",
      email: null,
      website: null
    }
  },
  {
    id: 53,
    category: "Social Organizations",
    name: "Jai Karunada Rakshana Vedike",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/JaiKarunadaRakshanaVedike",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "86608 69923",
      email: null,
      website: null
    }
  },
  {
    id: 54,
    category: "Social Organizations",
    name: "Karnataka Janashakthi",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/JanashakthiSanghatane/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: "karnatakajanashakthi@gmail.com",
      website: null
    }
  },
  {
    id: 55,
    category: "Social Organizations",
    name: "Lanchamukta Karnataka Nirmana Vedike",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/lanchamukta?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 56,
    category: "Youth Organizations",
    name: "Yuva Bharat Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/YuvaBharatKA/?ref=page_internal",
      twitter: "https://twitter.com/YuvaBharatKAR?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: "yuvabharatka@gmail.com",
      website: null
    }
  },
  {
    id: 57,
    category: "Social Organizations",
    name: "Nanna Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/Nanna_Karnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 58,
    category: "Social Organizations",
    name: "Namma Bhoomi Namma Bharata",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/nammurabhoomi?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 59,
    category: "Social Organizations",
    name: "Aikya Horata",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/aikyahorata?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 60,
    category: "Religious Organizations",
    name: "Ashirvad Social Concern",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/AshirvadSocial?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },

  // Worker & Labor Organizations (IDs 61-80)
  {
    id: 61,
    category: "Worker Organizations",
    name: "CITU Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/CITU-Karnataka-114903890416850/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 62,
    category: "Worker Organizations",
    name: "AICCTU Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/aicctukar?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 63,
    category: "Worker Organizations",
    name: "AITUC Bangalore",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/bangaloreaituc/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "80 2344 7407",
      email: "aituc.bangalore@gmail.com",
      website: "http://aitucbangalore.wordpress.com/"
    }
  },
  {
    id: 64,
    category: "Worker Organizations",
    name: "Karnataka Rajya Anganawadi Naukarara Sangha - CITU",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRajyaAnganawadiNaukararanSangha",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "984-589-3019",
      email: "karnatakaanganawadi@gmail.com",
      website: null
    }
  },
  {
    id: 65,
    category: "Worker Organizations",
    name: "Karmika Drushtikona",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/karmikadrushtikona/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: "http://sucicommunist.org/"
    }
  },
  {
    id: 66,
    category: "Worker Organizations",
    name: "Karnataka Sarkari Guttage Naukarara Mahaokkuta",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Vote4SecuredJobs/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "89049 51002",
      email: null,
      website: null
    }
  },
  {
    id: 67,
    category: "Worker Organizations",
    name: "Karnataka Rajya Aarogya Ilakhe Guttage Naukarara Sangha",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRajyaAarogyaIlakhe",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "096111 21360",
      email: "kshcoea@gmail.com",
      website: "http://kshcoea.com/member/"
    }
  },
  {
    id: 68,
    category: "Worker Organizations",
    name: "Karnataka Rajya Raste Sarige Naukarara Okkuta",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/397157587318557/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 69,
    category: "Worker Organizations",
    name: "KSRTC Kannada Geleyara Okkuta",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/ksrtckannada/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "90367 68610",
      email: null,
      website: null
    }
  },
  {
    id: 70,
    category: "Worker Organizations",
    name: "Namma Chalakara Trade Union",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/nammachalakaratradeunion",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 71,
    category: "Worker Organizations",
    name: "Karnataka Rajya Sarkari Naukarara Sangha",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRajyaSarkariNaukarara",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Cubbon Park, Bangalore",
      phoneNumber: "99022 12133",
      email: "ksgea.bng@gmail.com",
      website: "http://www.ksgea.in/"
    }
  },
  {
    id: 72,
    category: "Worker Organizations",
    name: "Raita Mattu Karmika Rakshana Vedike",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/397157587318557/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 73,
    category: "Worker Organizations",
    name: "Karnataka Yuva Karmi",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaYuvaKarmi",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 74,
    category: "Worker Organizations",
    name: "Karnataka Karmikara Rakshana Vedike",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaKarmikaraRakshanaVedike",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "9840064677",
      email: null,
      website: null
    }
  },
  {
    id: 75,
    category: "Worker Organizations",
    name: "Railway Khaasageekarana Virodhi Abhiyana-Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/RailwayKhaasageekaranaVirodhiAbhiyana",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "94480 40940",
      email: "stoprailwayprivatisation@gmail.com",
      website: null
    }
  },
  {
    id: 76,
    category: "Worker Organizations",
    name: "AIMSS Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/AIMSS-Karnataka-1082036815269773/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "98441 12293",
      email: null,
      website: null
    }
  },
  {
    id: 77,
    category: "Youth Organizations",
    name: "AIDYO Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/AidyoKarnataka?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 78,
    category: "Worker Organizations",
    name: "Karnataka Shramika Shakthi",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/karnatakashramikashakthi",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 79,
    category: "Social Organizations",
    name: "Annada Runa",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/AnnadaRuna",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 80,
    category: "Worker Organizations",
    name: "Karnataka Janashakthi DVG",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaJanashakthiDVG",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },

  // Farmer & Education Organizations (IDs 81-95)
  {
    id: 81,
    category: "Farmer Organizations",
    name: "Karnataka Rajya Raitha Sangha - KRRS",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRajyaRaithaSanghaHasiruSene/?ref=page_internal",
      twitter: "https://twitter.com/KaRaRaiSangha?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: "info@krrs.org",
      website: "https://krrs.org/"
    }
  },
  {
    id: 82,
    category: "Farmer Organizations",
    name: "Raitara Makkalu",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/RaitaraMakkalu",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 83,
    category: "Farmer Organizations",
    name: "Raitana Dhvani",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/RaitanaDhvani",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 84,
    category: "Farmer Organizations",
    name: "Pragati Raita Sangha",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/PragatiRaitaSangha",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 85,
    category: "Farmer Organizations",
    name: "Samyukta Horata Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/watch/SamyuktaHorataKarnataka/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 86,
    category: "Education Organizations",
    name: "Sarkari Shalegala Unnatikarna Andolana Samiti",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/SarkariShaleUnnatikarna",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "95389 98816",
      email: "arvindbk1984@gmail.com",
      website: null
    }
  },
  {
    id: 87,
    category: "Education Organizations",
    name: "Karnataka Rajya Khassagi Shala Shikshakara Sangha",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/groups/1546791282167067/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 88,
    category: "Education Organizations",
    name: "Athithi Shikshakara Samuha - Karnataka",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/guestteacherskarnataka/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "812-342-1490",
      email: null,
      website: null
    }
  },
  {
    id: 89,
    category: "Education Organizations",
    name: "Karnataka Rajya Sarkari Shala Shikshakaru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarnatakaRajyaSarkariShalaShikshakaru",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 90,
    category: "Education Organizations",
    name: "Samana Shikshana",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/samanashikshana",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 91,
    category: "Media Organizations",
    name: "Janashakthi Pustaka Mane Mandya",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/JanashakthiPustakaMane",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 92,
    category: "Media Organizations",
    name: "Post The Card",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/PostTheCard",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 93,
    category: "Media Organizations",
    name: "Hosadiga ntha",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/hosadiganthaonline",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 94,
    category: "Women Organizations",
    name: "Mahila Munnade",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/mahilamunnade/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "99455 18312",
      email: "munnademahilapathrike@gmail.com",
      website: null
    }
  },
  {
    id: 95,
    category: "Women Organizations",
    name: "All India Progressive Women's Association (AIPWA)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: null,
      twitter: "https://twitter.com/AllINDIAPROGRE2?s=20",
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },

  // Religious & Media Organizations (IDs 96-110)
  {
    id: 96,
    category: "Religious Organizations",
    name: "Valmiki Brahmananda Swamiji",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Valmiki-Brahmananda-Swamiji-220773168415777/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "83104 83873",
      email: null,
      website: "http://www.valmikiswamiji.com/"
    }
  },
  {
    id: 97,
    category: "Media Organizations",
    name: "Karunada Muslimaru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KarunadaMuslimaru",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 98,
    category: "Media Organizations",
    name: "Kannadamanasgalu",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/kannadamanasgal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 99,
    category: "Media Organizations",
    name: "Kannada Manasugalu",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/kannadaManasugalu18",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 100,
    category: "Media Organizations",
    name: "Marapanna Angadi",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/MarappanaAngadi",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 101,
    category: "Media Organizations",
    name: "Aha Yen Guru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/YenGuru007/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 102,
    category: "Media Organizations",
    name: "Dharwad People's Voice",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Dharwadpeoplevoice",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 103,
    category: "Media Organizations",
    name: "Kannada One News",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KannadaOneNews/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 104,
    category: "Media Organizations",
    name: "Kannada Media Web Portal",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/kannadamediawebportal/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 105,
    category: "Media Organizations",
    name: "Naavu Bharatheeyaru",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/naavubhaaratheeyaru",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 106,
    category: "Media Organizations",
    name: "Bharatada Pradani Janodrohi Aagabaradu",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/BharatadaPradaniJanodrohi",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 107,
    category: "Media Organizations",
    name: "Rost Card",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Rost-Card-179929792655850",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 108,
    category: "Student Organizations",
    name: "Dalit Vidhyarthi Parishat",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/DalitVidhyrthiParishat/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 109,
    category: "Youth Organizations",
    name: "Patriotic Youth Force",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/patrioticyouthforce",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 110,
    category: "Media Organizations",
    name: "KPRS",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/KPRS-440601696042572",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },

  // Individual Influencers & Activists (IDs 111-150)
  {
    id: 111,
    category: "Individual Activists",
    name: "Nagaraj Hettur",
    totalMembers: 0,
    topInfluencers: ["Nagaraj Hettur"],
    socialMedia: {
      facebook: "https://www.facebook.com/nagaraj.hettur.7",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "9110228083",
      email: null,
      website: null
    }
  },
  {
    id: 112,
    category: "Individual Activists",
    name: "Nagegowda Keelara Shivalingayya",
    totalMembers: 0,
    topInfluencers: ["Nagegowda Keelara Shivalingayya"],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=1668871181",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 113,
    category: "Individual Activists",
    name: "Mooka Nayaka",
    totalMembers: 0,
    topInfluencers: ["Mooka Nayaka"],
    socialMedia: {
      facebook: "https://www.facebook.com/nayakamooka",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 114,
    category: "Individual Activists",
    name: "Deepu Gowdru",
    totalMembers: 0,
    topInfluencers: ["Deepu Gowdru"],
    socialMedia: {
      facebook: "https://www.facebook.com/RoyalGowdru/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 115,
    category: "Individual Activists",
    name: "Muttu Raju",
    totalMembers: 0,
    topInfluencers: ["Muttu Raju"],
    socialMedia: {
      facebook: "https://www.facebook.com/muttu.raju.7",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 116,
    category: "Individual Activists",
    name: "Shiva Sundar",
    totalMembers: 0,
    topInfluencers: ["Shiva Sundar"],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100009460688828",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 117,
    category: "Individual Activists",
    name: "Naveen Soorinje",
    totalMembers: 0,
    topInfluencers: ["Naveen Soorinje"],
    socialMedia: {
      facebook: "https://www.facebook.com/naveen.shetty.16",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 118,
    category: "Individual Activists",
    name: "Meera Raghavendra",
    totalMembers: 0,
    topInfluencers: ["Meera Raghavendra"],
    socialMedia: {
      facebook: "https://www.facebook.com/meera.raghavendra.35",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 119,
    category: "Individual Activists",
    name: "VS Prashanth Sambargi",
    totalMembers: 0,
    topInfluencers: ["VS Prashanth Sambargi"],
    socialMedia: {
      facebook: "https://www.facebook.com/VS.Prashanth.Sambargi",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 120,
    category: "Individual Activists",
    name: "Murthy Byrappa",
    totalMembers: 0,
    topInfluencers: ["Murthy Byrappa"],
    socialMedia: {
      facebook: "https://www.facebook.com/murthybyrappa",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 121,
    category: "Individual Activists",
    name: "Minakshi Sudarshan",
    totalMembers: 0,
    topInfluencers: ["Minakshi Sudarshan"],
    socialMedia: {
      facebook: "https://www.facebook.com/meenakshi.sundaram.35",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 122,
    category: "Individual Activists",
    name: "Mavalli Shankar",
    totalMembers: 0,
    topInfluencers: ["Mavalli Shankar"],
    socialMedia: {
      facebook: "https://www.facebook.com/mavalli.shankar",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 123,
    category: "Individual Activists",
    name: "Mohammed Asif",
    totalMembers: 0,
    topInfluencers: ["Mohammed Asif"],
    socialMedia: {
      facebook: "https://www.facebook.com/asif.hssain.5",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 124,
    category: "Individual Activists",
    name: "Saleththuru Faizi",
    totalMembers: 0,
    topInfluencers: ["Saleththuru Faizi"],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100077509574158",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: "98455 98794",
      email: null,
      website: null
    }
  },
  {
    id: 125,
    category: "Individual Activists",
    name: "Sinan Chinnu",
    totalMembers: 0,
    topInfluencers: ["Sinan Chinnu"],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100083840176970",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 126,
    category: "Individual Activists",
    name: "Santhosh Bajal",
    totalMembers: 0,
    topInfluencers: ["Santhosh Bajal"],
    socialMedia: {
      facebook: "https://www.facebook.com/santhosh.kulal.3557",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Mangalore",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 127,
    category: "Individual Activists",
    name: "Akram Pasha",
    totalMembers: 0,
    topInfluencers: ["Akram Pasha"],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100054820544717",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 128,
    category: "Individual Activists",
    name: "Mahanayaka",
    totalMembers: 0,
    topInfluencers: ["Mahanayaka"],
    socialMedia: {
      facebook: "https://www.facebook.com/naufalmangalor",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 129,
    category: "Individual Activists",
    name: "Vijay Kumar Rao R",
    totalMembers: 0,
    topInfluencers: ["Vijay Kumar Rao R"],
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100067930157769",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 130,
    category: "Individual Activists",
    name: "Atull Kumar Sabharwal",
    totalMembers: 0,
    topInfluencers: ["Atull Kumar Sabharwal"],
    socialMedia: {
      facebook: "https://www.facebook.com/atullkumar.ahmsolution",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Madugiri",
      phoneNumber: "8722537609",
      email: null,
      website: null
    }
  },
  {
    id: 131,
    category: "Individual Activists",
    name: "Danish Dan AIMDF",
    totalMembers: 0,
    topInfluencers: ["Danish Dan"],
    socialMedia: {
      facebook: "https://www.facebook.com/mdk.dan.71",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: "Dubai, UAE / Mangalore",
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 132,
    category: "Media Activists",
    name: "Cartoonist PM",
    totalMembers: 0,
    topInfluencers: ["Cartoonist PM"],
    socialMedia: {
      facebook: "https://www.facebook.com/cartoonistpm",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 133,
    category: "Social Organizations",
    name: "Moola Kshaurikaru (Native Barbers)",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/MoolaKshaurikaru",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 134,
    category: "Media Organizations",
    name: "Al-Faiz Gulbarga",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/alfaizgulbarga/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 135,
    category: "Media Organizations",
    name: "Voice of Muslims",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/voiceofmuslimsss",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 136,
    category: "Student Organizations",
    name: "NSUI Karnataka State",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/NSUI.KarnatakaState/",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 137,
    category: "Political Organizations",
    name: "Mavalli Shankar Abhimani Balaga",
    totalMembers: 0,
    topInfluencers: ["Mavalli Shankar"],
    socialMedia: {
      facebook: "https://www.facebook.com/mavallishankarabhimanibalaga",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 138,
    category: "Cultural Organizations",
    name: "Boppanalli",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Boppanalli",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 139,
    category: "Social Organizations",
    name: "Bucket BJP",
    totalMembers: 0,
    topInfluencers: [],
    socialMedia: {
      facebook: "https://www.facebook.com/Bucketbjp/?ref=page_internal",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  },
  {
    id: 140,
    category: "Social Organizations",
    name: "Rupesh Rajanna - Kannada Endu Namma Sangada",
    totalMembers: 0,
    topInfluencers: ["Rupesh Rajanna"],
    socialMedia: {
      facebook: "https://www.facebook.com/rupesh.rajanna",
      twitter: null,
      instagram: null,
      youtube: null
    },
    contact: {
      physicalAddress: null,
      phoneNumber: null,
      email: null,
      website: null
    }
  }
]
