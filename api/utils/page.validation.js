import yup from "yup";

export const paginationValidationSchema = yup.object({
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).default(6).max(6),
});
