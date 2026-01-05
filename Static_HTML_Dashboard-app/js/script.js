// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Save theme preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Initialize Charts
    initializeCharts();
    
    // Load Data
    loadStatsData();
    loadActivityData();
    loadProductsData();
    loadWeatherData();
    
    // Chart Period Change
    document.getElementById('chartPeriod').addEventListener('change', function() {
        updateChartData(this.value);
    });
    
    // Simulate live data updates
    setInterval(updateLiveData, 5000);
});

// Initialize Charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // User Distribution Chart
    const userCtx = document.getElementById('userChart').getContext('2d');
    window.userChart = new Chart(userCtx, {
        type: 'doughnut',
        data: {
            labels: ['Mobile', 'Desktop', 'Tablet'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: [
                    '#4361ee',
                    '#3a0ca3',
                    '#4cc9f0'
                ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

// Update Chart Data Based on Period
function updateChartData(period) {
    let labels, data;
    
    switch(period) {
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [45000, 52000, 48000, 60000];
            break;
        case 'year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [85000, 92000, 78000, 95000, 110000, 125000, 130000, 115000, 105000, 120000, 135000, 150000];
            break;
        case 'week':
        default:
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [12000, 19000, 15000, 25000, 22000, 30000, 28000];
    }
    
    window.revenueChart.data.labels = labels;
    window.revenueChart.data.datasets[0].data = data;
    window.revenueChart.update();
}

// Load Stats Data
function loadStatsData() {
    // Simulate API call with setTimeout
    setTimeout(() => {
        document.getElementById('totalUsers').textContent = '12,847';
        document.getElementById('totalOrders').textContent = '1,892';
        document.getElementById('revenue').textContent = '$42,580';
        document.getElementById('visitors').textContent = '3,241';
    }, 1000);
}

// Load Activity Data
function loadActivityData() {
    const activityData = [
        { user: 'John Smith', action: 'Placed Order', date: '10:30 AM', status: 'completed' },
        { user: 'Sarah Johnson', action: 'Updated Profile', date: '11:15 AM', status: 'completed' },
        { user: 'Mike Williams', action: 'Cancelled Subscription', date: '12:45 PM', status: 'failed' },
        { user: 'Emily Davis', action: 'Made Payment', date: '1:20 PM', status: 'completed' },
        { user: 'Robert Brown', action: 'Submitted Ticket', date: '2:50 PM', status: 'pending' }
    ];
    
    const activityTable = document.getElementById('activityTable');
    activityTable.innerHTML = '';
    
    activityData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.user}</td>
            <td>${item.action}</td>
            <td>${item.date}</td>
            <td><span class="status ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></td>
        `;
        activityTable.appendChild(row);
    });
}

// Load Products Data
function loadProductsData() {
    const productsData = [
        { name: 'Premium Headphones', category: 'Electronics', price: '$199', sales: '1,240' },
        { name: 'Fitness Tracker', category: 'Wearables', price: '$89', sales: '2,150' },
        { name: 'Coffee Maker', category: 'Home Appliances', price: '$129', sales: '890' },
        { name: 'Wireless Mouse', category: 'Electronics', price: '$49', sales: '3,420' },
        { name: 'Yoga Mat', category: 'Fitness', price: '$35', sales: '1,780' }
    ];
    
    const productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = '';
    
    productsData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
            <td>${item.sales}</td>
        `;
        productsTable.appendChild(row);
    });
}

// Load Weather Data
function loadWeatherData() {
    // In a real application, you would fetch from a weather API
    // For demo purposes, we'll use mock data
    const weatherData = {
        location: 'New York, US',
        temperature: '72°F',
        description: 'Sunny',
        windSpeed: '5 mph',
        humidity: '65%'
    };
    
    document.getElementById('location').textContent = weatherData.location;
    document.getElementById('temperature').textContent = weatherData.temperature;
    document.getElementById('weatherDescription').textContent = weatherData.description;
    document.getElementById('windSpeed').textContent = weatherData.windSpeed;
    document.getElementById('humidity').textContent = weatherData.humidity;
}

// Update Live Data
function updateLiveData() {
    // Simulate live data updates
    const usersElement = document.getElementById('totalUsers');
    const currentUsers = parseInt(usersElement.textContent.replace(/,/g, ''));
    const randomChange = Math.floor(Math.random() * 10) - 3; // Random between -3 and +6
    const newUsers = Math.max(10000, currentUsers + randomChange);
    usersElement.textContent = newUsers.toLocaleString();
    
    const visitorsElement = document.getElementById('visitors');
    const currentVisitors = parseInt(visitorsElement.textContent.replace(/,/g, ''));
    const visitorChange = Math.floor(Math.random() * 50) - 10; // Random between -10 and +40
    const newVisitors = Math.max(1000, currentVisitors + visitorChange);
    visitorsElement.textContent = newVisitors.toLocaleString();
    
    // Update quick stats occasionally
    if (Math.random() > 0.7) {
        const avgSession = document.getElementById('avgSession');
        const minutes = Math.floor(Math.random() * 2) + 3;
        const seconds = Math.floor(Math.random() * 60);
        avgSession.textContent = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
        
        const bounceRate = document.getElementById('bounceRate');
        const newBounceRate = Math.floor(Math.random() * 10) + 28;
        bounceRate.textContent = `${newBounceRate}%`;
    }
}