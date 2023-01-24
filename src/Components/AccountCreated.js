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
    width: '100%',
    height: 'calc(100vh - 64px)',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  messageContainer: {
    width: 500,
    marginLeft: "auto",
    marginRight: "auto",
    padding: "5rem 3rem",
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20, 
    marginTop: '-5rem'
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

function AccountCreated() {
  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);


  

  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.fullPage}>
      <Grid item container>
        <Grid xs={7} className={classes.messageContainer}>
            <Typography variant="h4">باتشکر از ثبت نام ، لطفا برای فعال‌سازی ایمیل خود را چک کنید!</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default AccountCreated;
