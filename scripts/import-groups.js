/**
 * Script to import groups from groups.csv into the database
 * This script parses the CSV file and creates groups with proper categorization
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Mock database functions - replace with actual database calls
const mockDatabase = {
  groups: [],
  addGroup: function(group) {
    this.groups.push(group);
    console.log(`Added group: ${group.name}`);
  }
};

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
        console.log(`Parsed ${groups.length} groups from CSV`);
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
    monitoringEnabled: true
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

// Main execution
async function main() {
  try {
    console.log('Starting groups import from CSV...');
    
    const groups = await importGroupsFromCSV();
    console.log(`Found ${groups.length} groups in CSV`);
    
    // Create filter categories
    const filterCategories = createFilterCategories(groups);
    console.log('Filter categories:', filterCategories);
    
    // Here you would normally save to database
    // For now, we'll just log the structure
    console.log('\nSample group structure:');
    console.log(JSON.stringify(groups[0], null, 2));
    
    console.log('\nFilter categories for sidebar:');
    console.log(JSON.stringify(filterCategories, null, 2));
    
    console.log('\nImport completed successfully!');
    
  } catch (error) {
    console.error('Error importing groups:', error);
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
  createFilterCategories
};
