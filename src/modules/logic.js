/**
 * logic.js
 * Handles data structures, state management, and persistence.
 */

const STORAGE_KEY = 'todo_app_data';

// check if data exists in localStorage. If not, provide the default starting projects.
export let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    'Inbox': [],
    'Work': [{ title: 'Setup Webpack', completed: true }],
    'Personal': []
};

// --- PERSISTENCE ---
export function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// --- TASK LOGIC ---
export const createTask = (title, completed = false) => ({ 
    title, 
    completed,
    id: Date.now()
});

export function addTaskToProject(projectName, taskTitle) {
    if (!projects[projectName]) return; 
    
    const newTask = createTask(taskTitle);
    projects[projectName].push(newTask);
    
    saveToLocalStorage();
    return projects[projectName];
}

export function toggleTaskStatus(projectName, taskIndex) {
    const task = projects[projectName][taskIndex];
    if (task) {
        task.completed = !task.completed;
        saveToLocalStorage();
    }
}

export function addProject(name) {
    const trimmedName = name.trim();
    if (trimmedName && !projects[trimmedName]) {
        projects[trimmedName] = [];
        saveToLocalStorage();
        return true;
    }
    return false;
}

export function deleteProject(projectName) {
    if (projectName !== 'Inbox' && projects[projectName]) {
        delete projects[projectName];
        saveToLocalStorage();
        return true;
    }
    return false;
}

export function deleteTask(projectName, taskIndex) {
    if (projects[projectName]) {
        projects[projectName].splice(taskIndex, 1); // Remove 1 item at the given index
        saveToLocalStorage();
        return true;
    }
    return false;
}

export function clearCompletedTasks(projectName) {
    if (!projects[projectName]) return;

    // Filter the array to keep only tasks that are NOT completed
    projects[projectName] = projects[projectName].filter(task => !task.completed);
    
    saveToLocalStorage();
}

export function getStoredTheme() {
    return localStorage.getItem('theme') || 'dark';
}

export function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}