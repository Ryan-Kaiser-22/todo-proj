// localStorage
const STORAGE_KEY = 'todo_app_data';

export let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    'Inbox': [],
    'Work': [{ title: 'Setup Webpack', completed: true }],
    'Personal': []
};

export function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

//Tasks
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

export function deleteTask(projectName, taskIndex) {
    if (projects[projectName]) {
        projects[projectName].splice(taskIndex, 1); 
        saveToLocalStorage();
        return true;
    }
    return false;
}

export function clearCompletedTasks(projectName) {
    if (!projects[projectName]) return;
    projects[projectName] = projects[projectName].filter(task => !task.completed);
    saveToLocalStorage();
}

//Projects
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
