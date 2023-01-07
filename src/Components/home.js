import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, Grid, AppBar, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { height, width } from "@mui/system";
import city from "./Assets/login.jpg";
import zIndex from "@mui/material/styles/zIndex";

const useStyles = makeStyles({
  cityImg: {
    width: "100%",
    height: "94vh",
  },
  overlayText: {
    position: "absolute",
    zIndex: "100",
    top: "300px",
    marginLeft:'20',
    
    textAlign: "center",
  },
  homeText: {
    color: "black",
    fontWeight: "bolder",
    marginLeft:'auto',
    marginRight: '7rem'
  },

  homeBtn: {
    fontSize: "2.1rem",
    borderRadius: "15px",
    backgroundColor: "black",
    marginTop: "2rem",
    
    marginRight: "4rem",

    "&:hover": {
      boxShadow: "3px 3px 3px black",
      backgroundColor: "white",
      color: 'black'
    },
  },
});
function Home() {
  const classes = useStyles();
  const navigate = useNavigate()
  return (
    <>
      <div>
        <img className={classes.cityImg} src={city} />
        <div className={classes.overlayText}>
          <Typography variant="h1" className={classes.homeText}>
            <span style={{ fontWeight: "bolder" }}>ملک بعدی </span>
            خود را در سایت ما پیدا کنید!
          </Typography>
          <Button onClick={()=>navigate('/listings')} variant="contained" className={classes.homeBtn}>
            املاک را ببینید
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
