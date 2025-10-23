/**
 * Script to generate SQL insert statements for groups from CSV
 * This script parses the CSV file and generates SQL statements for database import
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

  // Skip if no name
  if (!name || name.trim() === '') {
    return null;
  }

  // Determine group type based on name and content
  const groupType = determineGroupType(name, influencers);
  
  // Determine platform based on available URLs
  const platforms = [];
  if (facebookUrl && facebookUrl !== 'Nil') platforms.push('facebook');
  if (twitterUrl && twitterUrl !== 'Nil') platforms.push('twitter');
  if (instagramUrl && instagramUrl !== 'Nil') platforms.push('instagram');
  if (youtubeUrl && youtubeUrl !== 'Nil') platforms.push('youtube');

  // Determine risk level based on content analysis
  const riskLevel = determineRiskLevel(name, influencers);

  // Determine category based on name analysis
  const category = determineCategory(name);

  const group = {
    id: `group_${slNo || Date.now()}`,
    name: name.trim(),
    type: groupType,
    members: parseInt(members) || 0,
    platforms: platforms,
    primaryPlatform: platforms[0] || 'facebook',
    description: `Group focused on ${category.toLowerCase()} activities`,
    riskLevel: riskLevel,
    category: category,
    location: address && address !== 'Nil' ? address.trim() : null,
    contactInfo: {
      phone: phone && phone !== 'Nil' ? phone.trim() : null,
      email: email && email !== 'Nil' ? email.trim() : null
    },
    socialMedia: {
      facebook: facebookUrl && facebookUrl !== 'Nil' ? facebookUrl.trim() : null,
      twitter: twitterUrl && twitterUrl !== 'Nil' ? twitterUrl.trim() : null,
      instagram: instagramUrl && instagramUrl !== 'Nil' ? instagramUrl.trim() : null,
      youtube: youtubeUrl && youtubeUrl !== 'Nil' ? youtubeUrl.trim() : null
    },
    influencers: influencers && influencers !== 'Nil' ? influencers.trim() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    monitoringEnabled: riskLevel === 'high' || riskLevel === 'medium'
  };

  return group;
}

// Function to determine group type
function determineGroupType(name, influencers) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('bjp') || nameLower.includes('ಕರ್ನಾಟಕ') || 
      nameLower.includes('modi') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'political';
  }
  
  if (nameLower.includes('ಹಿಂದೂ') || nameLower.includes('hindu') || 
      nameLower.includes('ಭಜರಂಗ') || nameLower.includes('bajrang') ||
      nameLower.includes('ರಾಷ್ಟ್ರ') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'religious';
  }
  
  if (nameLower.includes('ಸಮಾಜ') || nameLower.includes('community') ||
      nameLower.includes('ಯುವ') || nameLower.includes('youth')) {
    return 'social';
  }
  
  return 'other';
}

// Function to determine risk level
function determineRiskLevel(name, influencers) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('ಕಠೋರ') || nameLower.includes('ಕ್ರಾಂತಿಕಾರಿ') ||
      nameLower.includes('ಹುಲಿ') || nameLower.includes('ಸೇನಾ') ||
      nameLower.includes('ಘರ್ಜನೆ') || nameLower.includes('ಜಾಗೃತಿ')) {
    return 'high';
  }
  
  if (nameLower.includes('ಪರಿಷತ್') || nameLower.includes('ವೇದಿಕೆ') ||
      nameLower.includes('ಸಂಘಟನೆ') || nameLower.includes('ಬಳಗ')) {
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
  
  if (nameLower.includes('bjp') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'Political Groups';
  }
  
  if (nameLower.includes('ಯುವ') || nameLower.includes('youth')) {
    return 'Youth Organizations';
  }
  
  if (nameLower.includes('ಸೇನಾ') || nameLower.includes('sena')) {
    return 'Militant Groups';
  }
  
  return 'Other Groups';
}

// Function to generate SQL insert statements
function generateSQLInserts(groups) {
  const sqlStatements = [];
  
  // Create table if not exists
  sqlStatements.push(`
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
`);

  // Generate insert statements
  groups.forEach(group => {
    const sql = `
INSERT INTO groups (
  id, name, type, members, platforms, primary_platform, description,
  risk_level, category, location, contact_info, social_media,
  influencers, created_at, updated_at, status, monitoring_enabled
) VALUES (
  '${group.id}',
  '${group.name.replace(/'/g, "''")}',
  '${group.type}',
  ${group.members},
  '${JSON.stringify(group.platforms).replace(/'/g, "''")}',
  '${group.primaryPlatform}',
  '${group.description.replace(/'/g, "''")}',
  '${group.riskLevel}',
  '${group.category.replace(/'/g, "''")}',
  ${group.location ? `'${group.location.replace(/'/g, "''")}'` : 'NULL'},
  '${JSON.stringify(group.contactInfo).replace(/'/g, "''")}',
  '${JSON.stringify(group.socialMedia).replace(/'/g, "''")}',
  ${group.influencers ? `'${group.influencers.replace(/'/g, "''")}'` : 'NULL'},
  '${group.createdAt}',
  '${group.updatedAt}',
  '${group.status}',
  ${group.monitoringEnabled}
);`;
    
    sqlStatements.push(sql);
  });
  
  return sqlStatements;
}

// Main execution
async function main() {
  try {
    console.log('🚀 Generating SQL for groups import...');
    
    const groups = await importGroupsFromCSV();
    console.log(`📊 Found ${groups.length} groups in CSV`);
    
    // Generate SQL statements
    const sqlStatements = generateSQLInserts(groups);
    
    // Write to file
    const sqlContent = `-- Groups Import SQL
-- Generated on ${new Date().toISOString()}
-- Total groups: ${groups.length}
-- 
-- IMPORTANT: Review this SQL before running against your database
-- Make sure you have a backup of your database before proceeding
--

${sqlStatements.join('\n')}

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
`;
    
    const sqlPath = path.join(__dirname, '../database/groups-import.sql');
    fs.writeFileSync(sqlPath, sqlContent);
    console.log(`📄 SQL file generated: ${sqlPath}`);
    
    // Generate filter categories
    const filterCategories = {
      byType: {},
      byRiskLevel: {},
      byCategory: {},
      byPlatform: {},
      byLocation: {}
    };
    
    groups.forEach(group => {
      filterCategories.byType[group.type] = (filterCategories.byType[group.type] || 0) + 1;
      filterCategories.byRiskLevel[group.riskLevel] = (filterCategories.byRiskLevel[group.riskLevel] || 0) + 1;
      filterCategories.byCategory[group.category] = (filterCategories.byCategory[group.category] || 0) + 1;
      
      group.platforms.forEach(platform => {
        filterCategories.byPlatform[platform] = (filterCategories.byPlatform[platform] || 0) + 1;
      });
      
      if (group.location) {
        const location = group.location.split(',')[0].trim();
        filterCategories.byLocation[location] = (filterCategories.byLocation[location] || 0) + 1;
      }
    });
    
    // Write filter categories to JSON file
    const filterPath = path.join(__dirname, '../database/groups-filters.json');
    fs.writeFileSync(filterPath, JSON.stringify(filterCategories, null, 2));
    console.log(`📄 Filter categories generated: ${filterPath}`);
    
    console.log('\n📊 Filter Categories:');
    console.log(JSON.stringify(filterCategories, null, 2));
    
    console.log('\n✅ SQL generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated SQL file');
    console.log('2. Backup your database');
    console.log('3. Run the SQL against your database');
    console.log('4. Update your API endpoints to use the new groups table');
    
  } catch (error) {
    console.error('❌ Error generating SQL:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  importGroupsFromCSV,
  parseGroupRow,
  determineGroupType,
  determineRiskLevel,
  determineCategory,
  generateSQLInserts
};
