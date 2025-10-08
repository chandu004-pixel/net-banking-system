// checkAllPackages.js

const packageJson = require('../package.json');

console.log('--- Checking All Dependencies ---');
let allGood = true;

const packages = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
};

if (Object.keys(packages).length === 0) {
    console.log('No dependencies found in package.json.');
} else {
    for (const pkg in packages) {
        try {
            require(pkg);
            console.log(`✅ ${pkg} is installed.`);
        } catch (error) {
            console.error(`❌ ERROR: ${pkg} could not be loaded.`);
            allGood = false;
        }
    }
}

console.log('-----------------------------');

if (allGood) {
    console.log('🎉 All packages loaded successfully!');
} else {
    console.log('⚠️ Some packages failed to load. Please run `npm install` to fix.');
    process.exit(1); 
}