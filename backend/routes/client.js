// backend/routes/client.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

module.exports = function (knex) {
  // 1) Configuración rápida de multer para archivo de hasta 2 MB y extensión jpg/png
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "..", "uploads", "profiles");
      // Crear carpeta si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Ejemplo: profile_23_161893798374.png
      const { clientId } = req.params;
      const ext = path.extname(file.originalname);
      const baseName = `profile_${clientId}_${Date.now()}`;
      cb(null, baseName + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes JPG, PNG o GIF"), false);
    }
  };

  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter,
  });

  // ------------------------------
  // GET /api/client/:clientId
  //   Devuelve los datos actuales del cliente (userName + profilePicture)
  // ------------------------------
  router.get("/:clientId", async (req, res) => {
    const { clientId } = req.params;
    try {
      const rows = await knex("client")
        .select("userName", "profilePicture", "mail", "phoneNumber")
        .where({ clientId })
        .first();

      if (!rows) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }
      return res.json(rows);
    } catch (err) {
      console.error("Error GET /api/client/:clientId:", err);
      return res.status(500).json({ error: "Error al obtener datos de cliente." });
    }
  });

  // ------------------------------
  // PUT /api/client/:clientId
  //   Actualiza el userName y/o la imagen de perfil
  //   Se envía multipart/form-data con campos:
  //     - userName (string)
  //     - profilePicture (archivo)
  // ------------------------------
  router.put(
    "/:clientId",
    upload.single("profilePicture"),
    async (req, res) => {
      const { clientId } = req.params;
      const { userName } = req.body;
      let newProfilePath = null;

      try {
        // 1) Si envían archivo, guardamos la ruta relativa
        if (req.file) {
          // Ejemplo de ruta a guardar en DB: "uploads/profiles/profile_23_161893798374.png"
          newProfilePath = path.join("uploads", "profiles", req.file.filename);
        }

        // 2) Construir objeto a actualizar
        const updateData = {};
        if (userName) updateData.userName = userName.trim();
        if (newProfilePath) updateData.profilePicture = newProfilePath;

        // 3) Actualizar en base de datos
        await knex("client")
          .where({ clientId })
          .update(updateData);

        // 4) Obtener datos actualizados y devolver JSON
        const updated = await knex("client")
          .select("userName", "profilePicture")
          .where({ clientId })
          .first();

        return res.status(200).json({
          message: "Perfil actualizado.",
          userName: updated.userName,
          profilePicture: updated.profilePicture,
        });
      } catch (err) {
        console.error("Error PUT /api/client/:clientId:", err);
        return res.status(500).json({ error: "No se pudo actualizar perfil." });
      }
    }
  );

  return router;
};
