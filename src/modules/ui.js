
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

export const theme = {
    getStored() {
        return localStorage.getItem('theme') || 'dark';
    },

    save(currentTheme) {
        localStorage.setItem('theme', currentTheme);
    },

    updateButton(button, currentTheme) {
        button.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    },

    apply(currentTheme) {
        document.body.className = currentTheme; 
    }
};