#!/usr/bin/env python3
import re

path = r'c:\\Users\\fauzi\\Documents\\github\\mutabaah-pwa\\ikhtiar-langit-istri\\lib\\constants\\activityInfo.ts'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and fix the al_waqiah block - it has the wrong property order
# Remove the catatan line from al_waqiah which is incorrectly placed
lines = content.split('\n')
new_lines = []
skip_next = False
in_al_waqiah = False
found_al_waqiah_st6art = False

for i, line in enumerate(lines):
    # Detect al_waqiah block start
    if 'al_waqiah: {' in line:
        in_al_waqiah = True
        found_al_waqiah_start = True
        new_lines.append(line)
        continue
    
    if in_al_waqiah:
        # Skip the catatan line if it's the one from zikir_tasbih_tidur
        if "catatan: 'Dzikir ini amalan ringan" in line:
            continue
        # If we hit the next entry or closing brace, we're done with al_waqiah
        if 'zikir_tasbih_tidur: {' in line or (line.strip() == '}' and i > 740):
            in_al_waqiah = False
    
    new_lines.append(line)

# Write back
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Fixed al_waqiah block")