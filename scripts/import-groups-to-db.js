/**
 * Script to import groups from groups.csv into the database
 * This script parses the CSV file and creates groups with proper categorization
 * 
 * IMPORTANT: This script is designed to be run against a development database
 * DO NOT run this against production database without proper backup and testing
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Database configuration - replace with your actual database connection
const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'iris_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
};

// Mock database functions - replace with actual database calls
class DatabaseService {
  constructor() {
    this.groups = [];
    this.importedCount = 0;
    this.errorCount = 0;
  }

  async addGroup(group) {
    try {
      // Here you would normally insert into your database
      // For now, we'll just log the group data
      console.log(`✅ Adding group: ${group.name}`);
      console.log(`   - Type: ${group.type}`);
      console.log(`   - Risk Level: ${group.riskLevel}`);
      console.log(`   - Members: ${group.members}`);
      console.log(`   - Platforms: ${group.platforms.join(', ')}`);
      console.log(`   - Location: ${group.location || 'N/A'}`);
      
      this.groups.push(group);
      this.importedCount++;
      
      return { success: true, id: group.id };
    } catch (error) {
      console.error(`❌ Error adding group ${group.name}:`, error);
      this.errorCount++;
      return { success: false, error: error.message };
    }
  }

  async addGroupToDatabase(group) {
    // This is where you would add the actual database insertion logic
    // Example for PostgreSQL:
    /*
    const query = `
      INSERT INTO groups (
        id, name, type, members, platforms, primary_platform, description,
        risk_level, category, location, contact_info, social_media,
        influencers, created_at, updated_at, status, monitoring_enabled
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
    `;
    
    const values = [
      group.id, group.name, group.type, group.members, 
      JSON.stringify(group.platforms), group.primaryPlatform, group.description,
      group.riskLevel, group.category, group.location, 
      JSON.stringify(group.contactInfo), JSON.stringify(group.socialMedia),
      group.influencers, group.createdAt, group.updatedAt, 
      group.status, group.monitoringEnabled
    ];
    
    await db.query(query, values);
    */
    
    // For now, just simulate success
    return { success: true, id: group.id };
  }

  getStats() {
    return {
      total: this.groups.length,
      imported: this.importedCount,
      errors: this.errorCount
    };
  }
}

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
    monitoringEnabled: riskLevel === 'high' || riskLevel === 'medium' // Auto-enable monitoring for high/medium risk
  };

  return group;
}

// Function to determine group type
function determineGroupType(name, influencers) {
  const nameLower = name.toLowerCase();
  
  // Political groups
  if (nameLower.includes('bjp') || nameLower.includes('ಕರ್ನಾಟಕ') || 
      nameLower.includes('modi') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'political';
  }
  
  // Religious groups
  if (nameLower.includes('ಹಿಂದೂ') || nameLower.includes('hindu') || 
      nameLower.includes('ಭಜರಂಗ') || nameLower.includes('bajrang') ||
      nameLower.includes('ರಾಷ್ಟ್ರ') || nameLower.includes('ರಾಷ್ಟ್ರೀಯ')) {
    return 'religious';
  }
  
  // Social groups
  if (nameLower.includes('ಸಮಾಜ') || nameLower.includes('community') ||
      nameLower.includes('ಯುವ') || nameLower.includes('youth')) {
    return 'social';
  }
  
  return 'other';
}

// Function to determine risk level
function determineRiskLevel(name, influencers) {
  const nameLower = name.toLowerCase();
  const influencersLower = (influencers || '').toLowerCase();
  
  // High risk indicators
  if (nameLower.includes('ಕಠೋರ') || nameLower.includes('ಕ್ರಾಂತಿಕಾರಿ') ||
      nameLower.includes('ಹುಲಿ') || nameLower.includes('ಸೇನಾ') ||
      nameLower.includes('ಘರ್ಜನೆ') || nameLower.includes('ಜಾಗೃತಿ')) {
    return 'high';
  }
  
  // Medium risk indicators
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

// Function to create filter categories based on groups
function createFilterCategories(groups) {
  const categories = {
    byType: {},
    byRiskLevel: {},
    byCategory: {},
    byPlatform: {},
    byLocation: {}
  };
  
  groups.forEach(group => {
    // Count by type
    categories.byType[group.type] = (categories.byType[group.type] || 0) + 1;
    
    // Count by risk level
    categories.byRiskLevel[group.riskLevel] = (categories.byRiskLevel[group.riskLevel] || 0) + 1;
    
    // Count by category
    categories.byCategory[group.category] = (categories.byCategory[group.category] || 0) + 1;
    
    // Count by platform
    group.platforms.forEach(platform => {
      categories.byPlatform[platform] = (categories.byPlatform[platform] || 0) + 1;
    });
    
    // Count by location (simplified)
    if (group.location) {
      const location = group.location.split(',')[0].trim();
      categories.byLocation[location] = (categories.byLocation[location] || 0) + 1;
    }
  });
  
  return categories;
}

// Function to generate SQL insert statements
function generateSQLInserts(groups) {
  const sqlStatements = [];
  
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
    console.log('🚀 Starting groups import from CSV...');
    console.log('⚠️  WARNING: This script will import groups into the database.');
    console.log('⚠️  Make sure you have a backup of your database before proceeding.');
    
    // Check if we should proceed
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('Do you want to proceed? (yes/no): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Import cancelled by user.');
      return;
    }
    
    const db = new DatabaseService();
    
    const groups = await importGroupsFromCSV();
    console.log(`📊 Found ${groups.length} groups in CSV`);
    
    // Create filter categories
    const filterCategories = createFilterCategories(groups);
    console.log('📋 Filter categories:', filterCategories);
    
    // Import groups to database
    console.log('\n🔄 Importing groups to database...');
    for (const group of groups) {
      await db.addGroup(group);
    }
    
    // Generate SQL file for manual import
    const sqlStatements = generateSQLInserts(groups);
    const sqlContent = `-- Groups Import SQL
-- Generated on ${new Date().toISOString()}
-- Total groups: ${groups.length}

${sqlStatements.join('\n')}
`;
    
    const sqlPath = path.join(__dirname, '../database/groups-import.sql');
    fs.writeFileSync(sqlPath, sqlContent);
    console.log(`📄 SQL file generated: ${sqlPath}`);
    
    // Show stats
    const stats = db.getStats();
    console.log('\n📊 Import Statistics:');
    console.log(`   Total groups: ${stats.total}`);
    console.log(`   Successfully imported: ${stats.imported}`);
    console.log(`   Errors: ${stats.errors}`);
    
    console.log('\n✅ Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Error importing groups:', error);
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
  createFilterCategories,
  generateSQLInserts
};
