async function loginFormHandler(event) {
    event.preventDefault();
  
    const user_name = document.querySelector('#user_name').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (user_name && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          user_name,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }

      
  
      
    }
  }

  async function signupFormHandler(event) {
    event.preventDefault();
  
    const user_name = document.querySelector('#user_name_signup').value.trim();
    const password = document.querySelector('#password_signup').value.trim();

    if (user_name && password) {
      const response = await fetch('/api/users/', {
        method: 'post',
        body: JSON.stringify({
          user_name,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    }
  }
  
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
  
  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);