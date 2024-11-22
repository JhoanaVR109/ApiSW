const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// Configurar Supabase
const supabaseUrl = 'https://gpfrzqukuwcufutsteyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZnJ6cXVrdXdjdWZ1dHN0ZXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMDE4OTEsImV4cCI6MjA0Nzg3Nzg5MX0.qWfMpZTn7DozpHjBWLMh4vTGrYEWHaBUZh5WnGHaruA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// ----- GET: Obtener todas las categorías -----
app.get('/api/categorias', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categorias')  // Asegúrate de que el nombre de la tabla sea correcto
      .select('*');
    
    if (error) return res.status(500).json(error);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// ----- GET: Obtener productos por categoría -----
app.get('/api/productos/:idCategoria', async (req, res) => {
  const categoriaId = parseInt(req.params.idCategoria, 10);  // Convertir el idCategoria a entero
  if (isNaN(categoriaId)) {
    return res.status(400).json({ error: 'ID de categoría no válido' });
  }

  try {
    const { data, error } = await supabase
      .from('productos')  // Asegúrate de que el nombre de la tabla sea correcto
      .select('*')
      .eq('idCategoria', categoriaId);
    
    if (error) return res.status(500).json(error);
    if (data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos en esta categoría' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// ----- POST: Crear un nuevo producto -----
app.post('/api/productos', async (req, res) => {
  const { nombre, precio, idCategoria, descripcion } = req.body;

  if (!nombre || !precio || !idCategoria || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos del producto' });
  }

  try {
    const { data, error } = await supabase
      .from('productos')  // Asegúrate de que el nombre de la tabla sea correcto
      .insert([{ nombre, precio, idCategoria, descripcion }]);
    
    if (error) return res.status(500).json(error);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// ----- PUT: Actualizar un producto -----
app.put('/api/productos/:idProducto', async (req, res) => {
  const idProducto = parseInt(req.params.idProducto, 10);  // Convertir el idProducto a entero
  const { nombre, precio, idCategoria, descripcion } = req.body;

  if (!nombre && !precio && !idCategoria && !descripcion) {
    return res.status(400).json({ error: 'No hay datos para actualizar el producto' });
  }

  try {
    const { data, error } = await supabase
      .from('productos')
      .update({ nombre, precio, idCategoria, descripcion })
      .eq('idProducto', idProducto);
    
    if (error) return res.status(500).json(error);
    if (data.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// ----- DELETE: Eliminar un producto -----
app.delete('/api/productos/:idProducto', async (req, res) => {
  const idProducto = parseInt(req.params.idProducto, 10);  // Convertir el idProducto a entero

  try {
    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('idProducto', idProducto);
    
    if (error) return res.status(500).json(error);
    if (data.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(204).send();  // No content
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});