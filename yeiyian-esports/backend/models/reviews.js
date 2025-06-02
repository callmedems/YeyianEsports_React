const getAnimalById = async (id) => {
  const result = await db.query('SELECT * FROM animals WHERE id = $1', [id]);
  return result.rows[0]; 
};

// Crear un nuevo animal
const createAnimal = async (data) => {
  const result = await db.query(`
    INSERT INTO animals (name, emoji)
    VALUES ($1, $2)
    RETURNING *`,
    [data.name, data.emoji]
  );
  return result.rows[0];
};

// Actualizar un animal
const updateAnimal = async (id, data) => {
  const result = await db.query(`
    UPDATE animals
    SET name = $1, emoji = $2
    WHERE id = $3
    RETURNING *`,
    [data.name, data.emoji, id]
  );
  return result.rows[0]; // null si no existe
};

// Eliminar un animal
const deleteAnimal = async (id) => {
  const result = await db.query(
    'DELETE FROM animals WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0]; // null si no existe
};

module.exports = {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal
};