const fs = require('fs');
const filepath = 'src/pages/admin/InstituteDashboardWorkspace.jsx';
let c = fs.readFileSync(filepath, 'utf8');

c = c.replace(
    '<motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-12 px-6">', 
    '<motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-4 pb-12 px-6">\n      {/* Main Content Area */}\n      <div className="lg:col-span-3 space-y-6 min-w-0">'
);

const startIdx = c.indexOf('{/* Calendar + comms + finance + support */}');
const gridStartIdx = c.indexOf('<div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">', startIdx);
const lastMotionDiv = c.lastIndexOf('</motion.div>');
const gridEndIdx = c.lastIndexOf('</div>', lastMotionDiv);

const insideGrid = c.substring(gridStartIdx + '<div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">'.length, gridEndIdx);

const rightSidebar = `
      </div>
      {/* Right Sidebar Area */}
      <div className="space-y-6 w-full shrink-0">
` + insideGrid + `
        {/* Upcoming Exams Widget */}
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
      </div>
`;

fs.writeFileSync(filepath, c.substring(0, startIdx) + rightSidebar + c.substring(gridEndIdx + '</div>'.length));
console.log('Done v2');
