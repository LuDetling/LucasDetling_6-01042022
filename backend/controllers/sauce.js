const Sauce = require('../models/sauce');
const fs = require('fs');
const {
  use
} = require('../routes/sauce');

exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
}

exports.getSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
}

exports.createSauce = (req, res, next) => {
  const newSauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...newSauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Objet enregistré !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.modifySauce = (req, res, next) => {
  const newSauce = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...newSauce,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'Objet modifié !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Objet supprimé !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      })
    })
    .catch(error => res.status(500).json({
      error
    }))
};

exports.likeSauce = (req, res, next) => {


  const {
    id
  } = req.params
  let {
    like,
    userId
  } = req.body
  // si like === 1
  // likes +1
  // userId est push dans le tableau like et est enlevé du tableau dislike
  if (like === 1) {
    Sauce.updateOne({
        _id: id,
      }, {
        _id: id,
        likes: like,
        dislikes: 0,
        // usersLiked: "ok",
        // usersDisliked: Sauce.usersDisliked.filter(userDislike => userDislike !== Number(userId))
      }).then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({
        error
      }))
  } else if (like === 0) {
    Sauce.updateOne({
        _id: id,
      }, {
        _id: id,
        likes: like,
        dislikes: like
        // usersLiked: Sauce.usersLiked.filter(userlike => userlike !== Number(userId)),
        // usersDisliked: Sauce.usersDisliked.filter(userDislike => userDislike !== Number(userId))
      }).then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({
        error
      }))
  } else if (like === -1) {
    Sauce.updateOne({
        _id: id,
      }, {
        _id: id,
        likes: 0,
        dislikes: like
        // usersLiked: Sauce.usersLiked.filter(userlike => userlike !== Number(userId)),
        // usersDisliked: "ok"
      }).then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({
        error
      }))
  }

}