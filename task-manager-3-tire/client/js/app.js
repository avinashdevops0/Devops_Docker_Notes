// API Configuration
const API_BASE_URL = '/api';

// DOM Elements
let currentTaskId = null;
let deleteTaskId = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadStats();
    
    // Setup form submission
    document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);
});

// Load all tasks
async function loadTasks() {
    const statusFilter = document.getElementById('status-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    
    let url = `${API_BASE_URL}/tasks`;
    const params = new URLSearchParams();
    
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    try {
        showLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            displayTasks(result.data);
        } else {
            showError('Failed to load tasks');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Error loading tasks. Please check your connection.');
    } finally {
        showLoading(false);
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks-list');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks found</h3>
                <p>Add your first task to get started!</p>
                <button class="btn btn-primary" onclick="openTaskModal()">
                    <i class="fas fa-plus"></i> Add Task
                </button>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status} ${task.priority}-priority">
            <div class="task-info">
                <h3>${task.title}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <div class="task-meta">
                    <span class="status-${task.status}">
                        <i class="fas fa-circle"></i> ${task.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span class="priority-${task.priority}">
                        <i class="fas fa-flag"></i> ${task.priority.toUpperCase()}
                    </span>
                    ${task.due_date ? `
                        <span style="background: #6c757d20; color: #6c757d;">
                            <i class="fas fa-calendar"></i> ${new Date(task.due_date).toLocaleDateString()}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-success" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="showDeleteConfirm(${task.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Load statistics
async function loadStats() {
    try {
        const [tasksRes, statsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/tasks`),
            fetch(`${API_BASE_URL}/tasks/stats`)
        ]);
        
        const tasksData = await tasksRes.json();
        const statsData = await statsRes.json();
        
        if (tasksData.success) {
            document.getElementById('total-tasks').textContent = tasksData.count;
            
            // Calculate status counts
            const pending = tasksData.data.filter(t => t.status === 'pending').length;
            const inProgress = tasksData.data.filter(t => t.status === 'in-progress').length;
            const completed = tasksData.data.filter(t => t.status === 'completed').length;
            
            document.getElementById('pending-tasks').textContent = pending;
            document.getElementById('progress-tasks').textContent = inProgress;
            document.getElementById('completed-tasks').textContent = completed;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Open task modal for creating/editing
function openTaskModal(task = null) {
    const modal = document.getElementById('task-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('task-form');
    
    if (task) {
        title.textContent = 'Edit Task';
        document.getElementById('task-id').value = task.id;
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description || '';
        document.getElementById('status').value = task.status;
        document.getElementById('priority').value = task.priority;
        document.getElementById('due-date').value = task.due_date || '';
        currentTaskId = task.id;
    } else {
        title.textContent = 'Add New Task';
        form.reset();
        document.getElementById('task-id').value = '';
        currentTaskId = null;
    }
    
    modal.style.display = 'flex';
}

// Close task modal
function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none';
}

// Handle form submission
async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        due_date: document.getElementById('due-date').value || null
    };
    
    if (!taskData.title) {
        showError('Title is required');
        return;
    }
    
    const taskId = document.getElementById('task-id').value;
    const isEdit = !!taskId;
    
    try {
        const url = isEdit ? `${API_BASE_URL}/tasks/${taskId}` : `${API_BASE_URL}/tasks`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeTaskModal();
            loadTasks();
            loadStats();
            showSuccess(isEdit ? 'Task updated successfully!' : 'Task created successfully!');
        } else {
            showError(result.message || 'Failed to save task');
        }
    } catch (error) {
        console.error('Error saving task:', error);
        showError('Error saving task. Please try again.');
    }
}

// Edit task
async function editTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
        const result = await response.json();
        
        if (result.success) {
            openTaskModal(result.data);
        } else {
            showError('Failed to load task for editing');
        }
    } catch (error) {
        console.error('Error loading task:', error);
        showError('Error loading task');
    }
}

// Show delete confirmation
function showDeleteConfirm(id) {
    deleteTaskId = id;
    document.getElementById('confirm-modal').style.display = 'flex';
}

// Close confirm modal
function closeConfirmModal() {
    deleteTaskId = null;
    document.getElementById('confirm-modal').style.display = 'none';
}

// Confirm and delete task
async function confirmDelete() {
    if (!deleteTaskId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${deleteTaskId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeConfirmModal();
            loadTasks();
            loadStats();
            showSuccess('Task deleted successfully!');
        } else {
            showError(result.message || 'Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showError('Error deleting task');
    }
}

// Show loading state
function showLoading(show) {
    const tasksList = document.getElementById('tasks-list');
    if (show) {
        tasksList.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading tasks...</p>
            </div>
        `;
    }
}

// Show success message
function showSuccess(message) {
    // You can implement a toast notification here
    alert(message); // Simplified for this example
}

// Show error message
function showError(message) {
    // You can implement a toast notification here
    alert(`Error: ${message}`); // Simplified for this example
}