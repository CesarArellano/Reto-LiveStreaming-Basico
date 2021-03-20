const { Router } = require('express'); // Desestructuración de la clase.
const router = Router(); // Instancia el objeto router.

// Si se realiza un petición http con el método de acceso get a la raíz, la respuesta responderá con el recurso index.html ubicado en la carpeta public.

router.get('/', (req,res) => {
  res.redirect('index.html');
});

// Exportamos el módulo de rutas para cualquier archivo que lo requiera (como lo hace app.js)
module.exports = router;
