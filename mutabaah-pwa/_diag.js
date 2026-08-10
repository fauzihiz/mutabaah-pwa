const fs = require('fs');
const files = [
  'c:/Users/fauzi/Documents/github/mutabaah-pwa/mutabaah-pwa/components/dashboard/NavigationDrawer.tsx',
  'c:/Users/fauzi/Documents/github/mutabaah-pwa/mutabaah-pwa/components/dashboard/ChangelogModal.tsx',
  'c:/Users/fauzi/Documents/github/mutabaah-pwa/mutabaah-pwa/components/dashboard/StatsView.tsx',
];
files.forEach(f => {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  console.log('\n=== ' + f.split('/').pop() + ' (' + lines.length + ' lines) ===');
  lines.slice(-12).forEach((l, i) => console.log((lines.length - 11 + i) + ': ' + l));
});
