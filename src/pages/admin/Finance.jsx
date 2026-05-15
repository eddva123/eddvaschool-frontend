import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart, LineChart, TrendingUp, 
  Wallet, Landmark, Receipt, ArrowUpRight, 
  ArrowDownRight, Calendar, Filter, Download,
  Wallet2, CreditCard, Banknote
} from 'lucide-react';
import { cn } from '../../components/admin/Skeleton';

export default function Finance() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Finance Overview</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Monitor institute cash flow, expenses, and financial growth.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm">Monthly</button>
          <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FinancialSummaryCard 
              title="Total Cash Flow" 
              amount="₹8.4M" 
              trend="+15%" 
              isPositive={true}
              icon={Wallet2}
              color="bg-blue-600"
            />
            <FinancialSummaryCard 
              title="Operational Cost" 
              amount="₹3.2M" 
              trend="+2.4%" 
              isPositive={false}
              icon={CreditCard}
              color="bg-rose-600"
            />
          </div>

          <div className="glass-premium rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Income vs Expenses</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expenses</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-4 px-4">
              {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end gap-1 h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="flex-1 bg-blue-600 rounded-t-lg opacity-80"
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 0.4}%` }}
                      className="flex-1 bg-rose-500 rounded-t-lg opacity-80"
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-400">MAY {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Expense Allocation</h3>
            <div className="space-y-6">
              <ExpenseCategory label="Staff Salaries" amount="₹2.4M" percentage={75} color="bg-blue-600" />
              <ExpenseCategory label="Infrastructure" amount="₹450K" percentage={15} color="bg-indigo-500" />
              <ExpenseCategory label="Maintenance" amount="₹180K" percentage={6} color="bg-violet-400" />
              <ExpenseCategory label="Others" amount="₹120K" percentage={4} color="bg-slate-300" />
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <Receipt size={16} />
              View All Bills
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Landmark size={20} className="text-emerald-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Reserve Fund</span>
              </div>
              <h3 className="text-4xl font-black mb-1">₹4.2Cr</h3>
              <p className="text-sm font-medium text-emerald-100/80 mb-6">Securely managed for future expansion.</p>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-center">
                  <div className="text-lg font-black tracking-tight">8.5%</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">APY</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black tracking-tight">₹12L</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Int. Earned</div>
                </div>
                <button className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                  <TrendingUp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialSummaryCard({ title, amount, trend, isPositive, icon: Icon, color }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center gap-6">
      <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-lg", color)}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{amount}</h3>
          <span className={cn(
            "flex items-center text-[10px] font-black",
            isPositive ? "text-emerald-600" : "text-rose-600"
          )}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function ExpenseCategory({ label, amount, percentage, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-black text-slate-900">{label}</p>
          <p className="text-[10px] font-bold text-slate-400">{amount}</p>
        </div>
        <span className="text-[10px] font-black text-slate-900">{percentage}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
