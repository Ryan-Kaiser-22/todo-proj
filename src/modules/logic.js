// localStorage
const STORAGE_KEY = 'todo_app_data';

export let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    'Inbox': [],
    'Work': [],
    'Personal': []
};

export function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

//Tasks
//Factory function to instantiate new tasks
export const createTask = (title, date) => ({ 
    title, 
    completed: false,
    id: Date.now(),
    dueDate: date || new Date().toISOString().split('T')[0] 
});

export function addTaskToProject(projectName, taskTitle, taskDate) {
    if (!projects[projectName]) return; 
    const newTask = createTask(taskTitle, taskDate);
    projects[projectName].push(newTask);
    saveToLocalStorage();
}

export function getFilteredTasks(filterType) {
    const allTasks = Object.values(projects).flat();
    const todayStr = new Date().toISOString().split('T')[0];

    if (filterType === 'Today') {
        return allTasks.filter(task => task.dueDate === todayStr);
    }
    if (filterType === 'Upcoming') {
        return allTasks.filter(task => task.dueDate > todayStr);
    }
    if (filterType === 'Anytime' || filterType === 'Someday') {
        return allTasks; 
    }
    return [];
}

export function toggleTaskStatus(projectName, taskId) {
    const task = projects[projectName].find(t => t.id == taskId);
    if (task) {
        task.completed = !task.completed;
        saveToLocalStorage();
    }
}

export function toggleTaskStatusGlobal(taskId) {
    for (const projectName in projects) {
        const task = projects[projectName].find(t => t.id == taskId);
        if (task) {
            task.completed = !task.completed;
            saveToLocalStorage();
            return true;
        }
    }
    return false;
}

//This function is for normal deleting while in project view of tasks
export function deleteTask(projectName, taskId) {
    if (projects[projectName]) {
        projects[projectName] = projects[projectName].filter(t => t.id != taskId);
        saveToLocalStorage();
        return true;
    }
    return false;
}

//This function is specific to using time filtered views of tasks
export function deleteTaskGlobal(taskId) {
    for (const projectName in projects) {
        const initialLength = projects[projectName].length;
        projects[projectName] = projects[projectName].filter(t => t.id != taskId);
        if (projects[projectName].length !== initialLength) {
            saveToLocalStorage();
            return true;
        }
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

//Edit task
export function getTaskById(id) {
    for (const project in projects) {
        const task = projects[project].find(t => t.id == id);
        if (task) return task;
    }
    return null;
}

export function updateTask(id, newData) {
    let currentProjectName = '';
    let taskIndex = -1;

    for (const name in projects) {
        taskIndex = projects[name].findIndex(t => t.id == id);
        if (taskIndex !== -1) {
            currentProjectName = name;
            break;
        }
    }

    if (taskIndex === -1) return;

    const task = projects[currentProjectName][taskIndex];
    const updatedTask = { ...task, ...newData };

    if (newData.project && newData.project !== currentProjectName) {
        projects[currentProjectName].splice(taskIndex, 1);
        projects[newData.project].push(updatedTask);
    } else {
        projects[currentProjectName][taskIndex] = updatedTask;
    }

    saveToLocalStorage(); 
}
