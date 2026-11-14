const fs = require('fs');
const p = 'components/dashboard/MutabaahGrid.tsx';

const buf = fs.readFileSync(p);
let s = buf.toString('utf8').replace(/\r\n/g, '\n');

// 1) Replace day-cell button
const buttonBlock = `
                                                    <ActivityDropdown
                                                        value={stickerValue}
                                                        disabled={locked}
                                                        onChange={(newValue) => onToggle(dateStr, activity.id, newValue)}
                                                    />`.trim();

const btnStart = s.indexOf('                                                    <button');
if (btnStart === -1) throw new Error('button not found');
const btnEnd = s.indexOf('                                                    </div>', btnStart);
if (btnEnd === -1) throw new Error('button end not found');

s = s.slice(0, btnStart) + buttonBlock + s.slice(btnEnd + '</div>'.length);

// 2) Insert supporting-stickers popover before root closing div
const popover = `
            {/* Supporting stickers popover */}
            {showSupportingMenu && targetActivity && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        left: menuPosition.x,
                        top: menuPosition.y,
                        zIndex: 9999,
                        pointerEvents: 'auto',
                        transform: 'translate(-50%, -50%)',
                    }}
                    className="bg-white dark:bg-slate-900 border rounded-2xl shadow-xl p-2 space-y-2 w-56 max-w-[80vw]"
                >
                    <div className="space-y-1">
                        <p
                            className="text-[9px] font-black uppercase tracking-widest px-2 pt-1"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Stiker Pendukung
                        </p>
                        {getSupportingStickers().map(sticker => {
                            const isActive = (activityFlags[targetActivity] ?? []).includes(sticker.value);
                            return (
                                <button
                                    key={sticker.value}
                                    onClick={() => toggleFlag(targetActivity, sticker.value)}
                                    className={[
                                        'w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2',
                                        isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                                    ].join(' ')}
                                >
                                    <span
                                        className={[
                                            'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-base',
                                            isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700',
                                        ].join(' ')}
                                    >
                                        {sticker.icon}
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                                            {sticker.label}
                                        </span>
                                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                            {sticker.description}
                                        </span>
                                    </span>
                                    {isActive && (
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-600 flex-shrink-0 mt-1"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}`;

const rootClose = s.lastIndexOf('        </div>');
const retClose = s.lastIndexOf('    );');
if (rootClose === -1 || retClose === -1 || rootClose >= retClose) throw new Error('placement markers not found');

s = s.slice(0, rootClose) + popover + s.slice(rootClose);

fs.writeFileSync(p, s, 'utf8');
console.log('File updated successfully');
