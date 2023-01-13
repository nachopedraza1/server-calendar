const { response } = require("express");
const Evento = require("../models/event")

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate("user", "name");

    res.status(200).json({
        ok: true,
        eventos
    });
}

const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "Evento invalido."
        });
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe por ese id."
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: "No tiene privilegio de actualizar este Evento."
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.status(200).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "No hay evento con ese id."
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: "No tiene privilegio de eliminar este Evento."
            });
        }

        await Evento.findByIdAndDelete(evento);

        res.status(200).json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el admin."
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}