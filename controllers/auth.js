const { response } = require("express");
const bcrypt = require("bcryptjs")
const { generarJWT } = require("../helpers/jwt")
const Usuario = require("../models/user")

const createUser = async (req, resp = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return resp.status(400).json({
                ok: false,
                msg: "Un usuario ya existe con ese correo"
            })
        }

        usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);

        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: "Error de Registro"
        });
    }
}

const loginUser = async (req, resp = response) => {

    const { password, email } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: "El usuario no existe con ese email."
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: "Password Incorrecto."
            });
        }

        const token = await generarJWT(usuario.id, usuario.name);

        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            email: usuario.email,
            token
        });

    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: "Error de Login"
        });
    }
}

const revalidateToken = async (req, resp = response) => {

    const { uid, name } = req;

    const token = await generarJWT(uid, name);

    resp.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}