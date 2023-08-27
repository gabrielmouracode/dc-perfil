const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';  
    body.setAttribute('data-bs-theme', newTheme);

    if (newTheme === 'dark') {
      themeToggle.classList.remove('bi-moon-fill');
      themeToggle.classList.add('bi-sun');
      
    } else {
      themeToggle.classList.remove('bi-sun');
      themeToggle.classList.add('bi-moon-fill');
    }
    
  });