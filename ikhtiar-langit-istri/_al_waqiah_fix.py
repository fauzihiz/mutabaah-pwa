import re

path = r'c:\\Users\\fauzi\\Documents\\github\\mutabaah-pwa\\ikhtiar-langit-istri\\lib\\constants\\activityInfo.ts'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the al_waqiah entry
start_marker = '    al_waqiah: {'
end_marker = '},'

# Find the start and end positions
start_idx = content.find(start_marker)
if start_idx == -1:
    print("al_waqiah not found")
    exit(1)

end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    print("end marker not found")
    exit(1)

# Extract the content to replace
old_block = content[start_idx:end_idx + len(end_marker)]

# New block without dalil
new_block = '''
    al_waqiah: {
        ringkasan: 'Membaca Surah Al-Waqi\'ah — 78 ayat yang penuh peringatan tentang kebangkitan, keabadian, dan rezeki dari Allah.',
        keutamaan: [
            'Mengingat kebesaran dan kekuasaan Allah.',
            'Merenungi nikmat kehidupan dan rezeki dari Allah.',
            'Menumbuhkan rasa syukur atas nikmat Allah.',
        ],
    },
'''

# Replace the block
new_content = content[:start_idx] + new_block + content[end_idx + len(end_marker):]

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated al_waqiah entry")