/**
 * DATA MAPPING STRATEGY FOR UNIFIED GROUPS TABLE
 *
 * This file defines how data from different sheets will be mapped
 * to a unified structure for the groups table
 */

const SHEET_MAPPING_STRATEGY = {
  // ===== GROUP 1: Standard Format (9 sheets) =====
  // Sheets: Right Hindu Groups, Right Hindu Persons, Trade Unions, RRP,
  //         Students ORG, Christians Activist, Kannadda, Woman, Political
  standardFormat: {
    sheets: [
      'Right Hindu Groups',
      'Right Hindu Persons',
      'Trade Unions',
      'RRP',
      'Students ORG',
      'Christians Activist',
      'Kannadda ',
      'Woman',
      'Political'
    ],
    mapping: {
      id: (row, sheetName, index) => `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${row['Sl No'] || index}`,
      name: (row) => row['Organisation Type'] || 'Unnamed Group',
      totalMembers: (row) => parseInt(row['Total Members'] || 0),
      influencers: (row) => row['Top Influencer IDS'] || null,
      facebookUrl: (row) => row['Facebook Profile URL'] || null,
      twitterUrl: (row) => row['Twitter'] || null,
      instagramUrl: (row) => row['Instagram'] || null,
      youtubeUrl: (row) => row['Youtube ID'] || row['Youtube'] || null,
      physicalAddress: (row) => row['Physical Address'] || null,
      phoneNumber: (row) => row['Linked Phone Number'] || null,
      email: (row) => row['Linked E-Mail ID'] || null
    }
  },

  // ===== GROUP 2: Muslim Groups Format (1 sheet) =====
  // Missing "Youtube ID" column
  muslimGroupsFormat: {
    sheets: ['Right Wing Muslim Groups'],
    mapping: {
      id: (row, sheetName, index) => `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${row['Sl No'] || index}`,
      name: (row) => row['Organisation Type'] || 'Unnamed Group',
      totalMembers: (row) => parseInt(row['Total Members'] || 0),
      influencers: (row) => row['Top Influencer IDS'] || null,
      facebookUrl: (row) => row['Facebook Profile URL'] || null,
      twitterUrl: (row) => row['Twitter'] || null,
      instagramUrl: (row) => row['Instagram'] || null,
      youtubeUrl: (row) => null, // No Youtube column
      physicalAddress: (row) => row['Physical Address'] || null,
      phoneNumber: (row) => row['Linked Phone Number'] || null,
      email: (row) => row['Linked E-Mail ID'] || null
    }
  },

  // ===== GROUP 3: Human Rights/Farmers Format (2 sheets) =====
  // Has "Youtube" instead of "Youtube ID"
  humanRightsFormat: {
    sheets: ['Human Rights', 'ALL Farmers ORG Karnataka'],
    mapping: {
      id: (row, sheetName, index) => `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${row['Sl No'] || index}`,
      name: (row) => row['Organisation Type'] || 'Unnamed Group',
      totalMembers: (row) => parseInt(row['Total Members'] || 0),
      influencers: (row) => row['Top Influencer IDS'] || null,
      facebookUrl: (row) => row['Facebook Profile URL'] || null,
      twitterUrl: (row) => row['Twitter'] || null,
      instagramUrl: (row) => row['Instagram'] || null,
      youtubeUrl: (row) => row['Youtube'] || null,
      physicalAddress: (row) => row['Physical Address'] || null,
      phoneNumber: (row) => row['Linked Phone Number'] || null,
      email: (row) => row['Linked E-Mail ID'] || null
    }
  },

  // ===== GROUP 4: Mixed Format (1 sheet) =====
  // Completely different column structure
  mixedFormat: {
    sheets: ['Mixed'],
    mapping: {
      id: (row, sheetName, index) => `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${row['SL No'] || index}`,
      name: (row) => row['Facebook Page Name'] || row['ORG'] || 'Unnamed Group',
      totalMembers: (row) => 0, // No member count in this format
      influencers: (row) => null, // No influencer data
      facebookUrl: (row) => row['Facebook Page Link'] || null,
      twitterUrl: (row) => row['Twitter Link'] || null,
      instagramUrl: (row) => null, // No Instagram column
      youtubeUrl: (row) => null, // No Youtube column
      physicalAddress: (row) => row['Location'] || row['Address'] || null,
      phoneNumber: (row) => row['Mobile Nomber'] || null, // Note: typo in column name
      email: (row) => row['Email ID'] || null,
      // Additional fields specific to this format
      website: (row) => row['Website'] || null,
      twitterUsername: (row) => row['Twitter Usernmae'] || null, // Note: typo in column name
      job: (row) => row['JOB'] || null
    }
  },

  // ===== GROUP 5: Mixed 2 Format (1 sheet) =====
  // Very minimal column structure
  mixed2Format: {
    sheets: ['Mixed 2'],
    mapping: {
      id: (row, sheetName, index) => `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${index}`,
      name: (row) => row['POLITICAL AND RELEGIOUS  ORGANIZATIONS KARNATAKA'] || 'Unnamed Group',
      totalMembers: (row) => 0, // No member count
      influencers: (row) => null,
      facebookUrl: (row) => null, // No Facebook data
      twitterUrl: (row) => row['IN TWITTER'] || null,
      instagramUrl: (row) => null,
      youtubeUrl: (row) => null,
      physicalAddress: (row) => null,
      phoneNumber: (row) => null,
      email: (row) => null
    }
  }
};

/**
 * UNIFIED DATA STRUCTURE FOR GROUPS TABLE
 */
const UNIFIED_GROUP_STRUCTURE = {
  // Core fields (present in most sheets)
  id: 'string', // Unique identifier
  name: 'string', // Group/Organization name
  type: 'string', // Will be determined based on sheet name and content
  members: 'number', // Total members count

  // Social Media fields
  platforms: 'array', // List of platforms where group is present
  primaryPlatform: 'string', // Main platform (usually Facebook)
  socialMedia: {
    facebook: 'string',
    twitter: 'string',
    instagram: 'string',
    youtube: 'string'
  },

  // Contact Information
  location: 'string', // Physical address
  contactInfo: {
    phone: 'string',
    email: 'string',
    website: 'string' // Only in Mixed sheet
  },

  // Additional metadata
  influencers: 'string', // Key influencers/admins
  description: 'string', // Generated from available data
  riskLevel: 'string', // Calculated based on type and size
  category: 'string', // Based on sheet name
  sheet: 'string', // Source sheet name
  status: 'string', // active/inactive/monitored
  monitoringEnabled: 'boolean',

  // Timestamps
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

/**
 * Helper function to determine group type based on sheet and name
 */
function determineGroupType(sheetName, groupName) {
  const name = (groupName || '').toLowerCase();
  const sheet = sheetName.toLowerCase();

  // Sheet-based categorization
  if (sheet.includes('hindu')) return 'religious';
  if (sheet.includes('muslim')) return 'religious';
  if (sheet.includes('christian')) return 'religious';
  if (sheet.includes('political')) return 'political';
  if (sheet.includes('student')) return 'social';
  if (sheet.includes('woman') || sheet.includes('women')) return 'social';
  if (sheet.includes('farmer')) return 'professional';
  if (sheet.includes('trade union')) return 'professional';
  if (sheet.includes('human rights')) return 'social';
  if (sheet.includes('kannadda') || sheet.includes('kannada')) return 'cultural';

  // Name-based fallback
  if (name.includes('hindu') || name.includes('muslim') || name.includes('christian')) return 'religious';
  if (name.includes('bjp') || name.includes('congress') || name.includes('political')) return 'political';
  if (name.includes('student') || name.includes('youth')) return 'social';
  if (name.includes('farmer') || name.includes('union')) return 'professional';

  return 'other';
}

/**
 * Helper function to determine risk level
 */
function determineRiskLevel(sheetName, groupName, memberCount) {
  const name = (groupName || '').toLowerCase();
  const members = parseInt(memberCount) || 0;

  // High risk indicators
  if (name.includes('militant') || name.includes('sena') || name.includes('dal')) return 'high';
  if (sheetName.includes('Right Wing')) return 'high';

  // Medium risk based on size
  if (members > 50000) return 'medium';
  if (members > 10000 && (name.includes('hindu') || name.includes('muslim'))) return 'medium';

  return 'low';
}

/**
 * Clean and normalize data values
 */
function cleanValue(value) {
  if (!value) return null;
  if (typeof value !== 'string') return value;

  const cleaned = value.trim();

  // Check for common null values
  if (['nil', 'nill', 'null', 'na', 'n/a', 'not manation', '-'].includes(cleaned.toLowerCase())) {
    return null;
  }

  // Remove "Linked E-Mail ID" prefix if present
  if (cleaned.startsWith('Linked E-Mail ID')) {
    return cleaned.replace('Linked E-Mail ID', '').trim();
  }

  return cleaned;
}

module.exports = {
  SHEET_MAPPING_STRATEGY,
  UNIFIED_GROUP_STRUCTURE,
  determineGroupType,
  determineRiskLevel,
  cleanValue
};