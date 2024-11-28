        document.getElementById('userForm').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                apodo: document.getElementById('apodo').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
            };

            if (formData.password !== formData.confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Usuario registrado con éxito');
                document.getElementById('userForm').reset();
            } else {
                alert('Hubo un error al registrar al usuario');
            }
        });