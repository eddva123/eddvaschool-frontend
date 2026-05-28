import React from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Timetable() {
  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Timetable schedule entries representation
  const routine = {
    'Monday': [
      { slot: '09:00 AM', subject: 'Physics', code: 'PHY-12', room: 'Hall A', teacher: 'Dr. HC Verma' },
      { slot: '12:00 PM', subject: 'Mathematics', code: 'MATH-04', room: 'Room 302', teacher: 'Er. SK Munjal' }
    ],
    'Tuesday': [
      { slot: '10:30 AM', subject: 'Chemistry', code: 'CHEM-22', room: 'Lab B', teacher: 'Prof. KK Kapoor' },
      { slot: '02:00 PM', subject: 'Biology', code: 'BIO-10', room: 'Room 105', teacher: 'Dr. Ritu Rathee' }
    ],
    'Wednesday': [
      { slot: '09:00 AM', subject: 'Physics', code: 'PHY-12', room: 'Hall A', teacher: 'Dr. HC Verma' },
      { slot: '12:00 PM', subject: 'Mathematics', code: 'MATH-04', room: 'Room 302', teacher: 'Er. SK Munjal' }
    ],
    'Thursday': [
      { slot: '10:30 AM', subject: 'Chemistry', code: 'CHEM-22', room: 'Lab B', teacher: 'Prof. KK Kapoor' }
    ],
    'Friday': [
      { slot: '09:00 AM', subject: 'Physics', code: 'PHY-12', room: 'Hall A', teacher: 'Dr. HC Verma' },
      { slot: '12:00 PM', subject: 'Mathematics', code: 'MATH-04', room: 'Room 302', teacher: 'Er. SK Munjal' }
    ],
    'Saturday': [
      { slot: '10:30 AM', subject: 'Chemistry', code: 'CHEM-22', room: 'Lab B', teacher: 'Prof. KK Kapoor' }
    ]
  };

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Weekly Class Timetable</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Track scheduled classes, lecture halls, and instructor details</p>
        </div>
      </div>

      {/* Routine schedule representation */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar border border-slate-200/50 bg-white/60 rounded-3xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 p-6">
        <div className="min-w-[800px] grid grid-cols-7 gap-4">
          {/* Time column header */}
          <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-2">
            Time Slot
          </div>
          {days.map((day) => (
            <div key={day} className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest text-center border-b border-slate-100 pb-2 dark:border-slate-800">
              {day}
            </div>
          ))}

          {/* Time row entries */}
          {timeSlots.map((slot) => (
            <React.Fragment key={slot}>
              {/* Time slot header cell */}
              <div className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-450 h-28 border-r border-slate-100/50 pr-2 dark:border-slate-800/50">
                <Clock size={12} className="mr-1.5" /> {slot}
              </div>

              {/* Day cells for that slot */}
              {days.map((day) => {
                const classItem = routine[day]?.find(item => item.slot === slot);
                return (
                  <div key={day} className="h-28 flex flex-col justify-center">
                    {classItem ? (
                      <div className="h-full flex flex-col justify-between rounded-2xl bg-indigo-50/50 p-3 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50 hover:shadow-sm transition-all">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">{classItem.subject}</span>
                            <span className="text-[9px] font-bold text-slate-400">{classItem.code}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 block mt-1">Instructor: {classItem.teacher}</span>
                        </div>
                        <div className="flex items-center text-[9px] font-bold text-slate-500 gap-1">
                          <MapPin size={10} />
                          <span>{classItem.room}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full rounded-2xl border border-dashed border-slate-150 bg-slate-50/10 dark:border-slate-800/40" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
