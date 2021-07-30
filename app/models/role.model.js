const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({ name: String });
RoleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = mongoose.model("Role", RoleSchema);
