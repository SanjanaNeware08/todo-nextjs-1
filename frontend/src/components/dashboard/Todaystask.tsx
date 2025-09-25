'use client'

import { useEffect, useMemo, useState } from 'react';
import { fetchTasks, Task } from '@/services/tasks.service';
import AddTaskDialog from '@/components/forms/addtask';
import AddIcon from '@mui/icons-material/Add';

export default function TodaysTask() {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshToken, setRefreshToken] = useState(0);

    const todayStr = useMemo(() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }, []);

    const query = useMemo(() => ({
        page,
        limit,
        dueFrom: todayStr,
        dueTo: todayStr,
    }), [page, limit, todayStr]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try{
                const res = await fetchTasks(query);
                setTasks(res.tasks || []);
                setTotalPages(res.pagination?.totalPages || 1);
            }catch{
                setError('Failed to load tasks');
            }finally{
                setLoading(false);
            }
        };
        load();
    }, [query, refreshToken]);

    const [open, setOpen] = useState(false);

    const statusBadge = (status: Task['status']) => {
        const base = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium';
        const map: Record<Task['status'], string> = {
            todo: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
            in_progress: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
            done: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
        };
        return `${base} ${map[status]}`;
    };

    const clientPaginate = totalPages === 1 && tasks.length > limit;
    const effectiveTotalPages = clientPaginate ? Math.ceil(tasks.length / limit) : totalPages;
    const start = (page - 1) * limit;
    const end = start + limit;
    const visibleTasks = clientPaginate ? tasks.slice(start, end) : tasks;

    return (
        <section className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 md:p-7 backdrop-blur">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold">Today&apos;s Tasks</h2>
                <div className="flex items-center gap-3">
                    <div className="text-sm opacity-70 hidden md:block">{new Date().toLocaleDateString()}</div>
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

            {loading && <div className="text-sm opacity-80">Loading...</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}

            {!loading && !error && (
                <div className="grid gap-3">
                    {visibleTasks.length === 0 && (
                        <div className="text-sm opacity-70">No tasks found</div>
                    )}
                    {visibleTasks.map(t => (
                        <div
                            key={t._id}
                            className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-colors p-4"
                        >
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
                    ))}
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
                <div className="text-sm opacity-80">Page {page} / {effectiveTotalPages}</div>
                <button
                    disabled={page >= effectiveTotalPages}
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
                    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
                    const today = new Date(todayStr + 'T00:00:00');
                    const isToday = taskDate ? (
                        taskDate.getFullYear() === today.getFullYear() &&
                        taskDate.getMonth() === today.getMonth() &&
                        taskDate.getDate() === today.getDate()
                    ) : false;
                    if (isToday) {
                        setTasks(prev => [task, ...prev]);
                    }
                    setPage(1);
                    setRefreshToken(x => x + 1);
                }}
            />
        </section>
    )
}






