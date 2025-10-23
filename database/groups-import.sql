-- Groups Import SQL
-- Generated on 2025-10-23T15:04:53.354Z
-- Total groups: 100
-- 
-- IMPORTANT: Review this SQL before running against your database
-- Make sure you have a backup of your database before proceeding
--


-- Create groups table if not exists
CREATE TABLE IF NOT EXISTS groups (
  id VARCHAR(255) PRIMARY KEY,
  name TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  members INTEGER DEFAULT 0,
  platforms JSONB,
  primary_platform VARCHAR(50),
  description TEXT,
  risk_level VARCHAR(20) NOT NULL,
  category VARCHAR(100),
  location TEXT,
  contact_info JSONB,
  social_media JSONB,
  influencers TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  monitoring_enabled BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_type ON groups(type);
CREATE INDEX IF NOT EXISTS idx_groups_risk_level ON groups(risk_level);
CREATE INDEX IF NOT EXISTS idx_groups_category ON groups(category);
CREATE INDEX IF NOT EXISTS idx_groups_monitoring ON groups(monitoring_enabled);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);


INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_1',
  'ಕಠೋರ ಹಿಂದುತ್ವವಾದಿಗಳು ಹಿಂದೂ ಜಾಗೃತಿ ಸೇನೆ',
  'religious',
  3543,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'high',
  'Hindu Organizations',
  'Yalahanka',
  '{"phone":"1919381307652","email":"Linked E-Mail ID\nrg065726@gmail.com"}',
  '{"facebook":"https://www.facebook.com/groups/481726962295310/?ref=share","twitter":null,"instagram":"https://www.instagram.com/hindhu_jagruthii_sene/","youtube":null}',
  'https://www.facebook.com/groups/481726962295310/user/100046617692917/Shivbhagath Bhagathsingh
ಕೆಂಪೇಗೌಡ ಒಕ್ಕಲಿಗರ ಮೀಸಲಾತಿ ಹೋರಾಟ ಸಮಿತಿ(Admin)
Vinaygowda',
  '2025-10-23T15:04:53.347Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_2',
  'ಅಖಿಲಾ ಕರ್ನಾಟಕ ಹಿಂದೂ ಸಾಮ್ರಾಟ್ ಶಿವಾಜಿ ಸೇನಾ',
  'political',
  100,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'high',
  'Hindu Organizations',
  'Yadagiri',
  '{"phone":"9449477555","email":null}',
  '{"facebook":"https://www.facebook.com/groups/503501497182282/members","twitter":null,"instagram":null,"youtube":null}',
  'Parashuram Segurkar (Admin1)
Ambaresh Hindu (Admin2)',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_3',
  'ಬಲಿಷ್ಠ ಹಿಂದೂರಾಷ್ಟ್ರ',
  'religious',
  19905,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Bengaluru',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/126680487914954/members","twitter":null,"instagram":null,"youtube":null}',
  'Sharath Chandra',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_4',
  'ಕೇಸರಿ ಭಾರತ',
  'other',
  83906,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Bengaluru',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/1578203138931997/members","twitter":null,"instagram":"https://www.instagram.com/kesari_bharata/","youtube":null}',
  'Raghavendra Reddy',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_5',
  'ಹಿಂದೂ ರಾಷ್ಟ್ರ',
  'religious',
  4567,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Vijaypura',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/3522107411173491/members","twitter":"https://twitter.com/GlobalHindu","instagram":"https://www.instagram.com/hindu._.rastra/","youtube":null}',
  'Mantesh M',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_6',
  'ಜಯತು ಸನಾತನ ರಾಷ್ಟ್ರ',
  'religious',
  1767,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Bengaluru',
  '{"phone":null,"email":"anilsv106@gmail.com"}',
  '{"facebook":"https://www.facebook.com/groups/1217587278614217/?ref=share","twitter":null,"instagram":null,"youtube":null}',
  'Anil Kumar SV (Admin1)
Anil Sv Gowda''s(Admin2)',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_7',
  'ಹಿಂದೂ ಹುಲಿ ಬಸನಗೌಡ ಪಾಟೀಲ ಅಭಿಮಾನಿಗಳು',
  'religious',
  9141,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'high',
  'Hindu Organizations',
  'Jamakandi',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/1592825204237356/members","twitter":null,"instagram":null,"youtube":null}',
  'Hanamant Yamagar(Admin1)',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_8',
  'ಯೋಗಿಜೀ ಫ್ಯಾನ್ಸ್ ಕರ್ನಾಟಕ',
  'political',
  30892,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Bengaluru',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/410546292958298","twitter":null,"instagram":"https://www.instagram.com/yogiji_ni_moj/","youtube":null}',
  'Mahesh Vikram Hegde                  and India with Modi(Admin)',
  '2025-10-23T15:04:53.348Z',
  '2025-10-23T15:04:53.348Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_9',
  'ನರೇಂದ್ರ ಮೋದಿ ಅಭಿಮಾನಿಗಳು ಕರ್ನಾಟಕ.',
  'political',
  99106,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Mangalore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2114701415476878/members","twitter":null,"instagram":"https://www.instagram.com/narendra_modi_fns_club_karnatk/","youtube":null}',
  'Modi fans for karunadu',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_10',
  'Postcard ಕನ್ನಡ',
  'other',
  156388,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Mangalore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/PostcardKanada","twitter":"https://twitter.com/PostcardKannada","instagram":"https://www.instagram.com/postcard_news/","youtube":null}',
  'Mahesh Vikram Hegade',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_11',
  'ಕರ್ನಾಟಕ 🚩ಬಿಜೆಪಿ🚩ಹುಡುಗರು',
  'political',
  56788,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/136175507237530","twitter":"NIL","instagram":"NIL","youtube":null}',
  'Mantesh M',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_12',
  'ಭಾರತೀಯ ಜನತಾ ಪಾರ್ಟಿ 🚩ರಾಮ ಜನ್ಮಭೂಮಿ ತೀರ್ಥ ಕ್ಷೇತ್ರ',
  'other',
  2621,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Bengaluru',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/624253631531040/?ref=share","twitter":"NIL","instagram":"NIL","youtube":null}',
  'Vijaykumar Hiremat (Admin1)',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_13',
  'ಅಖಿಲ ಕರ್ನಾಟಕ ಬಿಜೆಪಿ ಪಕ್ಷ ಬೆಂಬಲಿಗರು',
  'political',
  89886,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":"091485 50832","email":"NIL"}',
  '{"facebook":"https://www.facebook.com/groups/karnatakaBJPsupporters/","twitter":"NIL","instagram":"https://www.instagram.com/_yuva_bjp_/","youtube":"NIL"}',
  'ಸ್ವದೇಶಿ ವಸ್ತುಗಳ ಮಾರಾಟ ಮಳಿಗೆ,,,Rajeshwari LN',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_14',
  'ಹಿಂದುತ್ವದ ಕಿಡಿ',
  'other',
  37790,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Sira',
  '{"phone":"NIL","email":"NIL"}',
  '{"facebook":"5","twitter":"NIL","instagram":"NIL","youtube":null}',
  NULL,
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_15',
  'ಕುರುಕ್ಷೇತ್ರ Kurukshetra',
  'other',
  30108,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://m.facebook.com/kurukshetra123/","twitter":null,"instagram":"https://www.instagram.com/haveri_kurukshetra_127/","youtube":null}',
  'santhoshacharya.balu        ಕುರುಕ್ಷೇತ್ರ Kurukshetra(Blog)',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_16',
  'ಸಮಾಲೋಚನೆ',
  'other',
  15867,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/145124999486883","twitter":null,"instagram":null,"youtube":null}',
  'ಅನಾಮಿಕನ ದ್ವನಿ',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_17',
  'ಅಜೀತ್ ಹನುಮಕ್ಕನವರ್ ಅಭಿಮಾನಿ ಬಳಗ',
  'other',
  1298,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'medium',
  'Other Groups',
  'NIL',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/434914707558721/permalink/462175691499289/","twitter":null,"instagram":null,"youtube":null}',
  'ಅನಾಮಿಕನ ದ್ವನಿ',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_18',
  'ಉತ್ತರ ಕರ್ನಾಟಕದ ಹಿಂದುಗಳು',
  'political',
  3769,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%89%E0%B2%A4%E0%B3%8D%E0%B2%A4%E0%B2%B0-%E0%B2%95%E0%B2%B0%E0%B3%8D%E0%B2%A8%E0%B2%BE%E0%B2%9F%E0%B2%95%E0%B2%A6-%E0%B2%B9%E0%B2%BF%E0%B2%82%E0%B2%A6%E0%B3%81%E0%B2%97%E0%B2%B3%E0%B3%81-2039556899704906","twitter":null,"instagram":null,"youtube":null}',
  'BSY fans of karnataka',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_19',
  'ಪ್ರತಾಪ್ ಸಿಂಹ ಅಭಿಮಾನಿ ಬಳಗ ಕರ್ನಾಟಕ',
  'political',
  97837,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'medium',
  'Other Groups',
  'Hunsuru',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/1514582045498992/?ref=share","twitter":null,"instagram":null,"youtube":null}',
  'Shiv Ram             Bjp Hunsur Bjp',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_20',
  'Anantkumar Hegde fans from Karunadu',
  'other',
  84540,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Kumuta',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2022629854619892/?ref=share","twitter":null,"instagram":null,"youtube":null}',
  'Ramadas Kumta',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_21',
  'ರಾಷ್ಟ್ರೀಯ ಬಜರಂಗದಳ ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆ',
  'political',
  1192,
  '["facebook"]',
  'facebook',
  'Group focused on political groups activities',
  'low',
  'Political Groups',
  'Kumuta',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/profile.php?id=100051234563450","twitter":null,"instagram":null,"youtube":null}',
  'ರಾಷ್ಟ್ರೀಯ ಬಜರಂಗದಳ ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆ',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_22',
  'ಚೈತ್ರಾ ಕುಂದಾಪುರ ಅಭಿಮಾನಿಗಳು',
  'other',
  139690,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Chaithrakundapurafanz","twitter":null,"instagram":"https://www.instagram.com/chaithra_kundapura_fans/","youtube":null}',
  'ಚೈತ್ರಾ ಕುಂದಾಪುರ ಅಭಿಮಾನಿಗಳು',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_23',
  'Hindusamrat dharmasene ಹಿಂದೂ ಸಾಮ್ರಾಟ್ ಧರ್ಮ ಸೇನೆ',
  'religious',
  77853,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Madugiri',
  '{"phone":"087225 37609","email":"hindusamratdharmasene@gmail.com"}',
  '{"facebook":"https://www.facebook.com/madhugirimodihindusamratdharmasene/?ti=as","twitter":null,"instagram":"https://www.instagram.com/hindusamratdharmasene/","youtube":null}',
  'Madugiri modi',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_24',
  'ಟೀಮ್ ಮೋದಿ',
  'other',
  51295,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":"084939 43519","email":null}',
  '{"facebook":"https://www.facebook.com/groups/1947913722170217","twitter":null,"instagram":null,"youtube":null}',
  'ಕರ್ನಾಟಕ ಹಿಂದೂ,Namo Nethra Preeshuu',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_25',
  '🚩🌸🕉 ಹಿಂದುಸ್ಸ್ ಭಾರತ್ 🌸🚩',
  'other',
  2466,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/1934156856619026/","twitter":null,"instagram":null,"youtube":null}',
  'Namo Nethra Preeshuu',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_26',
  'ಬಜರಂಗದಳ ದಕ್ಷಿಣ ಕನ್ನಡ ಜಿಲ್ಲೆ',
  'other',
  5057,
  '["facebook","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Dakshin Kannada',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/profile.php?id=100015377534142","twitter":null,"instagram":null,"youtube":"http://vhp.org/vhp-glance/youth/dim1-bajrang-dal/"}',
  'Hindu organisation youth wing of viswa hindu parisad',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_27',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷದ್ ಪುತ್ತೂರು',
  'religious',
  4974,
  '["facebook","twitter"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Putturu',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/profile.php?id=100010941516130","twitter":"https://twitter.com/vhpaustralia","instagram":null,"youtube":null}',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷದ್ ಪುತ್ತೂರು',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_28',
  'Vishva Hindu Parishad Mangalore,ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಮಂಗಳೂರು',
  'religious',
  4876,
  '["facebook","twitter"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  'Manglore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/vishvahinduparishad.mangalore.5","twitter":"https://twitter.com/vhpaustralia","instagram":null,"youtube":null}',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಮಂಗಳೂರು',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_29',
  'Samvada ಸಂವಾದ',
  'other',
  338066,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Vishwa Samvada Kendra (VSK),
Editor : Vrushanka Bhat K',
  '{"phone":"080 2662 5526","email":"samvadk@gmail.com"}',
  '{"facebook":"https://www.facebook.com/Samvada","twitter":"samvada","instagram":"samvada","youtube":"youtube.com/samvadk"}',
  'Samvada ಸಂವಾದ',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_30',
  'Hindu Janajagruti Samiti Mysuru',
  'religious',
  8657,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/hjsmysuru/photos/?ref=page_internal","twitter":null,"instagram":null,"youtube":null}',
  'http://hindujagruti.org/join',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_31',
  'ರಾಷ್ಟ್ರೀಯವಾದಿಗಳು',
  'political',
  34343,
  '["facebook"]',
  'facebook',
  'Group focused on political groups activities',
  'low',
  'Political Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/157070098331097/?ref=share","twitter":null,"instagram":null,"youtube":null}',
  'Mahadev Channappa B Anoor',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_32',
  'ನಮೋಕರ್ನಾಟಕ',
  'political',
  52654,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  '074832 04810',
  '{"phone":"iamspeakout@gmail.com","email":null}',
  '{"facebook":"https://www.facebook.com/groups/311329252675284","twitter":"https://twitter.com/NAMOKarnataka/status/1080069907952386048","instagram":"https://www.instagram.com/namokarnataka/","youtube":"Baydagi,Haveri"}',
  'SpeakOut',
  '2025-10-23T15:04:53.349Z',
  '2025-10-23T15:04:53.349Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_33',
  'ನಮೋ ಮತ್ತೊಮ್ಮೆ',
  'other',
  5249,
  '["facebook","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  '074832 04810',
  '{"phone":"iamspeakout@gmail.com","email":null}',
  '{"facebook":"https://www.facebook.com/groups/523488331450966/?ref=share","twitter":null,"instagram":"https://www.instagram.com/nmoomttomme/","youtube":"Baydagi,Haveri"}',
  'SpeakOut',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_34',
  'SpeakOut',
  'other',
  57593,
  '["facebook","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  '074832 04810',
  '{"phone":"iamspeakout@gmail.com","email":null}',
  '{"facebook":"https://www.facebook.com/SpeakOut.in/?ti=as","twitter":null,"instagram":null,"youtube":"Baydagi,Haveri"}',
  'SpeakOut',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_35',
  'RIGHT WING YOUTHS',
  'social',
  6400,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on youth organizations activities',
  'low',
  'Youth Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2372150299551439","twitter":null,"instagram":"https://www.instagram.com/right_youth_wing/","youtube":null}',
  'Hindu Youth Wing',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_36',
  'ಸ್ವಚ್ಛ ಬ್ರಾಹ್ಮಣ ವೇದಿಕೆ',
  'other',
  35452,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'medium',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/1154001181295427/?ref=share","twitter":null,"instagram":null,"youtube":null}',
  'Sandesha Talakalakoppa',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_37',
  'Hindu Youth Wing',
  'religious',
  2707,
  '["facebook","twitter"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/rightwingfamily","twitter":"https://twitter.com/MangoBhakt","instagram":null,"youtube":null}',
  'Hindu Youth Wing',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_38',
  'Real Hindu History',
  'religious',
  91992,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2407495985956958/members","twitter":null,"instagram":"https://www.instagram.com/history_of_hindus/","youtube":null}',
  'Chirayu Raxmi Vaidya',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_39',
  'ನಮೋ ಸೇನೆ ರಾಮನಗರ',
  'other',
  23574,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/profile.php?id=100030634381284","twitter":null,"instagram":"ನಮೋ ಸೇನೆ ರಾಮನಗರ","youtube":null}',
  'ನಮೋ ಸೇನೆ ರಾಮನಗರ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_40',
  'ನಮೋ ದಿಗು ದಿಗಂಬರಪ್ಪ ಔರಸಂಗ',
  'other',
  2487,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/digu.aurasang.50","twitter":null,"instagram":null,"youtube":null}',
  'ಭದ್ರಾವತಿ ಜೇ. ತಿಪ್ಪೇಸ್ವಾಮಿ ಸ್ವಾಮಿ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_41',
  'ದಕ್ಷಿಣ ಕನ್ನಡ ಅಖಿಲ ಭಾರತ ಹಿಂದೂ ಮಹಾಸಭಾ',
  'religious',
  982,
  '["facebook","youtube"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  '074117 07900',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%A6%E0%B2%95%E0%B3%8D%E0%B2%B7%E0%B2%BF%E0%B2%A3-%E0%B2%95%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%A1-%E0%B2%85%E0%B2%96%E0%B2%BF%E0%B2%B2-%E0%B2%AD%E0%B2%BE%E0%B2%B0%E0%B2%A4-%E0%B2%B9%E0%B2%BF%E0%B2%82%E0%B2%A6%E0%B3%82-%E0%B2%AE%E0%B2%B9%E0%B2%BE%E0%B2%B8%E0%B2%AD%E0%B2%BE-102900434962172/community/?ref=page_internal","twitter":null,"instagram":null,"youtube":"Bangalore"}',
  'ಶ್ರೀ ರಾಜೇಶ್ ಪವಿತ್ರ ನ್',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_42',
  '🚩ಹಿಂದು ಐಕ್ಯತಾ ಸಂಘ🚩',
  'other',
  110,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/783529508941723/","twitter":null,"instagram":null,"youtube":null}',
  'ಹಿಂದು ಐಕ್ಯತಾ ಸಂಘ    Sudeep Shetty',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_43',
  'ಮಾನವಕುಲ',
  'other',
  2235,
  '["facebook","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%AE%E0%B2%BE%E0%B2%A8%E0%B2%B5%E0%B2%95%E0%B3%81%E0%B2%B2-840678426139061/?ti=as","twitter":null,"instagram":"https://www.instagram.com/manav_akula/","youtube":"Bangalore"}',
  'ಮಾನವಕುಲ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_44',
  'Fight For Right',
  'other',
  100323,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  '098765 43210',
  '{"phone":"wefightforrights@gmail.com","email":null}',
  '{"facebook":"https://www.facebook.com/wefightforrights","twitter":"https://twitter.com/DavidBorah2","instagram":"https://www.instagram.com/fightforright.co/","youtube":"Bangalore"}',
  'ಸತ್ಯವನ್ನೇ ಹೇಳುತ್ತೇನೆ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_45',
  'Meera Raghavendra / ಮೀರಾ ರಾಘವೇಂದ್ರ',
  'other',
  41700,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":"meerabhat.adv@gmail.com","email":null}',
  '{"facebook":"https://www.facebook.com/Meera-Raghavendra-%E0%B2%AE%E0%B3%80%E0%B2%B0%E0%B2%BE-%E0%B2%B0%E0%B2%BE%E0%B2%98%E0%B2%B5%E0%B3%87%E0%B2%82%E0%B2%A6%E0%B3%8D%E0%B2%B0-608314302891979/","twitter":"https://twitter.com/MeeraRaghavendr","instagram":"https://www.instagram.com/meera_raghavendra/","youtube":"Bangalore"}',
  'Ashwath Ash Dk',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_46',
  'ಶ್ರೀ ಪ್ರಮೋದ ಮುತಾಲಿಕ್ ಜಿ ಅಭಿಮಾನಿ ಬಳಗ ಕರ್ನಾಟಕ🚩',
  'political',
  26951,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'medium',
  'Other Groups',
  NULL,
  '{"phone":"NIL","email":null}',
  '{"facebook":"https://www.facebook.com/groups/965142717194424/members","twitter":null,"instagram":"NIL","youtube":null}',
  '7th sence Namo',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_47',
  '7th sence Namo',
  'other',
  43593,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":"NIL","email":null}',
  '{"facebook":"https://www.facebook.com/saglakunte/","twitter":"NIL","instagram":"NIL","youtube":"NIL"}',
  '@saglakunte',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_48',
  'ವಿಜಯಪೂರ ಹಿಂದೂ ವೇದಿಕೆ',
  'religious',
  1231,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  'NIL',
  '{"phone":"NIL","email":null}',
  '{"facebook":"https://www.facebook.com/profile.php?id=100025514610534","twitter":"NIL","instagram":"NIL","youtube":"NIL"}',
  'ವಿಜಯಪೂರ ಹಿಂದೂ ವೇದಿಕೆ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_49',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಬಜರಂಗದಳ ತಲಪಾಡಿ ಘಟಕ',
  'religious',
  9574,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  'NIL',
  '{"phone":"NIL","email":"NIL"}',
  '{"facebook":"https://www.facebook.com/%E0%B2%B5%E0%B2%BF%E0%B2%B6%E0%B3%8D%E0%B2%B5-%E0%B2%B9%E0%B2%BF%E0%B2%82%E0%B2%A6%E0%B3%82-%E0%B2%AA%E0%B2%B0%E0%B2%BF%E0%B2%B7%E0%B2%A4%E0%B3%8D-%E0%B2%AC%E0%B2%9C%E0%B2%B0%E0%B2%82%E0%B2%97%E0%B2%A6%E0%B2%B3-%E0%B2%A4%E0%B2%B2%E0%B2%AA%E0%B2%BE%E0%B2%A1%E0%B2%BF-%E0%B2%98%E0%B2%9F%E0%B2%95-1801712206804642/","twitter":"NIL","instagram":"NIL","youtube":"Talpadi"}',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಬಜರಂಗದಳ ತಲಪಾಡಿ ಘಟಕ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_50',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಭಜರಂಗದಳ ಕರ್ನಾಟಕ',
  'political',
  2021,
  '["facebook","twitter","youtube"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  '097427 60477',
  '{"phone":"NIL","email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%B5%E0%B2%BF%E0%B2%B6%E0%B3%8D%E0%B2%B5-%E0%B2%B9%E0%B2%BF%E0%B2%82%E0%B2%A6%E0%B3%82-%E0%B2%AA%E0%B2%B0%E0%B2%BF%E0%B2%B7%E0%B2%A4%E0%B3%8D-%E0%B2%AD%E0%B2%9C%E0%B2%B0%E0%B2%82%E0%B2%97%E0%B2%A6%E0%B2%B3-%E0%B2%95%E0%B2%B0%E0%B3%8D%E0%B2%A8%E0%B2%BE%E0%B2%9F%E0%B2%95-102411218572864/?ti=as","twitter":"NIL","instagram":null,"youtube":"Tumakuru"}',
  'Admin',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_51',
  'ಛತ್ರಪತಿ ಶಿವಾಜಿ ಬಳಗ ಕರ್ನಾಟಕ',
  'political',
  6335,
  '["facebook","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'medium',
  'Other Groups',
  NULL,
  '{"phone":"9663508815","email":null}',
  '{"facebook":"https://www.facebook.com/chatrapathishivajibalaga","twitter":null,"instagram":"https://www.instagram.com/shivajimaharaj_bhakthi/","youtube":"https://www.youtube.com/watch?v=Gr-FwEA73xQ"}',
  NULL,
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_52',
  'ಬಜರಂಗ ದಳ ಹೆಬ್ಬಾಳ',
  'other',
  2638,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Hebbala',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/BdalHebbal","twitter":null,"instagram":null,"youtube":null}',
  '@BdalHebbal  · Personal blog',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_53',
  'Hindu Jagarana Vedike',
  'religious',
  3454,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Beltangadi',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Hindu-Jagarana-Vedike-1909032279108565","twitter":null,"instagram":"https://www.instagram.com/_hindu_jagarana_vedike_/","youtube":null}',
  'Hindu Jagarana Vedike',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_54',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಭಜರಂಗದಳ ಅಯ್ಯಪ್ಪ ಘಟಕ ಪೆರಾಡಿ',
  'religious',
  2530,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  'Peradi',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%B5%E0%B2%BF%E0%B2%B6%E0%B3%8D%E0%B2%B5-%E0%B2%B9%E0%B2%BF%E0%B2%82%E0%B2%A6%E0%B3%82-%E0%B2%AA%E0%B2%B0%E0%B2%BF%E0%B2%B7%E0%B2%A4%E0%B3%8D-%E0%B2%AD%E0%B2%9C%E0%B2%B0%E0%B2%82%E0%B2%97%E0%B2%A6%E0%B2%B3-%E0%B2%85%E0%B2%AF%E0%B3%8D%E0%B2%AF%E0%B2%AA%E0%B3%8D%E0%B2%AA-%E0%B2%98%E0%B2%9F%E0%B2%95-%E0%B2%AA%E0%B3%86%E0%B2%B0%E0%B2%BE%E0%B2%A1%E0%B2%BF-704971269877512","twitter":null,"instagram":null,"youtube":null}',
  NULL,
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_55',
  'ಕ್ರಾಂತಿಕಾರಿ ಭಗತ್ ಸಿಂಗ್ ಯುವಜನ ಸಂಘಟನೆ ಶೀಳನೆರೆ,',
  'social',
  2794,
  '["facebook"]',
  'facebook',
  'Group focused on youth organizations activities',
  'high',
  'Youth Organizations',
  'Shilanere',
  '{"phone":"9741269500             91 98455 66344","email":"youngtigars@gmail.com"}',
  '{"facebook":"https://www.facebook.com/RevolutionaryBhagatSinghYouthOrganizationSeelanere","twitter":null,"instagram":null,"youtube":null}',
  'RevolutionaryBhagatSinghYouthOrganizationSeelanere',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_56',
  'HINDU Rastra Sena Samithi',
  'religious',
  4825,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/HINDU-Rastra-Sena-Samithi-646092655724207/?ref=page_internal","twitter":"https://twitter.com/Vitthalwagh143/status/970161852914139136","instagram":"https://www.instagram.com/explore/locations/1647989628778384/hindu-rastra-sena/","youtube":null}',
  'HINDU Rastra Sena Samithi',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_57',
  'ಕಠೋರ ಹಿಂದುತ್ವವಾದಿಗಳು ಹಿಂದೂ ಜಾಗೃತಿ ಸೇನೆ',
  'religious',
  3765,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'high',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/481726962295310/members","twitter":null,"instagram":"https://www.instagram.com/ktthoor/","youtube":null}',
  'ಯುವ ಹಿಂದು ಘರ್ಜನೆ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_58',
  'ಯುವ ಹಿಂದು ಘರ್ಜನೆ',
  'social',
  1107,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on youth organizations activities',
  'high',
  'Youth Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%AF%E0%B3%81%E0%B2%B5-%E0%B2%B9%E0%B2%BF%E0%B2%82%E0%B2%A6%E0%B3%81-%E0%B2%98%E0%B2%B0%E0%B3%8D%E0%B2%9C%E0%B2%A8%E0%B3%86-175896386451986","twitter":null,"instagram":"https://www.instagram.com/explore/locations/554266201656233/","youtube":null}',
  'ಯುವ ಹಿಂದು ಘರ್ಜನೆ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_59',
  'ಹಿಂದೂ ಟಾಸ್ಕ್ ಫೋರ್ಸ್ | ಸನಾತನ ಧರ್ಮದ ರಕ್ಷಣೆಗಾಗಿ',
  'religious',
  6027,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Beltangadi',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2108766859440512","twitter":"https://twitter.com/kesari_veera","instagram":"https://www.instagram.com/veerakesari_belthangady/","youtube":null}',
  'Veera Kesari',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_60',
  'Anant Kumar Hegde Fans Club',
  'other',
  80260,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":"078921 55974","email":"dckmyinbox@gmail.com"}',
  '{"facebook":"https://www.facebook.com/Jagannatha-Gowda-%E0%B2%9C%E0%B2%97%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%BE%E0%B2%A5-%E0%B2%97%E0%B3%8C%E0%B2%A1-%E0%B2%95%E0%B2%A8%E0%B2%95%E0%B2%AA%E0%B3%81%E0%B2%B0-272994700233459","twitter":null,"instagram":null,"youtube":null}',
  'agannatha Gowda "ಜಗನ್ನಾಥ ಗೌಡ" ಕನಕಪುರ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_61',
  'ಭಾರತಾಂಬೆಯ ಪುತ್ರ ರಾಷ್ಟ್ರೀಯ ವಾದಿ',
  'political',
  4494,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on political groups activities',
  'low',
  'Political Groups',
  'Bangalore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/profile.php?id=100056942246644","twitter":null,"instagram":"https://www.instagram.com/bhaartaanbeyputr/","youtube":null}',
  'ಭಾರತಾಂಬೆಯ ಪುತ್ರ ರಾಷ್ಟ್ರೀಯ ವಾದಿ',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_62',
  'ಭಜರಂಗಿ ಹಿಂದೂ ಪರಿಷತ್ - Bajarangi Hindu Parishad',
  'religious',
  1287,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  'Hassan',
  '{"phone":"80737 75747","email":null}',
  '{"facebook":"https://www.facebook.com/bajarangi.hindu.parishad","twitter":"https://twitter.com/YogiShivaanand1/status/1323469793320595457","instagram":"https://www.instagram.com/bhjrngihinduu/","youtube":null}',
  'https://twitter.com/BasanGoudaPL',
  '2025-10-23T15:04:53.350Z',
  '2025-10-23T15:04:53.350Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_63',
  'बजरंग दल GROUP मे कट्टर हिन्दू जुड़े ( BAJRANG DAL )',
  'religious',
  138000,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'North India',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/302030476872604","twitter":"https://twitter.com/BajrangdalOrg","instagram":"https://www.instagram.com/bajrang__dal__official__/","youtube":null}',
  'बजरंग दल GROUP मे कट्टर हिन्दू जुड़े ( BAJRANG DAL )',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_64',
  'ವಿಶ್ವ ಕೇಸರಿ',
  'other',
  4823,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/VishwaKesari","twitter":null,"instagram":null,"youtube":null}',
  'https://twitter.com/ParamathmaS',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_65',
  'Vishva Hindu Parishad -VHP',
  'religious',
  79905,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":"011 2610 3495","email":"info@vhp.org"}',
  '{"facebook":"https://www.facebook.com/VHPDigital/about/?ref=page_internal","twitter":"https://twitter.com/VHPDigital","instagram":"https://www.instagram.com/vhp_mangalore/","youtube":"https://www.youtube.com/vhpdigital"}',
  'Vishva Hindu Parishad -VHP',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_66',
  'RSS: राष्ट्रीय स्वयंसेवक संघ',
  'other',
  143428,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":"011-23679996","email":"contactus@rss.org"}',
  '{"facebook":"https://www.facebook.com/sanghprivarorg","twitter":"SanghPrivar_Org","instagram":"https://www.instagram.com/__sanatan.dharm__/","youtube":"https://www.youtube.com/watch?v=BS8rqMeIq-g"}',
  'https://twitter.com/Kartikeyayodhya',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_67',
  'विश्व हिन्दू परिषद',
  'other',
  25297,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":"NIl"}',
  '{"facebook":"https://www.facebook.com/groups/969688123103197","twitter":"विश्व हिन्दू परिषद","instagram":"https://www.instagram.com/the_vishva_hindu_parishad/","youtube":"https://www.youtube.com/channel/UC56LNg4HFGs5c-s6sQV3ZtQ"}',
  'Pandit Shambhu  ·',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_68',
  'Vishwa Hindu Parishad - Bajarangadala, Vidyaranyapura',
  'religious',
  2036,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Vidyarannypura Bangalore',
  '{"phone":"94484 24694","email":null}',
  '{"facebook":"https://www.facebook.com/Vishwa-Hindu-Parishad-Bajarangadala-Vidyaranyapura-724049884368024","twitter":"https://twitter.com/HinduParishad","instagram":"https://www.instagram.com/vishwa_hindu_parishad_bajrang_/","youtube":null}',
  'Prakash Kp',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_69',
  'Bajarangadala Vijaynagar Bangalore',
  'other',
  4551,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Vijay Nagar',
  '{"phone":"020160 0160","email":null}',
  '{"facebook":"https://www.facebook.com/Bajarangadalavijaynagar","twitter":null,"instagram":null,"youtube":null}',
  'Bajarangadala Vijaynagar Bangalore',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_70',
  'Vishwa Hindu Parishad - Karnataka ,ವಿಶ್ವ ಹಿಂದು ಪರಿಷದ್ - ಕರ್ನಾಟಕ',
  'political',
  23986,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Vijay Nagar',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/karvhp","twitter":null,"instagram":null,"youtube":null}',
  'https://twitter.com/Girishvhp',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_71',
  '⛳⛳⛳Mangalore Hindus👊💪💪⛳⛳⛳',
  'religious',
  5667,
  '["facebook","twitter"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Vijay Nagar',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/380058285764345","twitter":"https://twitter.com/PoojaPoojari9","instagram":null,"youtube":null}',
  'https://www.facebook.com/groups/380058285764345/user/100034705064406',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_72',
  'Jai Hind',
  'other',
  249217,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'AP',
  '{"phone":"8093568054","email":"rakesh.varma1250@gmail.com"}',
  '{"facebook":"https://www.facebook.com/manyindia","twitter":"https://twitter.com/ArunnVashisth10","instagram":"https://www.instagram.com/jay_hind_jay_bharat_/","youtube":null}',
  '@manyindia',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_73',
  'ರಾಷ್ಟ್ರೀಯ ಹಿಂದೂ ಜಾಗರಣ ವೇದಿಕೆ',
  'political',
  3823,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/RHJVBelthangadiThaluk.in","twitter":"https://twitter.com/hjvkar","instagram":"https://www.instagram.com/hindunationalist/","youtube":null}',
  'ರಾಷ್ಟ್ರೀಯ ಹಿಂದೂ ಜಾಗರಣ ವೇದಿಕೆ',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_74',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಮತ್ತು ಬಜರಂಗದಳ ಯಲಹಂಕ',
  'religious',
  4977,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'medium',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":"shiva_mei@yahoo.co.in"}',
  '{"facebook":"https://www.facebook.com/vhpbajarangadalynk","twitter":null,"instagram":null,"youtube":null}',
  'ವಿಶ್ವ ಹಿಂದೂ ಪರಿಷತ್ ಮತ್ತು ಬಜರಂಗದಳ ಯಲಹಂಕ',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_75',
  'ಬಜರಂಗದಳ-ನಂದಿನಿಲೇಔಟ್',
  'other',
  4228,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%AC%E0%B2%9C%E0%B2%B0%E0%B2%82%E0%B2%97%E0%B2%A6%E0%B2%B3-%E0%B2%A8%E0%B2%82%E0%B2%A6%E0%B2%BF%E0%B2%A8%E0%B2%BF%E0%B2%B2%E0%B3%87%E0%B2%94%E0%B2%9F%E0%B3%8D-262611514206676","twitter":null,"instagram":null,"youtube":null}',
  'ಬಜರಂಗದಳ-ನಂದಿನಿಲೇಔಟ್',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_76',
  'Bajrangdal Nelamangala',
  'religious',
  3375,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":"NIL","email":"NIL"}',
  '{"facebook":"https://www.facebook.com/BAJRANGDALNELMANGALA","twitter":null,"instagram":null,"youtube":null}',
  'https://twitter.com/FollowAkshay1/status/1258420195908935680',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_77',
  'Karnataka Kshatriya Yuva Maratha Sene',
  'other',
  3822,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":"NIL","email":"NIL"}',
  '{"facebook":"https://www.facebook.com/kkymsene","twitter":"NIL","instagram":"NIL","youtube":"NIL"}',
  'Karnataka Kshatriya Yuva Maratha Sene',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_78',
  'Chatrapathi Shivaji Yuva Brigade',
  'other',
  2914,
  '["facebook","twitter"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'NIL',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Chatrapathi-Shivaji-Yuva-Brigade-1360321977344311","twitter":"https://twitter.com/search?q=Chatrapathi%20Shivaji%20Yuva%20Brigade&src=typed_query","instagram":null,"youtube":null}',
  'Chatrapathi Shivaji Yuva Brigade',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_79',
  'ವೀರ ಶಿವಾಜಿ ಸೇನೆ',
  'other',
  4138,
  '["facebook","twitter","instagram","youtube"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":"93799 91116    \n99805 73377","email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%B5%E0%B3%80%E0%B2%B0-%E0%B2%B6%E0%B2%BF%E0%B2%B5%E0%B2%BE%E0%B2%9C%E0%B2%BF-%E0%B2%B8%E0%B3%87%E0%B2%A8%E0%B3%86-111281440300449","twitter":"https://twitter.com/ChetanP52848741","instagram":"https://www.instagram.com/viirshivaajiseene/","youtube":"https://www.youtube.com/channel/UCdhfuW51viGVyMsItKwvqxA"}',
  'ವೀರ ಶಿವಾಜಿ ಸೇನೆ     https://twitter.com/ChetanP52848741',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_80',
  'Veera Kesari',
  'other',
  46053,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/329775754167073","twitter":null,"instagram":null,"youtube":null}',
  'B Govardhan Singh',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_81',
  'ವೀರ ಶಿವಾಜಿ ಸೇನೆ (ರಿ)',
  'other',
  3866,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Hebbal Bangalore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/336110110416031","twitter":null,"instagram":null,"youtube":null}',
  'Nagaraj Nannuri',
  '2025-10-23T15:04:53.351Z',
  '2025-10-23T15:04:53.351Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_82',
  'Karnataka Maratha Development Committee',
  'other',
  8080,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Karnataka',
  '{"phone":"9071312005","email":null}',
  '{"facebook":"https://www.facebook.com/groups/2761869947203875","twitter":null,"instagram":null,"youtube":null}',
  'Yamanesh akkol',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_83',
  'Sakala Maratha Samaj - Official ಕರ್ನಾಟಕ',
  'political',
  19622,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Bangalore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/1116003755465178","twitter":null,"instagram":null,"youtube":null}',
  'Bhaskar Rao Savanth',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_84',
  'ವೀರ ಶಿವಾಜಿ ಸೇನೆ',
  'other',
  3678,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Kamman halli',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/423178265058465","twitter":null,"instagram":null,"youtube":null}',
  'Nagaraj Nannuri',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_85',
  'Chatrapati Shivaji Maharaj',
  'other',
  4025,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'elgavi',
  '{"phone":"099023 85141","email":null}',
  '{"facebook":"https://www.facebook.com/gurunathraopavankumarrao","twitter":null,"instagram":null,"youtube":null}',
  'Chatrapati Shivaji Maharaj',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_86',
  'ಶ್ರೀ ರಾಮ್ ಸೇನಾ ಕರ್ನಾಟಕ',
  'political',
  19907,
  '["facebook"]',
  'facebook',
  'Group focused on militant groups activities',
  'high',
  'Militant Groups',
  'Marikatti',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2044703955788954","twitter":null,"instagram":null,"youtube":null}',
  'Yallesh Naik',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  true
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_87',
  'ಒಂದು ದೇಶ, ಒಂದು ಧರ್ಮ, ಒಂದು ಕಾನೂನು',
  'other',
  3524,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/2248415072060217","twitter":null,"instagram":null,"youtube":null}',
  'ಸುಶಾಂತ್ ಕೇಸರಿ',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_88',
  'Voice Of Manglore Hindus',
  'religious',
  11282,
  '["facebook","youtube"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  'Mangalore',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Voice-Of-Manglore-Hindus-432456497536004","twitter":null,"instagram":null,"youtube":"https://www.youtube.com/channel/UC8kvJWLotpnNVso3_HC0VVA"}',
  'oice Of Manglore Hindus',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_89',
  'Bajarangadala Dasarahalli Bhaga',
  'other',
  3452,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  'Dasarahalli',
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Bajarangadala-Dasarahalli-Bhaga-537841363088711","twitter":null,"instagram":null,"youtube":null}',
  'DR Suresh',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_90',
  'Chatrapathi shivaji youth association at raipahad',
  'social',
  4467,
  '["facebook"]',
  'facebook',
  'Group focused on youth organizations activities',
  'low',
  'Youth Organizations',
  NULL,
  '{"phone":"9298809990","email":null}',
  '{"facebook":"https://www.facebook.com/Chatrapathi-shivaji-youth-association-at-raipahad-743624145773186","twitter":null,"instagram":null,"youtube":null}',
  'Chatrapathi shivaji youth association at raipahad',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_91',
  'Ugram - ಉಗ್ರಂ',
  'other',
  121584,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/UgramHindu","twitter":null,"instagram":"https://www.instagram.com/ugramhindu/","youtube":null}',
  'Ugram - ಉಗ್ರಂ',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_92',
  'Hindu Jagarana Vedike Karnataka',
  'religious',
  21625,
  '["facebook","twitter","instagram"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  '#55, 1st Main Road, Sheshadripuram Bangalore, Karnataka, India 560020',
  '{"phone":null,"email":"hjvkar@gmail.com"}',
  '{"facebook":"https://www.facebook.com/hjvkar","twitter":"https://twitter.com/pushparajkulai","instagram":"https://www.instagram.com/hjvkar/","youtube":null}',
  'Hindu Jagarana Vedike Karnataka',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_93',
  'ಮೋದಿ ಮತ್ತೊಮ್ಮೆ',
  'other',
  6642,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/188821935321030","twitter":null,"instagram":"https://www.instagram.com/mmttomme/","youtube":null}',
  'Kiran Raj',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_94',
  'We are with MODI',
  'political',
  143535,
  '["facebook","instagram"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/WearewithNammaModi","twitter":null,"instagram":"https://www.instagram.com/we_are_with_modi/","youtube":null}',
  'We are with MODI',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_95',
  'ಸತ್ಯ ಮೇವ ಜಯತೆ.',
  'other',
  2888,
  '["facebook","twitter"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/%E0%B2%B8%E0%B2%A4%E0%B3%8D%E0%B2%AF-%E0%B2%AE%E0%B3%87%E0%B2%B5-%E0%B2%9C%E0%B2%AF%E0%B2%A4%E0%B3%86-218406882023484","twitter":"https://twitter.com/satyamevjayate","instagram":null,"youtube":null}',
  NULL,
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_97',
  'Rss ರಾಪ್ಟೀಯ ಸ್ವಯಂಸೇವಕ ಸಂಘ - ಪೊಳಲಿ ವಲಯ',
  'other',
  7895,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/beinghindubantwal","twitter":null,"instagram":null,"youtube":null}',
  '@beinghindubantwal  · Publisher',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_98',
  'Vishwa Hindu Parishad Udupi V.H.P',
  'religious',
  2434,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Vishwa-Hindu-Parishad-Udupi-VHP-536292119898864","twitter":null,"instagram":null,"youtube":null}',
  'Community organisation',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_100',
  'ಯುವ ದನಿ-Yuva Dani',
  'social',
  1390,
  '["facebook"]',
  'facebook',
  'Group focused on youth organizations activities',
  'low',
  'Youth Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Kannadayuvadani","twitter":null,"instagram":null,"youtube":null}',
  '@Kannadayuvadani  · Journalist',
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_101',
  'Stop conversion ಮತಾಂತರ ನಿಲ್ಲಿಸಿ',
  'other',
  665,
  '["facebook"]',
  'facebook',
  'Group focused on other groups activities',
  'low',
  'Other Groups',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/Stop-conversion-%E0%B2%AE%E0%B2%A4%E0%B2%BE%E0%B2%82%E0%B2%A4%E0%B2%B0-%E0%B2%A8%E0%B2%BF%E0%B2%B2%E0%B3%8D%E0%B2%B2%E0%B2%BF%E0%B2%B8%E0%B2%BF-100186444908888","twitter":null,"instagram":null,"youtube":null}',
  NULL,
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  'group_102',
  'ಬಲಿಷ್ಠ ಹಿಂದೂರಾಷ್ಟ್ರ',
  'religious',
  107,
  '["facebook"]',
  'facebook',
  'Group focused on hindu organizations activities',
  'low',
  'Hindu Organizations',
  NULL,
  '{"phone":null,"email":null}',
  '{"facebook":"https://www.facebook.com/groups/126680487914954","twitter":null,"instagram":null,"youtube":null}',
  NULL,
  '2025-10-23T15:04:53.352Z',
  '2025-10-23T15:04:53.352Z',
  'active',
  false
);

-- Create view for easy querying
CREATE OR REPLACE VIEW groups_summary AS
SELECT 
  id,
  name,
  type,
  members,
  risk_level,
  category,
  location,
  monitoring_enabled,
  created_at
FROM groups
ORDER BY risk_level DESC, members DESC;

-- Create view for high-risk groups
CREATE OR REPLACE VIEW high_risk_groups AS
SELECT *
FROM groups
WHERE risk_level = 'high'
ORDER BY members DESC;

-- Create view for monitored groups
CREATE OR REPLACE VIEW monitored_groups AS
SELECT *
FROM groups
WHERE monitoring_enabled = true
ORDER BY risk_level DESC, members DESC;
