'use client';
import React, { useState, useEffect, DragEvent } from 'react';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/utils/api';

type TaskType = {
    id: number;
    title: string;
    status: string;
};

type TasksType = {
    [key: string]: TaskType[];
};

const TaskBoard: React.FC = () => {
    const [tasks, setTasks] = useState<TasksType>({
        "Not Started": [],
        "In Progress": [],
        "Finished": []
    });
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const fetchedTasks = await fetchTasks();
            const organizedTasks: TasksType = {
                "Not Started": fetchedTasks.filter(task => task.status === 'not_started'),
                "In Progress": fetchedTasks.filter(task => task.status === 'in_progress'),
                "Finished": fetchedTasks.filter(task => task.status === 'finished')
            };
            setTasks(organizedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCreateTask = async () => {
        if (newTask.trim()) {
            try {
                await createTask({ title: newTask, status: 'not_started' });
                setNewTask('');
                loadTasks();
            } catch (error) {
                console.error('Error creating task:', error);
            }
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, task: TaskType) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(task));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>, targetColumn: string) => {
        e.preventDefault();
        const task: TaskType = JSON.parse(e.dataTransfer.getData("text/plain"));
        if (task.status === targetColumn) return;

        const newStatus = targetColumn.toLowerCase().replace(' ', '_');
        try {
            await updateTaskStatus(task.id, newStatus);
            loadTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task"
                    className="flex-grow p-2 border rounded"
                />
                <button onClick={handleCreateTask} className="p-2 bg-blue-500 text-white rounded">
                    Add Task
                </button>
            </div>
            <div className="flex gap-4">
                {Object.entries(tasks).map(([column, columnTasks]) => (
                    <div
                        key={column}
                        className="w-1/3"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column)}
                    >
                        <h2 className="text-lg font-bold mb-2">{column}</h2>
                        <div className="bg-gray-100 rounded-lg p-4 shadow-md min-h-[200px]">
                            {columnTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 bg-white rounded-lg shadow-md mb-2 cursor-move flex justify-between items-center"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task)}
                                >
                                    <span>{task.title}</span>
                                    <button 
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;