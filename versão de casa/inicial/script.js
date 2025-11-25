document.addEventListener("DOMContentLoaded", function() {
    
    const loginButton = document.getElementById('btnLogin');
  const greetingSpan = document.getElementById('userGreeting');

     function checkLogin() {
    const savedUser = localStorage.getItem('smartLifeUser');
     if (savedUser) {
    loginButton.style.display = 'none';
        greetingSpan.style.display = 'inline-block';
       greetingSpan.textContent = 'Olá, ' + savedUser;
     }
    }

    loginButton.addEventListener('click', function() {
   const userName = prompt("Por favor, digite seu nome para entrar:");
   
   if (userName && userName.trim() !== "") {
       localStorage.setItem('smartLifeUser', userName);
       checkLogin();
       alert("Login realizado com sucesso!");
   } else {
       alert("Nome inválido.");
   }
    });

  checkLogin();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
       e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
           behavior: 'smooth'
        });
    });
    });
});