import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const drink = req.body
    const user = req.session.user
    switch(req.method) {
      case 'POST': 
        if (!user) 
          return res.status(401).end();
        try {
           const drinkAdded = await db.drink.add(user.id, drink);
           if (drinkAdded) {
            return res.status(200).json("drink added")
           } else {
            req.session.destroy()
            return res.status(401).json({ error: "drink not added" });
           }
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }

      case 'DELETE': 
        if (!user) {
          return res.status(401).end();
        }
        try {
          const drinkRemoved = await db.drink.remove(user.id, drink.id);
          if (drinkRemoved) {
           return res.status(200).json("drink removed")
          } else {
           req.session.destroy()
           return res.status(401).json({ error: "drink not removed" });
          }
       } catch (error) {
         return res.status(400).json({ error: error.message });
       }
    }
    return res.status(404).end()
  },
  sessionOptions
)
