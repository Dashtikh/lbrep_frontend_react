import React, { useEffect, useContext } from "react";
import { Link, Router, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";
import login from "./Assets/login.jpg";
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { FlashAuto } from "@mui/icons-material";
import { width } from "@mui/system";
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
    padding: "5rem 3rem",
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
  },
  loginBtn: {
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

function Login() {
  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);
  const initialState = {
    usernameValue: "",
    passwordValue: "",
    sendRequest: 0,
    token: "",
    openSnack: false,
    disabledBtn: false,
    serverError: false,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchToken":
        draft.token = action.tokenValue;
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
      case "catchServerError":
        draft.serverError = true;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    console.log("submitted");
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function SignIn() {
        try {
          const response = await Axios.post(
            "https://api.amlakiproject.ir/api_auth_djoser/token/login/",
            {
              username: state.usernameValue,
              password: state.passwordValue,
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          dispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
          GlobalDispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
        } catch (error) {
          console.log(error.response);
          dispatch({ type: "allowTheButton" });
          dispatch({ type: "catchServerError" });
        }
      }
      SignIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.token !== "") {
      const source = Axios.CancelToken.source();
      async function GetUserInfo() {
        try {
          const response = await Axios.get(
            "https://api.amlakiproject.ir/api_auth_djoser/users/me/",
            {
              headers: { Authorization: "token ".concat(state.token) },
            },
            {
              cancelToken: source.token,
            }
          );
          GlobalDispatch({
            type: "userSignsIn",
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            idInfo: response.data.id,
          });
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.log(error.response);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.fullPage}>
      <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent="center">
            <Typography variant="h4">ورود</Typography>
          </Grid>
          {state.serverError ? (
            <Alert severity="error">اطلاعات وارد شده صحیح نمی‌باشد</Alert>
          ) : (
            ""
          )}
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              inputProps={{ style: { textAlign: "left" } }}
              id="username"
              label="نام کاربری"
              variant="outlined"
              fullWidth
              onChange={(e) =>
                dispatch({
                  type: "catchUsernameChange",
                  usernameChosen: e.target.value,
                })
              }
              error={state.serverError ? true : false}
            />
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              inputProps={{ style: { textAlign: "left" } }}
              id="password"
              dir="rtl"
              label="کلمه عبور"
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
              error={state.serverError ? true : false}
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
              className={classes.loginBtn}
              disabled={state.disabledBtn}
            >
              ورود
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
            اکانت ندارید؟{" "}
            <span
              style={{ cursor: "pointer", color: "#1976d2" }}
              onClick={() => navigate("/register")}
            >
              ثبت نام کنید
            </span>
          </Typography>
        </Grid>
      </div>
      <Snackbar
        open={state.openSnack}
        message="با موفقیت وارد شدید!"
        anchorOrigin={{
          vertical: "buttom",
          horizontal: "center",
        }}
      />
    </div>
  );
}

export default Login;
