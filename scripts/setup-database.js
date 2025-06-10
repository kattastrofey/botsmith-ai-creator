#!/usr/bin/env node

// Database setup helper script
import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🗄️  Database Setup Helper\n');

const envPath = join(process.cwd(), '.env');

function updateEnvFile(key, value) {
  try {
    let envContent = readFileSync(envPath, 'utf8');
    
    // Check if the key exists
    const keyRegex = new RegExp(`^${key}=.*$`, 'm');
    if (keyRegex.test(envContent)) {
      // Update existing key
      envContent = envContent.replace(keyRegex, `${key}=${value}`);
    } else {
      // Add new key
      envContent += `\n${key}=${value}\n`;
    }
    
    writeFileSync(envPath, envContent);
    console.log(`✅ Updated ${key} in .env file`);
  } catch (error) {
    console.error(`❌ Failed to update .env file: ${error.message}`);
  }
}

// Check current DATABASE_URL
const currentUrl = process.env.DATABASE_URL;
if (!currentUrl) {
  console.log('❌ DATABASE_URL is not set in your .env file');
} else if (currentUrl.includes('your_neon_database_url_here') || 
           currentUrl.includes('ep-example-123456')) {
  console.log('⚠️  DATABASE_URL is set to a placeholder value');
  console.log('Current value:', currentUrl.substring(0, 50) + '...');
} else {
  console.log('✅ DATABASE_URL appears to be configured');
  console.log('Current value:', currentUrl.substring(0, 50) + '...');
}

console.log('\n📋 Database URL Format Examples:');
console.log('\n🌐 Neon (Recommended for production):');
console.log('postgresql://username:password@ep-abc123-def456.us-east-1.aws.neon.tech/database_name?sslmode=require');

console.log('\n💻 Local PostgreSQL:');
console.log('postgresql://username:password@localhost:5432/database_name');

console.log('\n📖 Instructions:');
console.log('1. Sign up for Neon at https://neon.tech/');
console.log('2. Create a new project and database');
console.log('3. Copy the connection string from your Neon dashboard');
console.log('4. Replace the DATABASE_URL in your .env file');
console.log('5. Run `npm run verify-env` to verify your configuration');

console.log('\n🔧 To set up a local PostgreSQL database instead:');
console.log('1. Install PostgreSQL on your system');
console.log('2. Create a database: `createdb adoptabot_db`');
console.log('3. Update DATABASE_URL with your local credentials');

// Offer to create a basic local database URL
if (process.argv.includes('--local')) {
  const localUrl = 'postgresql://postgres:password@localhost:5432/adoptabot_db';
  updateEnvFile('DATABASE_URL', localUrl);
  console.log('\n🚀 Set DATABASE_URL to local PostgreSQL. Make sure PostgreSQL is running!');
}

console.log('\n💡 Tip: Run this script with --local flag to set up a local PostgreSQL URL');
console.log('Example: npm run setup-db -- --local');

