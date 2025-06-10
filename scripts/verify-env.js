#!/usr/bin/env node

// Environment variables verification script
import 'dotenv/config';

const requiredEnvVars = [
  'DATABASE_URL',
  'PORT'
];

const optionalEnvVars = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY',
  'HUGGING_FACE_API_KEY',
  'HF_TOKEN',
  'SENDGRID_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'SESSION_SECRET',
  'OLLAMA_BASE_URL'
];

console.log('🔍 Environment Variables Verification\n');

// Check required variables
console.log('📋 Required Variables:');
const missingRequired = [];
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    missingRequired.push(varName);
  }
});

// Check optional variables
console.log('\n🔧 Optional Variables (AI Providers):');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET`);
  }
});

// Summary
console.log('\n📊 Summary:');
if (missingRequired.length === 0) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log(`❌ Missing required variables: ${missingRequired.join(', ')}`);
  console.log('Please add these to your .env file.');
}

const setOptional = optionalEnvVars.filter(varName => process.env[varName]);
console.log(`🔌 ${setOptional.length}/${optionalEnvVars.length} AI providers configured`);

if (setOptional.length > 0) {
  console.log('Available providers:', setOptional.join(', '));
}

console.log(`\n🚀 Server will run on PORT: ${process.env.PORT || 3000}`);

