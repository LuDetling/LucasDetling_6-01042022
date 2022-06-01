const Sauce = require("../models/sauce");
const fs = require("fs");

exports.getSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json(sauces);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.getSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findOne({
      _id: req.params.id,
    });
    res.status(200).json(sauce);
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};

exports.createSauce = async (req, res, next) => {
  const newSauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...newSauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  try {
    await sauce.save();
    res.status(201).json({
      message: "Objet enregistré !",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.modifySauce = async (req, res, next) => {
  const newSauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      };
  try {
    const sauce = await Sauce.updateOne(
      {
        _id: req.params.id,
      },
      {
        ...newSauce,
        _id: req.params.id,
      }
    );
    res.status(200).json({
      message: "Objet modifié !",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.deleteSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findOne({
      _id: req.params.id,
    });
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      try {
        await Sauce.deleteOne({
          _id: req.params.id,
        });
        res.status(200).json({
          message: "Objet supprimé !",
        });
      } catch (error) {
        res.status(400).json({
          error,
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.likeSauce = async (req, res, next) => {
  const { id } = req.params;
  let { like, userId } = req.body;

  const sauce = await Sauce.findById(id);

  if (like === 1) {
    if (sauce.usersDisliked.includes(userId)) {
      await Sauce.updateOne(
        {
          _id: id,
        },
        {
          $inc: {
            dislikes: 1,
          },
          $pull: {
            usersDisliked: userId,
          },
        }
      );
    }
    try {
      await Sauce.updateOne(
        {
          _id: id,
        },
        {
          $inc: {
            likes: 1,
          },
          $push: {
            usersLiked: userId,
          },
        }
      );
      res.status(200).json(sauce);
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  } else if (like === 0) {
    if (sauce.usersLiked.includes(userId)) {
      try {
        await Sauce.updateOne(
          {
            _id: id,
          },
          {
            $inc: {
              likes: -1,
            },
            $pull: {
              usersLiked: userId,
            },
          }
        );
        res.status(200).json(sauce);
      } catch (error) {
        res.status(400).json({
          error,
        });
      }
    } else if (sauce.usersDisliked.includes(userId)) {
      try {
        await Sauce.updateOne(
          {
            _id: id,
          },
          {
            $inc: {
              dislikes: -1,
            },
            $pull: {
              usersDisliked: userId,
            },
          }
        );
        res.status(200).json(sauce);
      } catch (error) {
        res.status(400).json({
          error,
        });
      }
    }
  } else if (like === -1) {
    if (sauce.usersLiked.includes(userId)) {
      await Sauce.updateOne(
        {
          _id: id,
        },
        {
          $inc: {
            likes: -1,
          },
          $pull: {
            usersLiked: userId,
          },
        }
      );
    }
    try {
      await Sauce.updateOne(
        {
          _id: id,
        },
        {
          _id: id,
          $inc: {
            dislikes: 1,
          },
          $push: {
            usersDisliked: userId,
          },
        }
      );

      res.status(200).json({
        message: "Dislike",
      });
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  }
};
