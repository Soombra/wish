const mongoose = require("mongoose");
const wishSchema = mongoose.Schema(
  {
    title: String,
    date_done: Date,
    date_fail: Date,
    status: {
      type: String,
      default: "todo"
    }
  },
  {
    timestamps: { createdAt: "date_created", updatedAt: "date_updated" }
  }
);
const wishModel = mongoose.model("wish", wishSchema);

const apis = function(app) {
  app.post("/wish", function(req, res, next) {
    const {
      body: { title }
    } = req;
    if (title) {
      let wish = new wishModel({ title });
      wish.save(function(err, wish) {
        if (err) {
          console.log(err);
          res.status(500).send("error");
        } else {
          res.status(201).send(wish);
        }
      });
    } else {
      res.status(400).send("Bad Request");
    }
  });
  app.get("/wishes", async function(req, res, next) {
    const { status } = req.query;
    try {
      const totalCount = await wishModel.countDocuments();
      const wishes = await wishModel.find({ status }, "title status", {
        sort: { date_created: -1 }
      });
      res.set("x-total-count", totalCount).status(200).send(wishes);
    } catch (e) {
      console.log(e);
      res.status(500).send("出了点错误");
    }
  });
  app.get("/wishes/doing", async function(req, res, next) {
    try {
      const wish = await wishModel.findOne({ status: "doing" }, "title status");
      res.status(200).send(wish);
    } catch (e) {
      console.log(e);
      res.status(500).send("出了点错误");
    }
  });
  app.put("/wishes/:id", async function(req, res, next) {
    const {
      body: { status },
      params: { id }
    } = req;
    try {
      const wish = await wishModel.updateOne({ _id: id }, { status });
      res.status(201).send(wish);
    } catch (e) {
      console.log(e);
      res.status(500).send("出了点错误");
    }
  });
};
module.exports = apis;
