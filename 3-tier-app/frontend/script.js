// Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
let currentEditId = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize application
function initializeApp() {
    checkApiHealth();
    loadUsers();
    setupEventListeners();
}

// Check API health status
async function checkApiHealth() {
    const statusElement = document.getElementById('apiStatus');
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Backend API is connected and healthy';
            statusElement.className = 'status-connected';
        } else {
            throw new Error('API not responding properly');
        }
    } catch (error) {
        statusElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Cannot connect to backend API: ${error.message}`;
        statusElement.className = 'status-error';
        console.error('API Health Check Failed:', error);
    }
}

// Load all users
async function loadUsers() {
    const loading = document.getElementById('loading');
    const usersContainer = document.getElementById('usersContainer');
    const noUsers = document.getElementById('noUsers');
    
    loading.style.display = 'block';
    usersContainer.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        
        if (users.length === 0) {
            noUsers.style.display = 'block';
            usersContainer.style.display = 'none';
        } else {
            noUsers.style.display = 'none';
            usersContainer.style.display = 'grid';
            users.forEach(user => renderUserCard(user));
        }
    } catch (error) {
        console.error('Error loading users:', error);
        usersContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading users. Please check your connection.</p>
            </div>
        `;
    } finally {
        loading.style.display = 'none';
    }
}

// Render user card
function renderUserCard(user) {
    const usersContainer = document.getElementById('usersContainer');
    
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    userCard.id = `user-${user.id}`;
    userCard.innerHTML = `
        <div class="user-header">
            <div class="user-name">${user.name}</div>
            <div class="user-actions">
                <button class="btn-action btn-edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
        <div class="user-details">
            <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${user.email}</p>
            <p><i class="fas fa-birthday-cake"></i> <strong>Age:</strong> ${user.age || 'Not specified'}</p>
            <p><i class="fas fa-calendar"></i> <strong>Created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
        </div>
    `;
    
    usersContainer.appendChild(userCard);
}

// Set up event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
    
    // Update button
    document.getElementById('updateBtn').addEventListener('click', handleUpdate);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
    
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadUsers);
}

// Handle form submission (Create)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create user');
        }
        
        const newUser = await response.json();
        showNotification(`User "${newUser.name}" created successfully!`, 'success');
        clearForm();
        loadUsers();
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification(error.message, 'error');
    }
}

// Edit user
async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        const user = await response.json();
        
        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('age').value = user.age || '';
        
        document.getElementById('submitBtn').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'inline-flex';
        document.getElementById('cancelBtn').style.display = 'inline-flex';
        document.getElementById('clearBtn').style.display = 'none';
        
        currentEditId = userId;
        
        document.getElementById('name').focus();
    } catch (error) {
        console.error('Error loading user for edit:', error);
        showNotification('Failed to load user data', 'error');
    }
}

// Handle update
async function handleUpdate() {
    if (!currentEditId) return;
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update user');
        }
        
        const updatedUser = await response.json();
        showNotification(`User "${updatedUser.name}" updated successfully!`, 'success');
        cancelEdit();
        loadUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification(error.message, 'error');
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete user');
        }
        
        const userCard = document.getElementById(`user-${userId}`);
        if (userCard) {
            userCard.style.opacity = '0.5';
            setTimeout(() => {
                loadUsers();
                showNotification('User deleted successfully!', 'success');
            }, 300);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification(error.message, 'error');
    }
}

// Cancel edit mode
function cancelEdit() {
    clearForm();
    document.getElementById('submitBtn').style.display = 'inline-flex';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
    document.getElementById('clearBtn').style.display = 'inline-flex';
    currentEditId = null;
}

// Clear form
function clearForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        ${type === 'success' ? 'background: linear-gradient(to right, #28a745, #20c997);' : 'background: linear-gradient(to right, #dc3545, #c82333);'}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);