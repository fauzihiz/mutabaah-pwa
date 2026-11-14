const fs = require('fs');
const path = require('path');
const filePath = 'components/dashboard/MutabaahGrid.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace day cell button with ActivityDropdown
content = content.replace(
    `                                                <button
                                                    disabled={locked}
                                                    onClick={() => onToggle(dateStr, activity.id)}
                                                    className={[
                                                        'w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90',
                                                        completed ? 'bg-green-600 text-white shadow-sm shadow-green-300 dark:shadow-green-900/30' : 'border hover:border-green-400 dark:hover:border-green-500',
                                                        locked ? 'cursor-not-allowed opacity-40' : '',
                                                    ].join(' ')}
                                                    style={!completed ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                                                >
                                                    {locked
                                                        ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                        : completed
                                                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                            : null
                                                    }
                                                </button>`,
    `                                                    <ActivityDropdown
                                                        value={stickerValue}
                                                        disabled={locked}
                                                        onChange={(newValue) => onToggle(dateStr, activity.id, newValue)}
                                                    />`
);

// Replace "const completed = logMap.get..." with stickerValue
content = content.replace(
    'const completed = logMap.get(`$`{dateStr}:${activity.id}`) ?? false;',
    'const stickerValue = logMap.get(`$`{dateStr}:${activity.id}`) ?? 0;'
);

fs.writeFileSync(filePath, content);
console.log('Done');
