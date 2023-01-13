const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos")
const { createUser, revalidateToken, loginUser } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
    "/new",
    [check("name", "El nombre es obligatorio.").not().isEmpty()],
    [check("email", "El email ingresado no es valido.").isEmail()],
    [check("password", "La contraseña debe tener 6 o mas caracteres.").isLength({ min: 6 })],
    validarCampos,
    createUser);

router.post(
    "/",
    [check("email", "El email ingresado no es valido.").isEmail()],
    [check("password", "La contraseña debe tener 6 o mas caracteres.").isLength({ min: 6 })],
    validarCampos,
    loginUser
);

router.get("/renew", validarJWT, revalidateToken);

module.exports = router;
