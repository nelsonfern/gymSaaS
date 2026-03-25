import { ClientModel } from "../models/client.js";
import { CheckinModel } from "../models/checkin.js";

export class CheckinController {
    static async getCheckins(req, res) {
        try {
            const checkins = await CheckinModel.getCheckins()
            res.status(200).json(checkins)
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

 static async checkinByDni(req, res) {
  try {
    const { dni } = req.body;

    if (!dni) {
      return res.status(400).json({ message: "El DNI es requerido" });
    }

    const cleanDni = String(dni).trim();
    const client = await ClientModel.getClientByDni(cleanDni);

    if (!client || client.delete === true) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const now = new Date();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const deniedToday = await CheckinModel.findDeniedToday(client._id, startOfDay, endOfDay);

    if (deniedToday && client.status !== "activo") {
      const populated = await deniedToday.populate("client plan");

      return res.status(403).json({
        message: "Ya se intentó ingresar hoy y fue denegado",
        checkin: populated,
      });
    }

    const createCheckin = async (data, statusCode, message) => {
      const checkin = await CheckinModel.createCheckin({
        ...data,
        plan: data.plan || null,
        date: new Date(),
      });

      const populated = await checkin.populate("client plan");

      return res.status(statusCode).json({
        message,
        checkin: populated,
      });
    };
    

    if (!client.membershipEnd) {
      return createCheckin(
        {
          client: client._id,
          plan: client.plan,
          status: "denegado",
          deniedReason: "Sin membresía",
        },
        403,
        "El cliente no cuenta con una membresía"
      );
    }

    if (client.membershipEnd < now) {
      return createCheckin(
        {
          client: client._id,
          plan: client.plan,
          status: "denegado",
          deniedReason: "Membresía vencida",
        },
        403,
        "Membresía vencida"
      );
    }

    const count = await CheckinModel.countCheckinsByClient(
      client._id,
      startOfDay,
      endOfDay
    );

    if (count >= 3) {
      return createCheckin(
        {
          client: client._id,
          plan: client.plan,
          status: "denegado",
          deniedReason: "Límite de ingresos alcanzado",
        },
        403,
        "Límite de ingresos alcanzado"
      );
    }

    // ✅ permitido
    return createCheckin(
      {
        client: client._id,
        plan: client.plan,
        status: "permitido",
      },
      201,
      "Ingreso registrado"
    );
  } catch (e) {
    console.error("ERROR EN CHECKIN:", e);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

    static async getClientCheckins(req, res) {
        try {
            const checkins = await CheckinModel.getCheckinsByClient(req.params.clientId)
            const sortedCheckins = checkins.sort((a, b) => b.date - a.date)
            res.status(200).json(sortedCheckins)

        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de cliente inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getTodayCheckins(req, res) {
        try {
            const checkins = await CheckinModel.getTodayCheckins()
            res.status(200).json(checkins)

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}