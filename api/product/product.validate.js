import yup from "yup";

export const addProductValidationSchema = yup.object({
  name: yup.string().max(55).required().trim(),
  brand: yup.string().max(55).required().trim(),
  price: yup.number().min(1).required(),
  quantity: yup.number().min(1).required(),
  description: yup.string().max(1000).required().trim(),
  category: yup
    .string()
    .trim()
    .required("Category must be required")
    .oneOf([
      "electronics",
      "clothing",
      "shoes",
      "grocery",
      "auto",
      "sports",
      "furniture",
      "liquor",
    ]),
  freeshipping: yup.boolean().required(),
  image: yup.string().required().trim(),
});
