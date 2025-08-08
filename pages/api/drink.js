import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from "../../db";

async function handler(req, res) {
  const { user } = req.session;
  if (!user) return res.status(401).end();

  const { method, body } = req;
  let actionResult, successMessage;

  try {
    if (method === "POST") {
      actionResult = await db.drink.add(user.id, body);
      successMessage = "drink added";
    } else if (method === "DELETE") {
      actionResult = await db.drink.remove(user.id, body.id);
      successMessage = "drink removed";
    } else {
      return res.status(404).end();
    }

    if (actionResult) {
      return res.status(200).json(successMessage);
    } else {
      await req.session.destroy();
      return res.status(401).json({ error: `${successMessage} failed` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
