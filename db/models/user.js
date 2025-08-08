import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true, minLength: 5, maxLength: 200 },
})

UserSchema.pre('save', async function() {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

export default models.User || model('User', UserSchema)
