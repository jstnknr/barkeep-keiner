import { Schema } from 'mongoose';

const schemaDefinition = {
  cocktailId:   String,
  cocktailName: String,
  thumbnail:    String,
  instructions: String,
  glassType:    String,
  ingredients:  String,
};

for (let i = 1; i <= 20; i++) {
  schemaDefinition[`ingredient${i}`] = String;
  schemaDefinition[`measure${i}`]    = String;
}

const drinkSchema = new Schema(schemaDefinition);

export default drinkSchema;
