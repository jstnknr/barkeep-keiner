import User from '../db/models/user'
import { normalizeId } from './util'
import { dbConnect } from './connection'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user.favoriteDrinks.map(drink => normalizeId(drink))
}

export async function getByCocktailId(userId, drinkId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  const drink = user.favoriteDrinks.find(drink => drink.cocktailId === drinkId)
  if (drink) return normalizeId(drink)
  return null
}

export async function add(userId, drink) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteDrinks: drink } },
    { new: true }
  )
  if (!user) return null
  const addedDrink = user.favoriteDrinks.find(dk => dk.cocktailId === drink.cocktailId)
  return normalizeId(addedDrink)
}

export async function remove(userId, drinkId) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteDrinks: {_id: drinkId } } },
    { new: true }
  )
  if (!user) return null
  return true
}