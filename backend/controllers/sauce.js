const Sauce = require('../models/sauce');

exports.getSauces = (req, res, next) => {
  // const saucesObject = JSON.parse(req.body.);
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
  console.log(req.body);
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


// exports.afficher = async (req, res, next) => {
//   try {
//     const sauces = res.json();
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       err,
//     });
//   }
// }
