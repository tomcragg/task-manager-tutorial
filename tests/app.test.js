// Import the class (you'll need to modify app.js to export it)
const { TaskManager } = require('../js/app.js');

// Mock DOM elements
document.body.innerHTML = `
  <div class="container">
    <input type="text" id="taskInput" placeholder="Add a new task...">
    <button id="addTaskBtn">Add Task</button>
    <ul id="taskList"></ul>
  </div>
`;

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    localStorage.clear();
    taskManager = new TaskManager();
  });

  test('should initialize with empty task list', () => {
    expect(taskManager.getTaskCount()).toBe(0);
  });

  test('should add a new task', () => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = 'Test task';
    
    taskManager.addTask();
    
    expect(taskManager.getTaskCount()).toBe(1);
    expect(taskInput.value).toBe('');
  });

  test('should not add empty tasks', () => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = '';
    
    taskManager.addTask();
    
    expect(taskManager.getTaskCount()).toBe(0);
  });

  test('should toggle task completion', () => {
    taskManager.tasks = [{
      id: 1,
      text: 'Test task',
      completed: false,
      createdAt: new Date().toISOString()
    }];

    taskManager.toggleTask(1);

    expect(taskManager.tasks[0].completed).toBe(true);
  });

  test('should delete a task', () => {
    taskManager.tasks = [{
      id: 1,
      text: 'Test task',
      completed: false,
      createdAt: new Date().toISOString()
    }];

    taskManager.deleteTask(1);

    expect(taskManager.getTaskCount()).toBe(0);
  });

  test('should count completed tasks correctly', () => {
    taskManager.tasks = [
      { id: 1, text: 'Task 1', completed: true, createdAt: new Date().toISOString() },
      { id: 2, text: 'Task 2', completed: false, createdAt: new Date().toISOString() },
      { id: 3, text: 'Task 3', completed: true, createdAt: new Date().toISOString() }
    ];

    expect(taskManager.getCompletedTaskCount()).toBe(2);
  });
});