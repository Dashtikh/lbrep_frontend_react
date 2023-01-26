import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
// Components
import Home from "./Components/home";
import Login from "./Components/login";
import Listings from "./Components/listings";
import { StyledEngineProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Header from "./Components/Header";
import Register from "./Components/Register";
import { useImmerReducer } from "use-immer";
import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";
import AddProperty from "./Components/AddProperty";
import Profile from "./Components/Profile";
import Agencies from "./Components/Agencies";
import AgencyDetail from "./Components/AgencyDetail";
import ListingDetail from "./Components/ListingDetail";
import AccountCreated from "./Components/AccountCreated";
import Activation from "./Components/Activation";
function App() {
  const initialState = {
    userUsername: localStorage.getItem("theUserUsername"),
    userEmail: localStorage.getItem("theUserEmail"),
    userId: localStorage.getItem("theUserId"),
    userToken: localStorage.getItem("theUserToken"),
    userIsLogged: localStorage.getItem("theUserUsername") ? true : false,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchToken":
        draft.userToken = action.tokenValue;
        break;
      case "userSignsIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.idInfo;
        draft.userIsLogged = true;
        break;
      case "logout":
        draft.userIsLogged = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem("theUserUsername", state.userUsername);
      localStorage.setItem("theUserEmail", state.userEmail);
      localStorage.setItem("theUserId", state.userId);
      localStorage.setItem("theUserToken", state.userToken);
    } else {
      localStorage.removeItem("theUserUsername");
      localStorage.removeItem("theUserEmail");
      localStorage.removeItem("theUserId");
      localStorage.removeItem("theUserToken");
    }
  }, [state.userIsLogged]);

  // useEffect(() => {
  //   if (localStorage.getItem("theUserId")) {
  //    
  //     dispatch({
  //       type: "userSignsIn",
  //       usernameInfo: localStorage.getItem("theUserUsername"),
  //       emailInfo: localStorage.getItem("theUserEmail"),
  //       idInfo: localStorage.getItem("theUserId"),
  //       userToken: localStorage.getItem("theUserToken"),
  //       userIsLogged: true
  //     });
  //   }
  // }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <CssBaseline />
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/activate/:uid/:token" element={<Activation />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/addproperty" element={<AddProperty />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/agencies" element={<Agencies />} />
              <Route path="/created" element={<AccountCreated />} />
              <Route path="/agencies/:id" element={<AgencyDetail />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
