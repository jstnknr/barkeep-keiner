import { withIronSessionApiRoute } from 'iron-session/next'
import sessionOptions from '../../config/session'
import db from '../../db'

const handlers = {
  POST: {
    exec: (user, body) => db.drink.add(user.id, body),
    successMsg: 'cocktail collected',
  },
  DELETE: {
    exec: (user, body) => db.drink.remove(user.id, body.id),
    successMsg: 'cocktail removed',
  },
}

async function handler(req, res) {
  const { user } = req.session
  if (!user) return res.status(401).end()

  const cfg = handlers[req.method]
  if (!cfg) return res.status(404).end()

  try {
    const result = await cfg.exec(user, req.body)
    if (result) {
      return res.status(200).json(cfg.successMsg)
    }
    await req.session.destroy()
    return res.status(401).json({ error: `${cfg.successMsg} failed` })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
