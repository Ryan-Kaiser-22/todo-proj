/**
 * dom.js
 * The "View" - Responsible for rendering the UI based on the state.
 */

import { projects } from './logic';

const todoListUI = document.getElementById('todo-list');
const viewTitle = document.getElementById('current-view-title');
const projectListUI = document.getElementById('project-list');

// --- RENDER TASKS ---
export function renderTodos(currentProject) {
    // 1. Clear current list
    todoListUI.innerHTML = ''; 
    
    // 2. Update the header title
    viewTitle.textContent = currentProject;

    // 3. SAFETY CHECK: Get tasks or an empty array if project doesn't exist
    const tasks = projects[currentProject] || [];

    // 4. EMPTY STATE CHECK: Provide feedback if no tasks exist
    if (tasks.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'empty-msg';
        msg.textContent = 'No tasks yet! Add one above.';
        todoListUI.appendChild(msg);
        return; // Exit early since there's nothing left to loop over
    }

    // 5. Loop and build HTML
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <div class="todo-content ${task.completed ? 'completed' : ''}">
                <input type="checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       data-index="${index}" 
                       class="todo-checkbox">
                <span>${task.title}</span>
            </div>
            <button class="delete-task-btn" data-index="${index}">×</button>
        `;
        todoListUI.appendChild(li);
    });
}

// --- RENDER SIDEBAR ---
export function renderSidebar() {
    projectListUI.innerHTML = ''; 

    Object.keys(projects).forEach(projectName => {
        if (projectName === 'Inbox') return;

        const projectContainer = document.createElement('li');
        projectContainer.className = 'project-nav-group';

        const tasks = projects[projectName] || [];
        const taskCount = tasks.length; // Get the count

        // 1. Updated Header with the Count Bubble
        const projectHeader = `
            <div class="project-header">
                <div class="project-info">
                    <span class="project-item bold-text">${projectName}</span>
                    <span class="task-count">${taskCount}</span>
                </div>
                <button class="delete-project-btn" data-project="${projectName}">×</button>
            </div>
        `;

        // 2. Sub-Tree (Only show if there are tasks)
        let taskSubTree = '<ul class="sub-task-list">';
        tasks.forEach(task => {
            taskSubTree += `<li class="sub-task-item">${task.title}</li>`;
        });
        taskSubTree += '</ul>';

        projectContainer.innerHTML = projectHeader + taskSubTree;
        projectListUI.appendChild(projectContainer);
    });
}