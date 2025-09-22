const joi = require('joi');

const listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().min(0).required(),
    location: joi.string().required(),
    country: joi.string().required(),
    image: joi.object({
      url: joi.string().uri().allow("", null),
      filename: joi.string().allow("", null)
    }).optional()
  })
});

const reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
  }).required()
});

module.exports = { listingSchema, reviewSchema };