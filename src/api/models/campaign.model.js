module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  const CampaignSchema = new Schema(
    {
      name: String,
      prompt: String,
      steps: [
        {
          day: Number,
          message: String,
        },
      ],
      status: {
        type: String,
        default: "draft", // draft | active | cancelled
      },
    },
    {
      timestamps: true,
    }
  );

  CampaignSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("Campaign", CampaignSchema);
};
