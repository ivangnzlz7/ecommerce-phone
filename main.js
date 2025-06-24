const form = document.querySelector('form');

form.addEventListener('submit', checkUser)

async function checkUser(e) {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const user = {
        email,
        password
    };

    try {
        const res = await fetch('https://ecommerce-api-y8cy.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            const { token } = data;
            localStorage.setItem('token', token);
            console.log('yendo a productos');
            
            setTimeout(() => {
                window.location.href = "products/products.html"
            }, 3000)
        
    } catch (err) {
        console.log(err.message);
    }

}