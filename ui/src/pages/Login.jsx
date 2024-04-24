import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const Login = () => {
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object({
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
      })}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleSubmit, errors, touched, getFieldProps }) => (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1.5rem",
            minWidth: "320px",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          <Typography variant="h5"> Log In</Typography>
          <FormControl>
            <TextField label="Email" {...getFieldProps("email")} />

            {touched.email && errors.email ? (
              <FormHelperText error> {errors.email}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl>
            <TextField label="Password" {...getFieldProps("password")} />

            {touched.password && errors.password ? (
              <FormHelperText error> {errors.password}</FormHelperText>
            ) : null}
          </FormControl>
          <Button type="submit" variant="contained" color="success">
            {" "}
            <Typography variant="button"> Log In</Typography>
          </Button>
          <Link to="/register">
            {" "}
            <Typography variant="body2">New User? Register</Typography>{" "}
          </Link>
        </form>
      )}
    </Formik>
  );
};

export default Login;
