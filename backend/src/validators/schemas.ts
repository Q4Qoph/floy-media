import Joi from 'joi';

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const adminRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().allow('', null)
});

export const bookingSchema = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  serviceRequired: Joi.string().required(),
  projectType: Joi.string().allow('', null),
  projectDate: Joi.date().iso().allow(null),
  projectTime: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  duration: Joi.string().allow('', null),
  mediaType: Joi.string().allow('', null),
  expectedGuests: Joi.number().integer().min(0).allow(null),
  budgetRange: Joi.string().allow('', null),
  specialRequirements: Joi.string().allow('', null),
  message: Joi.string().allow('', null),
  status: Joi.string().optional(),
  adminNotes: Joi.string().allow('', null)
});

export const bookingUpdateSchema = bookingSchema.fork(
  ['fullName', 'phoneNumber', 'email', 'serviceRequired'],
  (schema) => schema.optional()
).min(1);

export const galleryCategorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().allow('', null),
  description: Joi.string().allow('', null)
});

export const galleryCategoryUpdateSchema = galleryCategorySchema.fork(['name'], (schema) => schema.optional()).min(1);

export const galleryItemSchema = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  fileUrl: Joi.string().allow('', null),
  thumbnailUrl: Joi.string().allow('', null),
  mediaType: Joi.string().valid('IMAGE', 'VIDEO').required(),
  projectDate: Joi.date().iso().allow(null),
  location: Joi.string().allow('', null),
  clientName: Joi.string().allow('', null),
  isFeatured: Joi.boolean().default(false),
  isPublic: Joi.boolean().default(true),
  displayOrder: Joi.number().integer().default(0)
});

export const galleryItemUpdateSchema = galleryItemSchema
  .fork(['title', 'mediaType'], (schema) => schema.optional())
  .min(1);

export const videoSchema = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  thumbnailUrl: Joi.string().allow('', null),
  videoUrl: Joi.string().allow('', null),
  clientName: Joi.string().allow('', null),
  date: Joi.date().iso().allow(null),
  isPublic: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false)
});

export const videoUpdateSchema = videoSchema.fork(['title'], (schema) => schema.optional()).min(1);

export const serviceSchema = Joi.object({
  serviceName: Joi.string().required(),
  shortDescription: Joi.string().allow('', null),
  fullDescription: Joi.string().allow('', null),
  imageUrl: Joi.string().allow('', null),
  isActive: Joi.boolean().default(true),
  displayOrder: Joi.number().integer().default(0)
});

export const serviceUpdateSchema = serviceSchema.fork(['serviceName'], (schema) => schema.optional()).min(1);

export const teamApplicationSchema = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  location: Joi.string().allow('', null),
  skillArea: Joi.string().required(),
  experienceLevel: Joi.string().allow('', null),
  portfolioLink: Joi.string().allow('', null),
  socialMediaLink: Joi.string().allow('', null),
  equipmentOwned: Joi.string().allow('', null),
  availability: Joi.string().allow('', null),
  message: Joi.string().allow('', null),
  status: Joi.string().optional()
});

export const teamApplicationUpdateSchema = teamApplicationSchema
  .fork(['fullName', 'phoneNumber', 'email', 'skillArea'], (schema) => schema.optional())
  .min(1);

export const contactSchema = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().allow('', null),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
  status: Joi.string().optional()
});

export const contactUpdateSchema = contactSchema
  .fork(['fullName', 'email', 'subject', 'message'], (schema) => schema.optional())
  .min(1);

export const packageSchema = Joi.object({
  packageName: Joi.string().required(),
  description: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  displayOrder: Joi.number().integer().default(0),
  isActive: Joi.boolean().default(true)
});

export const packageUpdateSchema = packageSchema.fork(['packageName'], (schema) => schema.optional()).min(1);

export const projectSchema = Joi.object({
  projectName: Joi.string().required(),
  clientName: Joi.string().allow('', null),
  projectDate: Joi.date().iso().allow(null),
  description: Joi.string().allow('', null),
  isFeatured: Joi.boolean().default(false)
});

export const projectUpdateSchema = projectSchema.fork(['projectName'], (schema) => schema.optional()).min(1);
