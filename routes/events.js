const { Router } = require("express");
const { check } = require("express-validator")
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");

const router = Router();

router.use(validarJWT);

router.get("/", getEventos);

router.post(
    "/",
    [check("title", "El titulo es requerido.").not().isEmpty()],
    [check("start", "Fecha de inicio obligatoria.").custom(isDate)],
    [check("end", "Fecha de fin obligatoria.").custom(isDate)],
    validarCampos,
    crearEvento);

router.put(
    "/:id",
    validarCampos,
    actualizarEvento);

router.delete(
    "/:id",
    validarCampos,
    eliminarEvento);

module.exports = router;