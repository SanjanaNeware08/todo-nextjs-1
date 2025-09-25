'use client'
import { useEffect, useMemo, useState } from 'react';
import { fetchTasks, Task } from '@/services/tasks.service';
import AddTaskDialog from '@/components/forms/addtask';
import AddIcon from '@mui/icons-material/Add';

type Filters = {
    status?: 'todo' | 'in_progress' | 'done';
    search?: string;
    dueTo?: string;   // YYYY-MM-DD
  }

export default function Upcomingtask(){
    const [filters, setFilters] = useState<Filters>({});
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [refreshToken, setRefreshToken] = useState(0);

    const tomorrowStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }, []);

    const query = useMemo(() => ({
        page,
        limit,
        status: filters.status,
        search: filters.search,
        dueFrom: tomorrowStr,
        dueTo: filters.dueTo,
    }), [page, limit, filters, tomorrowStr]);

    useEffect(() => {
        const load = async () => {
          setLoading(true);
          setError(null);
          try{
            const res = await fetchTasks(query);
            setTasks(res.tasks || []);
            setTotalPages(res.pagination?.totalPages || 1);
          }catch(err:any){
            setError('Failed to load tasks');
          }finally{
            setLoading(false);
          }
        };
        load();
      }, [query, refreshToken]);

      const onFilterChange = (name: keyof Filters, value: string) => {
        setPage(1);
        setFilters(prev => ({ ...prev, [name]: value || undefined }));
      };
    
    const statusBadge = (status: Task['status']) => {
        const base = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium';
        const map: Record<Task['status'], string> = {
            todo: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
            in_progress: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
            done: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
        };
        return `${base} ${map[status]}`;
    };

    return(
        <section className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 md:p-7 backdrop-blur">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold">Upcoming Tasks</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
                        aria-label="Add task"
                    >
                        <AddIcon fontSize="small" />
                        <span className="hidden sm:inline">Add</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <input 
                    value={filters.search || ''}
                    placeholder="Search task"
                    onChange={(e)=>onFilterChange('search', e.target.value)}
                    className="px-3 py-2 rounded-md bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <select
                    value={filters.status || ''}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="px-3 py-2 rounded-md bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                    <option value="">All statuses</option>
                    <option value="todo">To do</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                </select>
                <input
                    type="date"
                    value={filters.dueTo || ''}
                    onChange={(e) => onFilterChange('dueTo', e.target.value)}
                    className="px-3 py-2 rounded-md bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
            </div>

            {loading && <div className="text-sm opacity-80">Loading...</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}

            {!loading && !error && (
                <div className="grid gap-3">
                    {tasks.length === 0 && (<div className="text-sm opacity-70">No tasks found</div>)}
                    {(() => {
                        const clientPaginate = totalPages === 1 && tasks.length > limit;
                        const start = (page - 1) * limit;
                        const end = start + limit;
                        const visible = clientPaginate ? tasks.slice(start, end) : tasks;
                        return visible.map(t => (
                        <div key={t._id} className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-colors p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="text-base font-semibold truncate">{t.title}</div>
                                    <div className="text-sm opacity-80 line-clamp-2">{t.description}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className={statusBadge(t.status)}>{t.status.replace('_',' ')}</span>
                                    <div className="text-xs opacity-80">Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
                                </div>
                            </div>
                        </div>
                        ))
                    })()}
                </div>
            )}

            <div className="flex items-center justify-between mt-6">
                <button
                    disabled={page<=1}
                    onClick={() => setPage(p => Math.max(1, p-1))}
                    className="px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
                >
                    Prev
                </button>
                {(() => {
                    const clientPaginate = totalPages === 1 && tasks.length > limit;
                    const effectiveTotalPages = clientPaginate ? Math.ceil(tasks.length / limit) : totalPages;
                    return (
                        <div className="text-sm opacity-80">Page {page} / {effectiveTotalPages}</div>
                    );
                })()}
                <button
                    disabled={(totalPages === 1 && tasks.length > limit ? page >= Math.ceil(tasks.length / limit) : page >= totalPages)}
                    onClick={() => setPage(p => p+1)}
                    className="px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <AddTaskDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreated={(task) => {
                    // Optimistically add if due date is after today
                    if (task.dueDate) {
                        const due = new Date(task.dueDate);
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        if (due > today) {
                            setTasks(prev => [task, ...prev]);
                        }
                    }
                    setPage(1);
                    setRefreshToken(x => x + 1);
                }}
            />
        </section>
    );
}