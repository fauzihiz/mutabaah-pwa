const fs = require('fs');
const filePath = 'components/dashboard/MutabaahGrid.tsx';
const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(l => l.replace(/\r$/, ''));

let buttonStartIdx = -1, buttonEndIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<button') && lines[i].includes('disabled={locked}')) {
        buttonStartIdx = i;
        break;
    }
}
if (buttonStartIdx === -1) throw new Error('day cell button start not found');

for (let i = buttonStartIdx; i < lines.length; i++) {
    if (lines[i].includes('</button>')) {
        buttonEndIdx = i;
        break;
    }
}
if (buttonEndIdx === -1) throw new Error('day cell button end not found');

// ActivityDropdown handles the trigger UI, popover and state internally
const replacement = [
    '                                                    <ActivityDropdown',
    '                                                        value={stickerValue}',
    '                                                        disabled={locked}',
    '                                                        onChange={(newValue) => onToggle(dateStr, activity.id, newValue)}',
    '                                                    />'
];

lines.splice(buttonStartIdx, buttonEndIdx - buttonStartIdx + 1, ...replacement);

fs.writeFileSync(filePath, lines.join('\r\n'));
console.log('OK: replaced day cell button at lines', buttonStartIdx + 1, '-', buttonEndIdx + 1);
