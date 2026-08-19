import app from './app.js';

const puerto = process.env.PORT || 4000;

app.listen(puerto, () => {
    console.log(
        `Servidor ejecutandose en el puerto ${puerto}`
    );
});