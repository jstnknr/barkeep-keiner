import User from '../db/models/user'
import { normalizeId } from './util'
import { dbConnect } from './connection'

async function loadUser(userId) {
  await dbConnect()
  return User.findById(userId).lean()
}

export async function getAll(userId) {
  const user = await loadUser(userId)
  return user?.favoriteDrinks.map(normalizeId) ?? null
}

export async function getByCocktailId(userId, drinkId) {
  const user = await loadUser(userId)
  const drink = user?.favoriteDrinks.find(d => d.cocktailId === drinkId)
  return drink ? normalizeId(drink) : null
}

export async function add(userId, drink) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteDrinks: drink } },
    { new: true }
  )
  if (!user) return null
  const added = user.favoriteDrinks.find(d => d.cocktailId === drink.cocktailId)
  return normalizeId(added)
}

export async function remove(userId, drinkId) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteDrinks: { _id: drinkId } } },
    { new: true }
  )
  return Boolean(user)
}
