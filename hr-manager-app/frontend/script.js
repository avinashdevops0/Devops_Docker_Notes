const API_BASE_URL = '/api';
let departmentChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    loadEmployees();
    loadLeaveRequests();
    loadEmployeesForLeave();
});

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.header-actions .btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    // Show selected section and update button
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Find and update the corresponding button
    const buttons = document.querySelectorAll('.header-actions .btn');
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(sectionId)) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        }
    });
    
    // Refresh data for the section
    if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'employees') {
        loadEmployees();
    } else if (sectionId === 'leaves') {
        loadLeaveRequests();
    }
}

// ============ DASHBOARD FUNCTIONS ============

async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const data = await response.json();
        
        if (response.ok) {
            updateStats(data);
            createDepartmentChart(data.departments);
            loadRecentLeaves();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateStats(stats) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>Total Employees</h3>
            <div class="number">${stats.employees.total_employees}</div>
            <div class="trend">Active: ${stats.employees.active_employees}</div>
        </div>
        <div class="stat-card">
            <h3>On Leave</h3>
            <div class="number">${stats.employees.on_leave}</div>
            <div class="trend">Currently</div>
        </div>
        <div class="stat-card">
            <h3>Average Salary</h3>
            <div class="number">$${parseFloat(stats.employees.avg_salary).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="trend">Per Employee</div>
        </div>
        <div class="stat-card">
            <h3>Pending Leaves</h3>
            <div class="number">${stats.leaves.pending_leaves}</div>
            <div class="trend">Awaiting approval</div>
        </div>
    `;
}

function createDepartmentChart(departments) {
    const ctx = document.getElementById('departmentChart').getContext('2d');
    
    if (departmentChart) {
        departmentChart.destroy();
    }
    
    const labels = departments.map(dept => dept.department);
    const data = departments.map(dept => dept.count);
    
    departmentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function loadRecentLeaves() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`);
        const leaves = await response.json();
        
        const recentLeavesContainer = document.getElementById('recent-leaves');
        if (!recentLeavesContainer) return;
        
        const recentLeaves = leaves.slice(0, 5);
        recentLeavesContainer.innerHTML = recentLeaves.map(leave => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>${leave.first_name} ${leave.last_name}</h4>
                    <p>${leave.leave_type} - ${formatDate(leave.start_date)} to ${formatDate(leave.end_date)}</p>
                </div>
                <span class="status-badge status-${leave.status}">${leave.status}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading recent leaves:', error);
    }
}

// ============ EMPLOYEE FUNCTIONS ============

async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        const employees = await response.json();
        
        const tableBody = document.getElementById('employees-table');
        if (!tableBody) return;
        
        tableBody.innerHTML = employees.map(employee => `
            <tr>
                <td>${employee.employee_id}</td>
                <td>${employee.first_name} ${employee.last_name}</td>
                <td>${employee.email}</td>
                <td>${employee.department || '-'}</td>
                <td>${employee.position || '-'}</td>
                <td><span class="status-badge status-${employee.status}">${employee.status}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmployee(${employee.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

async function loadEmployeesForLeave() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        const employees = await response.json();
        
        const select = document.getElementById('leave-employee');
        if (!select) return;
        
        select.innerHTML = employees.map(employee => 
            `<option value="${employee.id}">${employee.employee_id} - ${employee.first_name} ${employee.last_name}</option>`
        ).join('');
    } catch (error) {
        console.error('Error loading employees for leave:', error);
    }
}

function openEmployeeModal(employeeId = null) {
    const modal = document.getElementById('employee-modal');
    const form = document.getElementById('employee-form');
    const title = document.getElementById('modal-title');
    
    if (employeeId) {
        title.textContent = 'Edit Employee';
        loadEmployeeData(employeeId);
    } else {
        title.textContent = 'Add New Employee';
        form.reset();
        document.getElementById('employee-id').value = '';
        document.getElementById('hire_date').valueAsDate = new Date();
        document.getElementById('status').value = 'active';
    }
    
    modal.style.display = 'flex';
}

function closeEmployeeModal() {
    document.getElementById('employee-modal').style.display = 'none';
}

async function loadEmployeeData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`);
        const employee = await response.json();
        
        if (response.ok) {
            document.getElementById('employee-id').value = employee.id;
            document.getElementById('employee_id').value = employee.employee_id;
            document.getElementById('first_name').value = employee.first_name;
            document.getElementById('last_name').value = employee.last_name;
            document.getElementById('email').value = employee.email;
            document.getElementById('phone').value = employee.phone || '';
            document.getElementById('department').value = employee.department || '';
            document.getElementById('position').value = employee.position || '';
            document.getElementById('salary').value = employee.salary || '';
            document.getElementById('hire_date').value = employee.hire_date;
            document.getElementById('status').value = employee.status;
        }
    } catch (error) {
        console.error('Error loading employee data:', error);
        alert('Error loading employee data');
    }
}

async function saveEmployee(event) {
    event.preventDefault();
    
    const employeeId = document.getElementById('employee-id').value;
    const isEdit = !!employeeId;
    
    const employeeData = {
        employee_id: document.getElementById('employee_id').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || null,
        department: document.getElementById('department').value || null,
        position: document.getElementById('position').value || null,
        salary: document.getElementById('salary').value ? parseFloat(document.getElementById('salary').value) : null,
        hire_date: document.getElementById('hire_date').value,
        status: document.getElementById('status').value
    };
    
    try {
        const url = isEdit ? 
            `${API_BASE_URL}/employees/${employeeId}` : 
            `${API_BASE_URL}/employees`;
        
        const response = await fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
        
        if (response.ok) {
            closeEmployeeModal();
            loadEmployees();
            loadDashboard(); // Refresh dashboard stats
            alert(`Employee ${isEdit ? 'updated' : 'added'} successfully!`);
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to save employee');
        }
    } catch (error) {
        console.error('Error saving employee:', error);
        alert('Error saving employee');
    }
}

async function editEmployee(id) {
    openEmployeeModal(id);
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadEmployees();
            loadDashboard(); // Refresh dashboard stats
            alert('Employee deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to delete employee');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
    }
}

// ============ LEAVE REQUEST FUNCTIONS ============

async function loadLeaveRequests() {
    try {
        const filter = document.getElementById('leave-filter')?.value || 'all';
        const url = filter === 'all' ? 
            `${API_BASE_URL}/leaves` : 
            `${API_BASE_URL}/leaves`;
        
        const response = await fetch(url);
        let leaves = await response.json();
        
        // Apply filter on client side for simplicity
        if (filter !== 'all') {
            leaves = leaves.filter(leave => leave.status === filter);
        }
        
        const tableBody = document.getElementById('leaves-table');
        if (!tableBody) return;
        
        tableBody.innerHTML = leaves.map(leave => `
            <tr>
                <td>${leave.employee_id} - ${leave.first_name} ${leave.last_name}</td>
                <td>${leave.leave_type}</td>
                <td>${formatDate(leave.start_date)}</td>
                <td>${formatDate(leave.end_date)}</td>
                <td>${leave.reason || '-'}</td>
                <td><span class="status-badge status-${leave.status}">${leave.status}</span></td>
                <td>
                    ${leave.status === 'pending' ? `
                        <button class="btn btn-success btn-sm" onclick="updateLeaveStatus(${leave.id}, 'approved')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="updateLeaveStatus(${leave.id}, 'rejected')">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : 'No actions'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading leave requests:', error);
    }
}

function openLeaveModal() {
    const modal = document.getElementById('leave-modal');
    const form = document.getElementById('leave-form');
    
    form.reset();
    document.getElementById('start-date').valueAsDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    document.getElementById('end-date').valueAsDate = endDate;
    
    modal.style.display = 'flex';
}

function closeLeaveModal() {
    document.getElementById('leave-modal').style.display = 'none';
}

async function saveLeaveRequest(event) {
    event.preventDefault();
    
    const leaveData = {
        employee_id: document.getElementById('leave-employee').value,
        leave_type: document.getElementById('leave-type').value,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        reason: document.getElementById('leave-reason').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaveData)
        });
        
        if (response.ok) {
            closeLeaveModal();
            loadLeaveRequests();
            loadDashboard(); // Refresh dashboard
            alert('Leave request submitted successfully!');
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to submit leave request');
        }
    } catch (error) {
        console.error('Error submitting leave request:', error);
        alert('Error submitting leave request');
    }
}

async function updateLeaveStatus(leaveId, status) {
    if (!confirm(`Are you sure you want to ${status} this leave request?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadLeaveRequests();
            loadDashboard(); // Refresh dashboard
            alert(`Leave request ${status} successfully!`);
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to update leave status');
        }
    } catch (error) {
        console.error('Error updating leave status:', error);
        alert('Error updating leave status');
    }
}

// ============ UTILITY FUNCTIONS ============

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}