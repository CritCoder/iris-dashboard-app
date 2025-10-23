/**
 * Script to fix groups import and ensure all groups from CSV are imported
 * This script will parse the CSV file and generate a complete SQL import
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Function to parse CSV and extract groups
async function importGroupsFromCSV() {
  const csvPath = path.join(__dirname, '../public/groups.csv');
  const groups = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const group = parseGroupRow(row);
          if (group) {
            groups.push(group);
            console.log(`Parsed group ${groups.length}: ${group.name}`);
          }
        } catch (error) {
          console.error('Error parsing row:', error, row);
        }
      })
      .on('end', () => {
        console.log(`📊 Parsed ${groups.length} groups from CSV`);
        resolve(groups);
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

// Function to parse a single row from the CSV
function parseGroupRow(row) {
  const {
    'Sl No': slNo,
    'Organisation Type': name,
    'Total Members': members,
    'Top Influencer IDS': influencers,
    'Facebook Profile URL': facebookUrl,
    'Twitter': twitterUrl,
    'Instagram': instagramUrl,
    'Youtube ID': youtubeUrl,
    'Physical Address': address,
    'Linked Phone Number': phone,
    'Linked E-Mail ID': email
  } = row;

  // Skip if no name or if name is empty
  if (!name || name.trim() === '' || name === 'Organisation Type') {
    return null;
  }

  // Skip rows with missing essential data
  if (!slNo || slNo === '') {
    return null;
  }

  // Clean up member count - handle "107.7K" format
  let memberCount = 0;
  if (members && members !== 'Nil' && members !== '') {
    const memberStr = members.toString().trim();
    if (memberStr.includes('K')) {
      memberCount = Math.round(parseFloat(memberStr.replace('K', '')) * 1000);
    } else {
      memberCount = parseInt(memberStr.replace(/[^\d]/g, '')) || 0;
    }
  }

  // Determine group type based on name and content
  const groupType = determineGroupType(name, influencers);
  
  // Determine platform based on available URLs
  const platforms = [];
  if (facebookUrl && facebookUrl !== 'Nil' && facebookUrl !== '') platforms.push('facebook');
  if (twitterUrl && twitterUrl !== 'Nil' && twitterUrl !== '') platforms.push('twitter');
  if (instagramUrl && instagramUrl !== 'Nil' && instagramUrl !== '') platforms.push('instagram');
  if (youtubeUrl && youtubeUrl !== 'Nil' && youtubeUrl !== '') platforms.push('youtube');

  // Determine risk level based on content analysis
  const riskLevel = determineRiskLevel(name, influencers);

  // Determine category based on name analysis
  const category = determineCategory(name);

  const group = {
    id: `group_${slNo}`,
    name: name.trim(),
    type: groupType,
    members: memberCount,
    platforms: platforms,
    primaryPlatform: platforms[0] || 'facebook',
    description: `Group focused on ${category.toLowerCase()} activities`,
    riskLevel: riskLevel,
    category: category,
    location: address && address !== 'Nil' && address !== '' ? address.trim() : null,
    contactInfo: {
      phone: phone && phone !== 'Nil' && phone !== '' ? phone.trim() : null,
      email: email && email !== 'Nil' && email !== '' ? email.trim() : null
    },
    socialMedia: {
      facebook: facebookUrl && facebookUrl !== 'Nil' && facebookUrl !== '' ? facebookUrl.trim() : null,
      twitter: twitterUrl && twitterUrl !== 'Nil' && twitterUrl !== '' ? twitterUrl.trim() : null,
      instagram: instagramUrl && instagramUrl !== 'Nil' && instagramUrl !== '' ? instagramUrl.trim() : null,
      youtube: youtubeUrl && youtubeUrl !== 'Nil' && youtubeUrl !== '' ? youtubeUrl.trim() : null
    },
    influencers: influencers && influencers !== 'Nil' && influencers !== '' ? influencers.trim() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    monitoringEnabled: riskLevel === 'high' || riskLevel === 'medium' // Auto-enable monitoring for high/medium risk
  };

  return group;
}

// Function to determine group type
function determineGroupType(name, influencers) {
  const nameLower = name.toLowerCase();
  
  // Political groups
  if (nameLower.includes('bjp') || nameLower.includes('ಕರ್ನಾಟಕ') || 
      nameLower.includes('modi') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ') ||
      nameLower.includes('political') || nameLower.includes('ರಾಜಕೀಯ')) {
    return 'political';
  }
  
  // Religious groups
  if (nameLower.includes('ಹಿಂದೂ') || nameLower.includes('hindu') || 
      nameLower.includes('dharma') || nameLower.includes('ಧರ್ಮ') ||
      nameLower.includes('religious') || nameLower.includes('ಧಾರ್ಮಿಕ')) {
    return 'religious';
  }
  
  // Youth groups
  if (nameLower.includes('youth') || nameLower.includes('ಯುವ') ||
      nameLower.includes('yuva') || nameLower.includes('young')) {
    return 'social';
  }

  return 'other';
}

// Function to determine risk level
function determineRiskLevel(name, influencers) {
  const nameLower = name.toLowerCase();
  const influencerLower = (influencers || '').toLowerCase();
  
  // High risk indicators
  if (nameLower.includes('militant') || nameLower.includes('ಸೇನೆ') ||
      nameLower.includes('sena') || nameLower.includes('ದಳ') ||
      nameLower.includes('dal') || nameLower.includes('ಕಟ್ಟರ') ||
      nameLower.includes('kattar') || nameLower.includes('extreme')) {
    return 'high';
  }
  
  // Medium risk indicators
  if (nameLower.includes('political') || nameLower.includes('ರಾಜಕೀಯ') ||
      nameLower.includes('nationalist') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'medium';
  }

  return 'low';
}

// Function to determine category
function determineCategory(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('ಹಿಂದೂ') || nameLower.includes('hindu')) {
    return 'Hindu Organizations';
  }
  
  if (nameLower.includes('political') || nameLower.includes('ರಾಜಕೀಯ') ||
      nameLower.includes('bjp') || nameLower.includes('modi')) {
    return 'Political Groups';
  }
  
  if (nameLower.includes('youth') || nameLower.includes('ಯುವ') ||
      nameLower.includes('yuva')) {
    return 'Youth Organizations';
  }
  
  if (nameLower.includes('militant') || nameLower.includes('ಸೇನೆ') ||
      nameLower.includes('sena') || nameLower.includes('ದಳ')) {
    return 'Militant Groups';
  }

  return 'Other Groups';
}

// Function to generate SQL inserts
function generateSQLInserts(groups) {
  const sqlStatements = [];
  
  // Create table if not exists
  sqlStatements.push(`-- Create groups table if not exists
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

`);

  // Generate INSERT statements
  groups.forEach(group => {
    const platformsJson = JSON.stringify(group.platforms);
    const contactInfoJson = JSON.stringify(group.contactInfo);
    const socialMediaJson = JSON.stringify(group.socialMedia);
    
    const sql = `INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  '${group.id}',
  '${group.name.replace(/'/g, "''")}',
  '${group.type}',
  ${group.members},
  '${platformsJson}',
  '${group.primaryPlatform}',
  '${group.description.replace(/'/g, "''")}',
  '${group.riskLevel}',
  '${group.category}',
  ${group.location ? `'${group.location.replace(/'/g, "''")}'` : 'NULL'},
  '${contactInfoJson}',
  '${socialMediaJson}',
  ${group.influencers ? `'${group.influencers.replace(/'/g, "''")}'` : 'NULL'},
  '${group.createdAt}',
  '${group.updatedAt}',
  '${group.status}',
  ${group.monitoringEnabled}
);`;
    
    sqlStatements.push(sql);
  });

  // Add views
  sqlStatements.push(`
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
`);

  return sqlStatements;
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting groups import fix...');
    
    const groups = await importGroupsFromCSV();
    console.log(`📊 Found ${groups.length} groups in CSV`);
    
    // Generate SQL statements
    const sqlStatements = generateSQLInserts(groups);
    
    // Write to file
    const sqlContent = `-- Groups Import SQL - FIXED VERSION
-- Generated on ${new Date().toISOString()}
-- Total groups: ${groups.length}
-- 
-- IMPORTANT: Review this SQL before running against your database
-- Make sure you have a backup of your database before proceeding
--

${sqlStatements.join('\n')}
`;
    
    const sqlPath = path.join(__dirname, '../database/groups-import-fixed.sql');
    fs.writeFileSync(sqlPath, sqlContent);
    console.log(`📄 Fixed SQL file generated: ${sqlPath}`);
    
    // Show statistics
    const stats = {
      total: groups.length,
      byType: {},
      byRisk: {},
      byCategory: {},
      monitored: 0
    };
    
    groups.forEach(group => {
      stats.byType[group.type] = (stats.byType[group.type] || 0) + 1;
      stats.byRisk[group.riskLevel] = (stats.byRisk[group.riskLevel] || 0) + 1;
      stats.byCategory[group.category] = (stats.byCategory[group.category] || 0) + 1;
      if (group.monitoringEnabled) stats.monitored++;
    });
    
    console.log('\n📊 Import Statistics:');
    console.log(`   Total groups: ${stats.total}`);
    console.log(`   By type:`, stats.byType);
    console.log(`   By risk level:`, stats.byRisk);
    console.log(`   By category:`, stats.byCategory);
    console.log(`   Monitored: ${stats.monitored}`);
    
    console.log('\n✅ Fixed import completed successfully!');
    console.log(`📄 Use the generated SQL file: ${sqlPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { importGroupsFromCSV, parseGroupRow, generateSQLInserts };
