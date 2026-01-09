class TaskManager {
    constructor() {
        this.API_URL = '/api';
        this.currentTaskId = null;
        this.currentFilter = 'all';
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadTasks();
    }
    
    initializeElements() {
        this.taskForm = document.getElementById('taskForm');
        this.titleInput = document.getElementById('title');
        this.descriptionInput = document.getElementById('description');
        this.prioritySelect = document.getElementById('priority');
        this.dueDateInput = document.getElementById('dueDate');
        this.statusSelect = document.getElementById('status');
        this.submitBtn = this.taskForm.querySelector('button[type="submit"]');
        this.updateBtn = document.getElementById('updateBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.taskList = document.getElementById('taskList');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Statistics elements
        this.totalTasksElement = document.getElementById('totalTasks');
        this.pendingTasksElement = document.getElementById('pendingTasks');
        this.inProgressTasksElement = document.getElementById('inProgressTasks');
        this.completedTasksElement = document.getElementById('completedTasks');
    }
    
    setupEventListeners() {
        // Form submission
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.currentTaskId) {
                this.updateTask(this.currentTaskId);
            } else {
                this.createTask();
            }
        });
        
        // Update button
        this.updateBtn.addEventListener('click', () => {
            if (this.currentTaskId) {
                this.updateTask(this.currentTaskId);
            }
        });
        
        // Cancel button
        this.cancelBtn.addEventListener('click', () => {
            this.resetForm();
        });
        
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const status = e.target.dataset.status;
                const priority = e.target.dataset.priority;
                
                // Update active state
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                if (status) {
                    this.currentFilter = status;
                    this.loadTasks(status === 'all' ? null : status);
                } else if (priority) {
                    this.currentFilter = priority;
                    this.loadTasksByPriority(priority);
                }
            });
        });
    }
    
    async loadTasks(status = null) {
        try {
            let url = `${this.API_URL}/tasks`;
            if (status) {
                url = `${this.API_URL}/tasks/status/${status}`;
            }
            
            const response = await fetch(url);
            const tasks = await response.json();
            this.displayTasks(tasks);
            this.updateStatistics(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks');
        }
    }
    
    async loadTasksByPriority(priority) {
        try {
            const response = await fetch(`${this.API_URL}/tasks`);
            const tasks = await response.json();
            const filteredTasks = tasks.filter(task => task.priority === priority);
            this.displayTasks(filteredTasks);
        } catch (error) {
            console.error('Error loading tasks by priority:', error);
            this.showError('Failed to load tasks');
        }
    }
    
    async createTask() {
        const taskData = {
            title: this.titleInput.value,
            description: this.descriptionInput.value,
            priority: this.prioritySelect.value,
            due_date: this.dueDateInput.value,
            status: this.statusSelect.value
        };
        
        try {
            const response = await fetch(`${this.API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            
            const newTask = await response.json();
            this.resetForm();
            this.loadTasks();
            this.showSuccess('Task created successfully!');
        } catch (error) {
            console.error('Error creating task:', error);
            this.showError('Failed to create task');
        }
    }
    
    async updateTask(taskId) {
        const taskData = {
            title: this.titleInput.value,
            description: this.descriptionInput.value,
            priority: this.prioritySelect.value,
            due_date: this.dueDateInput.value,
            status: this.statusSelect.value
        };
        
        try {
            const response = await fetch(`${this.API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            
            await response.json();
            this.resetForm();
            this.loadTasks();
            this.showSuccess('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            this.showError('Failed to update task');
        }
    }
    
    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await fetch(`${this.API_URL}/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            this.loadTasks();
            this.showSuccess('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError('Failed to delete task');
        }
    }
    
    editTask(task) {
        this.currentTaskId = task.id;
        this.titleInput.value = task.title;
        this.descriptionInput.value = task.description || '';
        this.prioritySelect.value = task.priority;
        this.dueDateInput.value = task.due_date || '';
        this.statusSelect.value = task.status;
        
        this.submitBtn.style.display = 'none';
        this.updateBtn.style.display = 'inline-flex';
        this.cancelBtn.style.display = 'inline-flex';
        
        this.titleInput.focus();
    }
    
    resetForm() {
        this.currentTaskId = null;
        this.taskForm.reset();
        this.prioritySelect.value = 'medium';
        this.statusSelect.value = 'pending';
        
        this.submitBtn.style.display = 'inline-flex';
        this.updateBtn.style.display = 'none';
        this.cancelBtn.style.display = 'none';
    }
    
    displayTasks(tasks) {
        if (tasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No tasks found</h3>
                    <p>${this.currentFilter === 'all' ? 'Add your first task using the form above!' : 'No tasks match the selected filter'}</p>
                </div>
            `;
            return;
        }
        
        this.taskList.innerHTML = tasks.map(task => `
            <div class="task-item ${task.status} ${task.priority}-priority">
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <span class="task-priority priority-${task.priority}">
                            <i class="fas fa-flag"></i> ${task.priority}
                        </span>
                    </div>
                    <span class="status-badge status-${task.status}">
                        ${task.status.replace('_', ' ')}
                    </span>
                </div>
                
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                
                <div class="task-footer">
                    <div class="task-meta">
                        ${task.due_date ? `<span><i class="far fa-calendar"></i> Due: ${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
                        <span><i class="far fa-clock"></i> Created: ${new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div class="task-actions">
                        <button class="btn btn-edit" onclick="taskManager.editTask(${JSON.stringify(task).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-delete" onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        ${task.status !== 'completed' ? `
                            <button class="btn btn-status" onclick="taskManager.updateTaskStatus(${task.id}, 'completed')">
                                <i class="fas fa-check"></i> Mark Complete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    async updateTaskStatus(taskId, status) {
        try {
            // First get the current task
            const response = await fetch(`${this.API_URL}/tasks/${taskId}`);
            const task = await response.json();
            
            // Update status
            task.status = status;
            
            // Send update
            await fetch(`${this.API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            
            this.loadTasks();
            this.showSuccess('Task status updated!');
        } catch (error) {
            console.error('Error updating task status:', error);
            this.showError('Failed to update task status');
        }
    }
    
    updateStatistics(tasks) {
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in_progress').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        
        this.totalTasksElement.textContent = total;
        this.pendingTasksElement.textContent = pending;
        this.inProgressTasksElement.textContent = inProgress;
        this.completedTasksElement.textContent = completed;
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '1000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '15px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.animation = 'slideIn 0.3s ease';
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #f56565 0%, #c53030 100%)';
        }
        
        notification.querySelector('button').style.background = 'transparent';
        notification.querySelector('button').style.border = 'none';
        notification.querySelector('button').style.color = 'white';
        notification.querySelector('button').style.fontSize = '1.5rem';
        notification.querySelector('button').style.cursor = 'pointer';
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize Task Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});