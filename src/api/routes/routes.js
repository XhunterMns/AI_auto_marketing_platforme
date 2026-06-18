module.exports = (app) => {
  const router = require("express").Router();
  const generateController = require("../controllers/generate.controller");
  const campaignController = require("../controllers/campaign.controller");
  const analysisController = require("../controllers/analysis.controller");
  const metaController = require("../controllers/meta");
  const postingController = require("../controllers/posting.controller");

  router.post("/generate", generateController.generate);
  router.post("/generate-campaign", campaignController.generateCampaign);
  router.post("/competitor-analysis", analysisController.competitorAnalysis);
  router.post("/meta/post", metaController.postToMeta);
  router.post("/telegram/send", postingController.sendPostToTelegram);

  app.use("/api", router);
  app.post("/generate", generateController.generate);
  app.post("/generate-campaign", campaignController.generateCampaign);
  app.post("/competitor-analysis", analysisController.competitorAnalysis);
  app.post("/meta/post", metaController.postToMeta); //facebook page ama lmochkla yelzm bussniss verification
  app.post("/telegram/send", postingController.sendPostToTelegram);
};
