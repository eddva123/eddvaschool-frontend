import re
import os

filepath = 'src/pages/admin/InstituteDashboardWorkspace.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the main layout structure
# Find the start of the return statement
match = re.search(r'  return \(\n    <motion\.div variants=\{container\} initial="hidden" animate="show" className="space-y-6 pb-12 px-6">', content)
if not match:
    print("Could not find start of return statement")
    exit(1)

start_idx = match.start()

# We need to extract the existing sections to re-insert them into the new grid.
# Actually, since I have full access to the source code, it's easier to just use regex to extract the chunks.

# Hero Section
hero_match = re.search(r'(<section className="relative overflow-hidden.*?</section>)', content, re.DOTALL)
hero_html = hero_match.group(1) if hero_match else ''

# Quick Actions
qa_match = re.search(r'(<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">\s*<h3 className="mb-6 font-display text-lg font-bold text-slate-950 dark:text-white">Quick Actions</h3>.*?)</div>\s*</div>\s*</div>\s*\{/\* KPI grid \*/\}', content, re.DOTALL)
qa_html = qa_match.group(1) + "\n</div>" if qa_match else ''

# KPIs
kpi_match = re.search(r'\{/\* KPI grid \*/\}\s*<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">(.*?)</div>\s*\{/\* Charts row \*/\}', content, re.DOTALL)
kpis_html = kpi_match.group(1) if kpi_match else ''

# Charts Row
charts_match = re.search(r'\{/\* Charts row \*/\}\s*<div className="grid gap-4 xl:grid-cols-3">(.*?)</div>\s*\{/\* Mid grid: growth \+ performance \+ AI \*/\}', content, re.DOTALL)
charts_html = charts_match.group(1) if charts_match else ''

# Mid Grid
mid_match = re.search(r'\{/\* Mid grid: growth \+ performance \+ AI \*/\}\s*<div className="grid gap-3 lg:grid-cols-3">(.*?)</div>\s*\{/\* Activity \+ online \+ live \*/\}', content, re.DOTALL)
mid_html = mid_match.group(1) if mid_match else ''

# Activity
activity_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Live activity</h3>.*?)</motion\.div>', content, re.DOTALL)
activity_html = activity_match.group(1) + "</motion.div>" if activity_match else ''

# Online Pulse
online_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-2xl p-4 glass-premium xl:col-span-1">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Online pulse</h3>.*?)</motion\.div>', content, re.DOTALL)
online_html = online_match.group(1) + "</motion.div>" if online_match else ''

# Live Classes
live_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Live classes</h3>.*?)</motion\.div>', content, re.DOTALL)
live_html = live_match.group(1) + "</motion.div>" if live_match else ''

# Calendar
cal_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Smart calendar</h3>.*?)</motion\.div>', content, re.DOTALL)
cal_html = cal_match.group(1) + "</motion.div>" if cal_match else ''

# Comms
comms_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Communications</h3>.*?)</motion\.div>', content, re.DOTALL)
comms_html = comms_match.group(1) + "</motion.div>" if comms_match else ''

# Finance
fin_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Finance cockpit</h3>.*?)</motion\.div>', content, re.DOTALL)
fin_html = fin_match.group(1) + "</motion.div>" if fin_match else ''

# Support
sup_match = re.search(r'(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Support & security</h3>.*?)</motion\.div>', content, re.DOTALL)
sup_html = sup_match.group(1) + "</motion.div>" if sup_match else ''


new_layout = f"""  return (
    <motion.div variants={{container}} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-4 pb-12">
      {{/* Main Content Area */}}
      <div className="lg:col-span-3 space-y-6">
        
        {{/* Hero & Quick Actions */}}
        <div className="grid gap-6 xl:grid-cols-3">
          {hero_html}
          {qa_html}
        </div>

        {{/* KPI grid */}}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {kpis_html}
        </div>

        {{/* Charts row */}}
        <div className="grid gap-4 xl:grid-cols-2">
          {charts_html}
        </div>

        {{/* Mid grid */}}
        <div className="grid gap-4 lg:grid-cols-2">
          {mid_html}
        </div>

        {{/* Activity, Online, Live */}}
        <div className="grid gap-4 lg:grid-cols-3">
          {activity_html}
          {online_html}
          {live_html}
        </div>

      </div>

      {{/* Right Sidebar Area */}}
      <div className="space-y-6">
        {cal_html}
        {comms_html}
        {fin_html}
        {sup_html}

        {{/* New Widgets */}}
        <motion.div initial={{{{ opacity: 0, y: 14 }}}} animate={{{{ opacity: 1, y: 0 }}}} className="rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm dark:border-slate-800 dark:from-indigo-950/40 dark:to-blue-900/20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-indigo-950 dark:text-indigo-100">Upcoming Exams</h3>
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              This Week
            </span>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-white/60 p-3 dark:bg-slate-900/50">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Mid-Term Math</p>
              <p className="text-xs text-slate-500 mt-1">Grade 10 • Tomorrow, 9:00 AM</p>
            </div>
            <div className="rounded-xl bg-white/60 p-3 dark:bg-slate-900/50">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Physics Practical</p>
              <p className="text-xs text-slate-500 mt-1">Grade 12 • Friday, 2:00 PM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}}
"""

new_content = content[:start_idx] + new_layout

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Successfully rewrote Layout.")
