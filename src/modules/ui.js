
export const projectInput = {
    open: (showBtn, inputGroup, input) => {
        inputGroup.classList.add('visible'); 
        showBtn.style.display = 'none';      
        setTimeout(() => input.focus(), 100); 
    },
    
    close: (showBtn, inputGroup, input) => {
        inputGroup.classList.remove('visible'); 
        input.value = '';
        setTimeout(() => {
            showBtn.style.display = 'block';
        }, 400);
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