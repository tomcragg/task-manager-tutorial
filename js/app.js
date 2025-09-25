class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        
        this.init();
    }

    init() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.addFilterButtons(); // Add this line
        this.renderTasks();
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.renderTasks();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" onclick="taskManager.toggleTask(${task.id})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Delete</button>
                </div>
            `;
            this.taskList.appendChild(li);
        });
    }

    // Method for testing
    getTaskCount() {
        return this.tasks.length;
    }

    getCompletedTaskCount() {
        return this.tasks.filter(task => task.completed).length;
    }

    // Add to the TaskManager class
filterTasks(filter) {
    const allTasks = document.querySelectorAll('.task-item');
    
    allTasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        
        switch(filter) {
            case 'active':
                task.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = isCompleted ? 'flex' : 'none';
                break;
            case 'all':
            default:
                task.style.display = 'flex';
                break;
        }
    });
}

// Add filter buttons functionality
addFilterButtons() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
    `;
    
    document.querySelector('.container').insertBefore(
        filterContainer, 
        document.getElementById('taskList')
    );
    
    // Add event listeners
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            // Add active class to clicked button
            e.target.classList.add('active');
            // Filter tasks
            this.filterTasks(e.target.dataset.filter);
        }
    });
}
}

console.log(typeof module);  // "undefined"

// For Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TaskManager };
}

// Initialize the app
const taskManager = new TaskManager();

