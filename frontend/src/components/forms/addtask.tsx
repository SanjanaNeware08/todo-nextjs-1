'use client'
import { useState } from 'react';
import toast from "react-hot-toast";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { createTask, Task } from '@/services/tasks.service';
 

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (task: Task) => void;
}

export default function AddTaskDialog({ open, onClose, onCreated }: Props){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [submitting, setSubmitting] = useState(false);
  const [isToday,setIsToday] = useState(false);

  const handleSubmit = async () => {
    if(!title.trim()) return;
    setSubmitting(true);
    try{
      const res = await createTask({ title, description, dueDate: dueDate || undefined, status });
      if(res.success && res.task){
        onCreated?.(res.task);
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('todo');
        toast.success('Task created successfully');
        onClose();
      }
    } finally{
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <div className="space-y-4 py-2">
          <TextField label="Title" variant="standard" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Description" variant="standard" fullWidth multiline minRows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Due date" type="date" variant="standard" fullWidth value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField select label="Status" variant="standard" fullWidth value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
            <MenuItem value="todo">To do</MenuItem>
            <MenuItem value="in_progress">In progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || !title.trim()}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}


