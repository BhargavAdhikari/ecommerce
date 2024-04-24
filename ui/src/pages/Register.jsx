import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import axios from "axios";

const Register = () => {
  const minDate = dayjs().startOf("d").subtract(18, "y");
  // console.log(minDate);
  const navigate = useNavigate();

  const { isLoading, isError, error, mutate } = useMutation({
    mutationKey: ["register-key"],
    mutationFn: async (values) => {
      return await axios.post("http://localhost:8000/user/register", values);
    },
    onSuccess: (response) => {
      console.log(response);
      navigate("/login");
    },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {isLoading && <LinearProgress color="success" />}
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          dob: "",
          gender: "",
          role: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .required("First name is required.")
            .trim()
            .max(25, "First name must be at max 25 characters."),
          lastName: Yup.string()
            .required("Last name is required.")
            .trim()
            .max(25, "Last name must be at max 55 characters."),
          email: Yup.string()
            .email("Must be valid email.")
            .required("Email is required.")
            .trim()
            .lowercase()
            .max(55, "Email must be at max 55 characters."),
          password: Yup.string()
            .required("Password is required.")
            .trim()
            .min(4, "Password must be at least 4 characters.")
            .max(20, "Password must be at max 20 characters."),
          dob: Yup.date().nullable(),
          // gender: Yup.string()
          //   .nullable()
          //   .oneOf(["male", "female", "other"])
          //   .trim(),
          role: Yup.string().required().trim().oneOf(["buyer", "seller"]),
        })}
        onSubmit={(values) => {
          values.gender = null;
          values.dob = null;
          mutate(values);
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "2rem",
              minWidth: "315px",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <Typography variant="h5"> Sign Up</Typography>
            <FormControl>
              <TextField
                required
                label="First Name"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <FormHelperText error>
                  {" "}
                  {formik.errors.firstName}{" "}
                </FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                required
                label="Last Name"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <FormHelperText error>
                  {" "}
                  {formik.errors.lastName}{" "}
                </FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                required
                label="Email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <FormHelperText error> {formik.errors.email} </FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                required
                label="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <FormHelperText error>
                  {" "}
                  {formik.errors.password}{" "}
                </FormHelperText>
              ) : null}
            </FormControl>

            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    disableFuture
                    label="DOB"
                    minDate={minDate}
                    onChange={(event) => {
                      console.log(event);
                      formik.setFieldValue(
                        "dob",
                        dayjs(event).format("DD/MM/YYYY")
                      );
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {formik.touched.dob && formik.errors.dob ? (
                <FormHelperText error> {formik.errors.dob} </FormHelperText>
              ) : null}
            </FormControl>

            {/* <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select label="Gender" {...formik.getFieldProps("gender")}>
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
                <MenuItem value={"other"}>Others</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender ? (
                <FormHelperText error> {formik.errors.gender} </FormHelperText>
              ) : null}
            </FormControl> */}

            <FormControl fullWidth>
              <InputLabel required>Role</InputLabel>
              <Select label="Role" {...formik.getFieldProps("role")}>
                <MenuItem value={"buyer"}>Buyer</MenuItem>
                <MenuItem value={"seller"}>Seller</MenuItem>
              </Select>
              {formik.touched.role && formik.errors.role ? (
                <FormHelperText error> {formik.errors.role} </FormHelperText>
              ) : null}
            </FormControl>

            <Button type="submit" variant="contained" color="success">
              {" "}
              Submit
            </Button>
            <Link to="/login">
              {" "}
              <Typography variant="body2">
                Already Registered? Login
              </Typography>{" "}
            </Link>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
