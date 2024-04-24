import yup from "yup";

const addItemToCartValidation = yup.object({
  productId: yup.string().required().trim(),
  orderedQuantity: yup.number().min(1).required(),
});

export { addItemToCartValidation };
