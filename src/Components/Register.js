import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import login from "./Assets/login.jpg";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useImmerReducer } from "use-immer";
const useStyles = makeStyles({
  fullPage: {
    backgroundImage: `url(${login})`,
    width: "100%",
    height: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  formContainer: {
    width: 500,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "3rem 5rem",
    borderRadius: '20px',
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: "3rem",
  },
  registerBtn: {
    backgroundColor: "black",
    color: "white",
    fontSize: "1.1rem",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
});

function Register() {
  const initialState = {
    usernameValue: "",
    emailValue: "",
    passwordValue: "",
    password2Value: "",
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
    usernameErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    emailErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    passwordErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    password2HelperText: "",
    serverMessageUsername: "",
    serverMessageEmail: "",
    serverMessageSimilarPassword: "",
    serverMessageCommonPassword: "",
    serverMessageNumericPassword: "",
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.usernameErrors.hasErrors = false;
        draft.usernameErrors.errorMessage = "";
        draft.serverMessageUsername = "";
        break;
      case "catchEmailChange":
        draft.emailValue = action.emailChosen;
        draft.emailErrors.hasErrors = false;
        draft.emailErrors.errorMessage = "";
        draft.serverMessageEmail = "";
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.passwordErrors.hasErrors = false;
        draft.passwordErrors.errorMessage = "";
        draft.serverMessageSimilarPassword = "";
        draft.serverMessageCommonPassword = "";
        draft.serverMessageNumericPassword = "";
        break;
      case "catchPassword2Change":
        draft.password2Value = action.password2Chosen;
        if (action.password2Chosen !== draft.passwordValue) {
          draft.password2HelperText =
            "تکرار رمز عبور با رمز عبور یکسان نمی‌باشد";
        } else if (action.password2Chosen === draft.passwordValue) {
          draft.password2HelperText = "";
        }
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;
      case "disableTheButton":
        draft.disabledBtn = true;
        break;
      case "allowTheButton":
        draft.disabledBtn = false;
        break;
      case "catchUsernameErrors":
        if (action.usernameChosen.length === 0) {
          draft.usernameErrors.hasErrors = true;
          draft.usernameErrors.errorMessage = "این قسمت نباید خالی بماند!";
        } else if (action.usernameChosen.length < 5) {
          draft.usernameErrors.hasErrors = true;
          draft.usernameErrors.errorMessage =
            "نام کاربری باید بیشتر از ۴ کاراکتر باشد!";
        } else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
          draft.usernameErrors.hasErrors = true;
          draft.usernameErrors.errorMessage =
            "نام کاربری نباید حاوی کاراکتر‌های خاص باشد!";
        }
        break;
      case "catchEmailErrors":
        if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            action.emailChosen
          )
        ) {
          draft.emailErrors.hasErrors = true;
          draft.emailErrors.errorMessage = "ایمیل وارد شده معتبر نمی‌باشد!";
        }
        break;
      case "catchPasswordErrors":
        if (action.passwordChosen.length < 8) {
          draft.passwordErrors.hasErrors = true;
          draft.passwordErrors.errorMessage =
            "رمز عبور باید حداقل ۸ کاراکتر باشد!";
        }
        break;
      case "usernameExists":
        draft.serverMessageUsername = "این نام کاربری قبلا ثبت شده‌ است!";
        break;
      case "emailExists":
        draft.serverMessageEmail = "این ایمیل قبلا ثبت شده‌ است!";
        break;
      case "similarPassword":
        draft.serverMessageSimilarPassword =
          "رمز عبور نباید شبیه نام کاربری باشد!";
        break;
      case "commonPassword":
        draft.serverMessageCommonPassword = "رمز عبور متداول است!";
        break;
      case "numericPassword":
        draft.serverMessageNumericPassword =
          "رمز عبور نباید فقط حاوی اعداد باشد!";
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  const classes = useStyles();
  const navigate = useNavigate();

  function FormSubmit(e) {
    e.preventDefault();
    console.log("submitted");
    if (
      !state.usernameErrors.hasErrors &&
      !state.emailErrors.hasErrors &&
      !state.passwordErrors.hasErrors &&
      state.password2HelperText === ""
    ) {
      dispatch({ type: "changeSendRequest" });
      dispatch({ type: "disableTheButton" });
    }
  }
  useEffect(() => {
    console.log(state.usernameValue);
  }, [state.usernameValue]);
  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function SingUp() {
        try {
          const response = await Axios.post(
            "http://localhost:8000/api_auth_djoser/users/",
            {
              username: state.usernameValue,
              email: state.emailValue,
              password: state.passwordValue,
              re_password: state.password2Value,
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.log(error.response);
          if (error.response.data.username) {
            dispatch({ type: "usernameExists" });
          } else if (error.response.data.email) {
            dispatch({ type: "emailExists" });
          } else if (
            error.response.data.password[0] ===
            "The password is too similar to the username."
          ) {
            dispatch({ type: "similarPassword" });
          } else if (
            error.response.data.password[0] === "This password is too common."
          ) {
            dispatch({ type: "commonPassword" });
          } else if (
            error.response.data.password[0] ===
            "This password is entirely numeric."
          ) {
            dispatch({ type: "numericPassword" });
          }

          dispatch({ type: "allowTheButton" });
        }
      }
      SingUp();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

  return (
    <div className={classes.fullPage}>
      <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent="center">
            <Typography variant="h4">ساخت اکانت</Typography>
          </Grid>
          {state.serverMessageUsername ? (
            <Alert severity="error">{state.serverMessageUsername}</Alert>
          ) : (
            ""
          )}
          {state.serverMessageEmail ? (
            <Alert severity="error">{state.serverMessageEmail}</Alert>
          ) : (
            ""
          )}
          {state.serverMessageSimilarPassword ? (
            <Alert severity="error">{state.serverMessageSimilarPassword}</Alert>
          ) : (
            ""
          )}
          {state.serverMessageCommonPassword ? (
            <Alert severity="error">{state.serverMessageCommonPassword}</Alert>
          ) : (
            ""
          )}
          {state.serverMessageNumericPassword ? (
            <Alert severity="error">{state.serverMessageSimilarPassword}</Alert>
          ) : (
            ""
          )}

          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="username"
              inputProps={{ style: { textAlign: "left" } }}
              label="نام کاربری"
              variant="outlined"
              fullWidth
              value={state.usernameValue}
              onChange={(e) =>
                dispatch({
                  type: "catchUsernameChange",
                  usernameChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchUsernameErrors",
                  usernameChosen: e.target.value,
                })
              }
              error={state.usernameErrors.hasErrors ? true : false}
              helperText={state.usernameErrors.errorMessage}
            />
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              inputProps={{ style: { textAlign: "left" } }}
              id="email"
              label="ایمیل"
              variant="outlined"
              fullWidth
              value={state.emailValue}
              onChange={(e) =>
                dispatch({
                  type: "catchEmailChange",
                  emailChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchEmailErrors",
                  emailChosen: e.target.value,
                })
              }
              error={state.emailErrors.hasErrors ? true : false}
              helperText={state.emailErrors.errorMessage}
            />
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              inputProps={{ style: { textAlign: "left" } }}
              id="password"
              label="رمز عبور"
              variant="outlined"
              fullWidth
              type="password"
              value={state.passwordValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPasswordChange",
                  passwordChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchPasswordErrors",
                  passwordChosen: e.target.value,
                })
              }
              error={state.passwordErrors.hasErrors ? true : false}
              helperText={state.passwordErrors.errorMessage}
            />
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              inputProps={{ style: { textAlign: "left" } }}
              id="password2"
              label="تکرار رمز عبور "
              variant="outlined"
              fullWidth
              type="password"
              value={state.password2Value}
              onChange={(e) =>
                dispatch({
                  type: "catchPassword2Change",
                  password2Chosen: e.target.value,
                })
              }
              helperText={state.password2HelperText}
            />
          </Grid>
          <Grid
            item
            container
            xs={8}
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className={classes.registerBtn}
              disabled={state.disabledBtn}
            >
              ساخت اکانت
            </Button>
          </Grid>
        </form>
        <Grid
          item
          container
          style={{ marginTop: "1rem" }}
          justifyContent="center"
        >
          <Typography variant="small">
            اکانت دارید؟{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", color: "#1976d2" }}
            >
              ورود به اکانت
            </span>
          </Typography>
        </Grid>
        <Snackbar
          open={state.openSnack}
          message="اکانت کاربری شما با موفقیت ساخته شد!"
          anchorOrigin={{
            vertical: "buttom",
            horizontal: "center",
          }}
        />
      </div>
    </div>
  );
}

export default Register;
