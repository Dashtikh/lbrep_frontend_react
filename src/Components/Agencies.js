import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import StateContext from "../Contexts/StateContext";
import { useImmerReducer } from "use-immer";
import ProfileUpdate from "./ProfileUpdate";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import login from "./Assets/login.jpg";
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
  cardContainer: {
    height: "calc(100vh - 64px)",
    paddingTop: '64px',
    overflow: 'auto',
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none" /* Safari and Chrome */,
    },
  },
  
  cardStyle: {
    borderRadius: "20px",
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    
  },
});

function Agencies() {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    dataIsLoading: true,
    agenciesList: [],
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchAgencies":
        draft.agenciesList = action.agenciesArray;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
  useEffect(() => {
    async function GetAgencies() {
      try {
        const response = await Axios.get("http://localhost:8000/api/profiles/");
        console.log(response.data);
        dispatch({
          type: "catchAgencies",
          agenciesArray: response.data,
        });
        dispatch({
          type: "loadingDone",
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetAgencies();
  }, []);
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
    <div className={classes.fullPage}>
      <div justifyContent="center" className={classes.cardContainer} style={{marginTop: '0.1rem'}} >
        <Grid
          container
          justifyContent="center"
          spacing={2}
          style={{ padding: "10px" }}
          direction="row"
          gap={4}
          xs={12}
        >
          {state.agenciesList.map((agency) => {
            function PropertiesDisplay() {
              if (agency.seller_listings.length === 0) {
                return (
                  <Button
                    onClick={() => navigate(`/agencies/${agency.seller}`)}
                    disabled
                    size="small"
                  >
                    بدون ملک
                  </Button>
                );
              } else {
                return (
                  <Button
                    onClick={() => navigate(`/agencies/${agency.seller}`)}
                    size="small"
                  >
                    {" "}
                    تعداد ملک: {agency.seller_listings.length}
                  </Button>
                );
              }
            }
            if (agency.agency_name && agency.phone_number) {
              return (
                <div
                  key={agency.id}
                  item
                  style={{
                    marginBottom: '1rem',
                    width: "20rem",
                    overflow: "auto",
                  }}
                  
                >
                  <Card className={classes.cardStyle}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={
                        agency.profile_picture
                          ? agency.profile_picture
                          : defaultProfilePicture
                      }
                      title="عکس پروفایل"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {agency.agency_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {agency.bio.substring(0, 100)}
                      </Typography>
                    </CardContent>
                    <CardActions>{PropertiesDisplay()}</CardActions>
                  </Card>
                </div>
              );
            }
          })}
        </Grid>
      </div>
    </div>
    // 8taaaaaaaaaaaa<3
  );
}

export default Agencies;
