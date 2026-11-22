import re

with open('components/dashboard/MutabaahGrid.tsx', 'r') as f:
    content = f.read()

# Fix the broken JSX structure in activity rows
# Find the pattern where we have the broken structure and fix it

# The broken pattern looks like:
# return (
# <div key={activity.id}>
#     {/* Drop-zone before this activity (except first in category) */}
#     {actIdx > 0 && ... && (
#         <div ... />
#     )}
#     className={...}  <-- ORPHANED
#     style={...}
#     onDragOver={...}
#     onDrop={...}
# >

# We need to fix it to:
# return (
# <div key={activity.id} className={...} style={...} onDragOver={...} onDrop={...}>
#     {/* Drop-zone before this activity (except first in category) */}
#     {actIdx > 0 && ... && (
#         <div ... />
#     )}
#     {/* sticky label */}

# Let me find and fix the specific section

# First, let's find the broken section and fix it
old_pattern = r'''return \(
                                    <div key=\{activity\.id\}>
                                        \{/\* Drop-zone before this activity \(except first in category\) \*/\}
                                        \{actIdx > 0 && draggedItem\?\.type === 'activity' && \(
                                            <div
                                                className=\`h-1 transition-colors \${dropTarget\?\.id === activity\.id && dropTarget\?\.position === 'before' \? 'bg-primary' : ''\}\`
                                                onDragOver=\{\(e\) => \{ e\.preventDefault\(\); e\.dataTransfer\.dropEffect = 'move'; setDropTarget\(\{ id: activity\.id, position: 'before' \}\); \}\}
                                                onDrop=\{\(e\) => \{ e\.preventDefault\(\); if \(draggedItem && draggedItem\.type === 'activity'\) reorderActivities\(draggedItem\.id, activity\.id, 'before', activity\.categoryId\)\.then\(\(\) => \{ setDraggedItem\(null\); setDropTarget\(null\); \}\); \}\}
                                            />
                                        \)\}
                                        className=\`flex min-h-12 border-b group \${isDraggingAct ? 'opacity-50' : ''} \${isDropTargetAct \? \(dropTarget!\.position === 'before' \? 'border-t-2 border-t-primary' : 'border-b-2 border-b-primary'\) : ''\}\`\}'''

new_pattern = r'''return (
                                    <div key={activity.id} className={`flex min-h-12 border-b group ${isDraggingAct ? 'opacity-50' : ''} ${isDropTargetAct ? (dropTarget!.position === 'before' ? 'border-t-2 border-t-primary' : 'border-b-2 border-b-primary') : ''}`} style={{ borderColor: 'var(--border)' }} onDragOver={(e) => handleDragOver(e, activity.id, 'activity')} onDrop={(e) => handleDrop(e, activity.id, 'activity')}>
                                        {/* Drop-zone before this activity (except first in category) */}
                                        {actIdx > 0 && draggedItem?.type === 'activity' && (
                                            <div
                                                className={`h-1 transition-colors ${dropTarget?.id === activity.id && dropTarget?.position === 'before' ? 'bg-primary' : ''}`}
                                                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropTarget({ id: activity.id, position: 'before' }); }}
                                                onDrop={(e) => { e.preventDefault(); if (draggedItem && draggedItem.type === 'activity') reorderActivities(draggedItem.id, activity.id, 'before', activity.categoryId).then(() => { setDraggedItem(null); setDropTarget(null); }); }}
                                            />
                                        )}'''

content = re.sub(old_pattern, new_pattern, content, flags=re.DOTALL)

with open('components/dashboard/MutabaahGrid.tsx', 'w') as f:
    f.write(content)

print('Fixed activity JSX structure')