const fs = require('fs');
const filepath = 'src/pages/admin/InstituteDashboardWorkspace.jsx';
const content = fs.readFileSync(filepath, 'utf-8');

const returnStartRegex = /  return \([\s\S]*?<motion\.div variants=\{container\} initial="hidden" animate="show" className="space-y-6 pb-12 px-6">/;
const match = returnStartRegex.exec(content);

if (!match) {
    console.log("Could not find start of return statement");
    process.exit(1);
}

const start_idx = match.index;

// Regex functions to extract blocks safely
const getBlock = (pattern) => {
    const m = pattern.exec(content);
    return m ? m[1] : '';
};

const heroHtml = getBlock(/(<section className="relative overflow-hidden.*?<\/section>)/s);
const qaHtml = getBlock(/(<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">\s*<h3 className="mb-6 font-display text-lg font-bold text-slate-950 dark:text-white">Quick Actions<\/h3>.*?<\/div>\s*<\/div>\s*<\/div>)\s*\{\/\* KPI grid \*\/\}/s);
const kpisHtml = getBlock(/\{\/\* KPI grid \*\/\}\s*<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">(.*?)<\/div>\s*\{\/\* Charts row \*\/\}/s);
const chartsHtml = getBlock(/\{\/\* Charts row \*\/\}\s*<div className="grid gap-4 xl:grid-cols-3">(.*?)<\/div>\s*\{\/\* Mid grid: growth \+ performance \+ AI \*\/\}/s);
const midHtml = getBlock(/\{\/\* Mid grid: growth \+ performance \+ AI \*\/\}\s*<div className="grid gap-3 lg:grid-cols-3">(.*?)<\/div>\s*\{\/\* Activity \+ online \+ live \*\/\}/s);
const activityHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Live activity<\/h3>.*?<\/motion\.div>)/s);
const onlineHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-2xl p-4 glass-premium xl:col-span-1">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Online pulse<\/h3>.*?<\/motion\.div>)/s);
const liveHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Live classes<\/h3>.*?<\/motion\.div>)/s);
const calHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Smart calendar<\/h3>.*?<\/motion\.div>)/s);
const commsHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Communications<\/h3>.*?<\/motion\.div>)/s);
const finHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Finance cockpit<\/h3>.*?<\/motion\.div>)/s);
const supHtml = getBlock(/(<motion\.div initial=\{\{ opacity: 0, y: 14 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-1">\s*<div className="mb-4 flex items-center justify-between">\s*<h3 className="font-display text-lg font-bold text-surface-950 dark:text-white">Support & security<\/h3>.*?<\/motion\.div>)/s);

const newLayout = `  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-4 pb-12">
      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6 min-w-0">
        
        {/* Hero & Quick Actions */}
        <div className="grid gap-6 xl:grid-cols-3">
          ${heroHtml}
          ${qaHtml}
        </div>

        {/* KPI grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          ${kpisHtml}
        </div>

        {/* Charts row */}
        <div className="grid gap-4 xl:grid-cols-2">
          ${chartsHtml}
        </div>

        {/* Mid grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          ${midHtml}
        </div>

        {/* Activity, Online, Live */}
        <div className="grid gap-4 lg:grid-cols-3">
          ${activityHtml}
          ${onlineHtml}
          ${liveHtml}
        </div>

      </div>

      {/* Right Sidebar Area */}
      <div className="space-y-6 w-full">
        ${calHtml}
        
        {/* New Widgets */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm dark:border-slate-800 dark:from-indigo-950/40 dark:to-blue-900/20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-indigo-950 dark:text-indigo-100">Upcoming Exams</h3>
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              This Week
            </span>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-white/60 p-3 shadow-sm dark:bg-slate-900/50 transition hover:shadow-md">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Mid-Term Math</p>
              <p className="text-xs text-slate-500 mt-1">Grade 10 • Tomorrow, 9:00 AM</p>
            </div>
            <div className="rounded-xl bg-white/60 p-3 shadow-sm dark:bg-slate-900/50 transition hover:shadow-md">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Physics Practical</p>
              <p className="text-xs text-slate-500 mt-1">Grade 12 • Friday, 2:00 PM</p>
            </div>
          </div>
        </motion.div>

        ${commsHtml}
        ${finHtml}
        ${supHtml}
      </div>
    </motion.div>
  );
}
`;

const newContent = content.substring(0, start_idx) + newLayout;
fs.writeFileSync(filepath, newContent, 'utf-8');
console.log("Successfully rewrote Layout.");
