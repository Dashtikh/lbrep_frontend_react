import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";
import Axios from "axios";
import { Person } from "@mui/icons-material";

const useStyles = makeStyles({
  leftNav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  rightNav: {},
  propertyBtn: {
    backgroundColor: "black",
    borderColor: "white",
    color: "white",
    width: "15rem",
    fontSize: "1.1rem",
    marginRight: "1rem",
    paddingTop: 10,
    height: 42,
    "&:hover": {
      borderColor: "white",
    },
  },
  loginBtn: {
    backgroundColor: "black",
    color: "white",
    fontSize: "1.1rem",
    marginLeft: "1rem",
    marginRight: "2rem",
    borderColor: "black",
    paddingTop: 8,
    height: 42,
    "&:hover": {
      borderColor: "black",
      backgroundColor: "black",
    },
  },
  profileBtn: {
    color: "black",
    width: "15rem",
    fontWeight: "bolder",
    textAlign: "left",
    direction: "ltr",
    height: 64,
  },
  logoutBtn: {
    color: "black",
    width: "15rem",
    fontWeight: "bolder",
    textAlign: "left",
    direction: "ltr",
    height: 64,
  },
});
function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function HandleProfile() {
    setAnchorEl(null);
    navigate("/profile");
  }

  const [openSnack, setOpenSnack] = useState(false);

  async function HandleLogout() {
    setAnchorEl(null);
    const confrimLogout = window.confirm(
      "بعد از تایید از اکانتتان خارج خواهید شد!"
    );
    if (confrimLogout) {
      try {
        const response = await Axios.post(
          "https://api.amlakiproject.ir/api_auth_djoser/token/logout/",
          GlobalState.userToken,
          { headers: { Authorization: "token ".concat(GlobalState.userToken) } }
        );
        console.log(response);
        GlobalDispatch({ type: "logout" });
        setOpenSnack(true);
      } catch (e) {
        console.log(e.response);
      }
    }
  }

  useEffect(() => {
    if (openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [openSnack]);
  return (
    <>
      <AppBar
        position="sticky"
        style={{ backgroundColor: "black", zIndex: 2000 }}
      >
        <Toolbar
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
          }}
        >
          <div className={classes.leftNav}>
            <div>
              <Button color="inherit" onClick={() => navigate("/")}>
                <Typography variant="h4">املاکی</Typography>
              </Button>
            </div>
            <div>
              <Button color="inherit" onClick={() => navigate("/listings")}>
                <Typography variant="h6">لیست املاک</Typography>
              </Button>
              <Button onClick={() => navigate("/agencies")} color="inherit">
                <Typography variant="h6">آژانس‌ها</Typography>
              </Button>
            </div>
          </div>
          <div className={classes.rightNav}>
            <Button
              className={classes.propertyBtn}
              onClick={() => navigate("/addproperty")}
              variant="outlined"
            >
              {" "}
              اضافه کردن ملک +
            </Button>
            {console.log("GlobalState", GlobalState)}
            {GlobalState.userIsLogged ? (
              <Button
                className={classes.loginBtn}
                onClick={handleClick}
                //onClick={() => navigate("/login")}
                variant="text"
              >
                {GlobalState.userUsername}
                <Person
                  color="white"
                  style={{ marginBottom: 8, marginRight: 8 }}
                />
              </Button>
            ) : (
              <Button
                className={classes.loginBtn}
                onClick={() => navigate("/login")}
              >
                ورود
                <Person
                  color="white"
                  style={{ marginBottom: 0, marginRight: 8 }}
                />
              </Button>
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              style={{ zIndex: 2200 }}
            >
              <MenuItem className={classes.profileBtn} onClick={HandleProfile}>
                ناحیه کاربری
              </MenuItem>
              <MenuItem className={classes.logoutBtn} onClick={HandleLogout}>
                خروج
              </MenuItem>
            </Menu>
            <Snackbar
              open={openSnack}
              message="با موفقیت خارج شدید!"
              anchorOrigin={{
                vertical: "buttom",
                horizontal: "center",
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
