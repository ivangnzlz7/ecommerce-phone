const form = document.querySelector('#registerForm');

form.addEventListener('submit', registerUser);

async function registerUser(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;
    
    if(password !== confirmPassword){
        alert('NO coinciden las contraseñas');
        return;
    }

    const user = {
        name,
        email,
        password
    }

    try {

        const res = await fetch('https://ecommerce-api-y8cy.onrender.com/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
            const data = await res.json();
            console.log(data);
            
        
    } catch (err) {
        console.log(err.message);
    }
}

// Función para mostrar/ocultar contraseña
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        }

        function toggleConfirmPassword() {
            const confirmInput = document.getElementById('confirm-password');
            confirmInput.type = confirmInput.type === 'password' ? 'text' : 'password';
        }
