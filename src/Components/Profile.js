import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import StateContext from "../Contexts/StateContext";
import { useImmerReducer } from "use-immer";
import ProfileUpdate from "./ProfileUpdate";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import login from "./Assets/login.jpg";
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
const useStyles = makeStyles({
  formContainer: {
    width: "1000px",
    marginLeft: "auto",
    marginRight: "auto",
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none" /* Safari and Chrome */},

    padding: "3rem",
    overflow: "auto",
  },
  loginBtn: {
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "1.1rem",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "green",
      color: "white",
    },
  },
  picturesBtn: {
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "0.8rem",
    marginLeft: "1rem",
  },
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
    flexDirection: "column",
  },
});

function Profile() {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerId: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        draft.userProfile.sellerId = action.profileObject.seller;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({
          type: "loadingDone",
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfileInfo();
  }, []);

  function PropertiesDisplay() {
    if (state.userProfile.sellerListings.length === 0) {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          disabled
          size="small"
        >
          هنوز هیج ملکی ندارید
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size="small"
        >
          شما دارای {state.userProfile.sellerListings.length} ملک هستید
        </Button>
      );
    }
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ""
    ) {
      return (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          خوش آمدید{" "}
          <span style={{ color: "green", fontWeight: "bolder" }}>
            {GlobalState.userUsername}
          </span>
          , please submit this form below to update your profile.
        </Typography>
      );
    } else {
      return (
        <div >
          <Grid
          
            item
            xs={6}
            style={{
              width: "100%",
              marginRight: '50%',
              
              borderRadius: "20px",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              
              padding: "5px",
            }}
          >
            <Grid xs={12} item style={{textAlign: 'center'}}>
              <img
                style={{ height: "15rem", width: "13rem", color: 'black' }}
                src={
                  state.userProfile.profilePic !== null
                    ? state.userProfile.profilePic
                    : defaultProfilePicture
                }
              />
            </Grid>
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              xs={12}
            >
              <Grid item>
                <Typography
                  variant="h5"
                  style={{ textAlign: "center", marginTop: "1rem" }}
                >
                  خوش آمدید{" "}
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    {GlobalState.userUsername}
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h5"
                  style={{ textAlign: "center", marginTop: "1rem" }}
                >
                  {PropertiesDisplay()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "90vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <>
      <div className={classes.fullPage}>
        <div
          item
          container
          direction="column"
          className={classes.formContainer}
          style={{alignItems: 'center'}}
        >
          <div  style={{ width: "50%", marginLeft: 'auto', marginLe: 'auto' }} item>
            {WelcomeDisplay()}
          </div>
          <div style={{ width: "100%" }} xs={12} item>
            <ProfileUpdate userProfile={state.userProfile} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
