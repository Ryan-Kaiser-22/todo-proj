
// src/modules/ui.js

/**
 * Handles the visibility and resetting of the "New Project" input area.
 */
export const projectInput = {
    open(showBtn, inputGroup, inputField) {
        showBtn.style.display = 'none';
        inputGroup.style.display = 'block';
        inputField.focus();
    },

    close(showBtn, inputGroup, inputField) {
        showBtn.style.display = 'block';
        inputGroup.style.display = 'none';
        inputField.value = '';
    }
};

/**
 * Handles theme-specific UI updates.
 */
export const theme = {
    updateButton(button, currentTheme) {
        button.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
};