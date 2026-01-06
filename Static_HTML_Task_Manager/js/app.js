// Task Manager Application

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksContainer = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const totalTasksEl = document.getElementById('totalTasks');
    const activeTasksEl = document.getElementById('activeTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const currentYearEl = document.getElementById('currentYear');
    
    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize
    function init() {
        // Set current year in footer
        currentYearEl.textContent = new Date().getFullYear();
        
        // Load tasks from localStorage
        updateStats();
        renderTasks();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add task button
        addTaskBtn.addEventListener('click', addTask);
        
        // Add task on Enter key
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
        
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all filter buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Set current filter
                currentFilter = this.getAttribute('data-filter');
                // Render tasks with new filter
                renderTasks();
            });
        });
        
        // Clear completed tasks
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        
        // Clear all tasks
        clearAllBtn.addEventListener('click', clearAllTasks);
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            showNotification('Please enter a task', 'warning');
            taskInput.focus();
            return;
        }
        
        // Create task object
        const newTask = {
            id: Date.now(), // Simple unique ID
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add to tasks array
        tasks.unshift(newTask);
        
        // Save to localStorage
        saveTasks();
        
        // Clear input
        taskInput.value = '';
        taskInput.focus();
        
        // Update UI
        updateStats();
        renderTasks();
        
        // Show notification
        showNotification('Task added successfully!', 'success');
    }
    
    // Toggle task completion
    function toggleTaskCompletion(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            updateStats();
            renderTasks();
            
            const status = tasks[taskIndex].completed ? 'completed' : 'marked as active';
            showNotification(`Task ${status}`, 'success');
        }
    }
    
    // Edit task
    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit your task:', task.text);
        
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
            showNotification('Task updated successfully!', 'success');
        }
    }
    
    // Delete task
    function deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            // Remove with animation
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.style.animation = 'fadeOut 0.3s ease forwards';
                
                setTimeout(() => {
                    tasks.splice(taskIndex, 1);
                    saveTasks();
                    updateStats();
                    renderTasks();
                    showNotification('Task deleted successfully!', 'success');
                }, 300);
            } else {
                tasks.splice(taskIndex, 1);
                saveTasks();
                updateStats();
                renderTasks();
                showNotification('Task deleted successfully!', 'success');
            }
        }
    }
    
    // Clear completed tasks
    function clearCompletedTasks() {
        const completedCount = tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) {
            showNotification('No completed tasks to clear', 'info');
            return;
        }
        
        if (!confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            return;
        }
        
        // Filter out completed tasks
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        updateStats();
        renderTasks();
        showNotification(`${completedCount} completed task(s) cleared`, 'success');
    }
    
    // Clear all tasks
    function clearAllTasks() {
        if (tasks.length === 0) {
            showNotification('No tasks to clear', 'info');
            return;
        }
        
        if (!confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
            return;
        }
        
        tasks = [];
        saveTasks();
        updateStats();
        renderTasks();
        showNotification('All tasks cleared', 'success');
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Update statistics
    function updateStats() {
        const total = tasks.length;
        const active = tasks.filter(task => !task.completed).length;
        const completed = tasks.filter(task => task.completed).length;
        
        totalTasksEl.textContent = total;
        activeTasksEl.textContent = active;
        completedTasksEl.textContent = completed;
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        // Clear container
        tasksContainer.innerHTML = '';
        
        // Filter tasks
        let filteredTasks = tasks;
        
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Show empty state if no tasks
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'flex';
            tasksContainer.appendChild(emptyState);
            return;
        }
        
        // Hide empty state
        emptyState.style.display = 'none';
        
        // Render each task
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    }
    
    // Create task element
    function createTaskElement(task) {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item';
        taskEl.setAttribute('data-task-id', task.id);
        
        // Format date
        const taskDate = new Date(task.createdAt);
        const formattedDate = taskDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        taskEl.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
            </div>
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</div>
                <div class="task-date">Added: ${formattedDate}</div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-btn" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners to task buttons
        const checkbox = taskEl.querySelector('.task-checkbox input');
        const editBtn = taskEl.querySelector('.edit-btn');
        const deleteBtn = taskEl.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        return taskEl;
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'danger' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
            max-width: 400px;
        `;
        
        // Add close button styles
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Add event listener to close button
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize the app
    init();
});