// 必要なモジュールをインポートする。
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./../../App.css";
import "./Header.css";
import App from "./../../App";
import Web3Menu from "./Web3Menu";
// material-ui関連をインポートする。
import AppBar  from '@mui/material/AppBar';
import Toolbar  from '@mui/material/Toolbar';
import Typography  from '@mui/material/Typography';

/**
 * Headerコンポーネント
 */
const Header = () => {
  return (
    <>
      <Router>
          <AppBar position="static" color="default">
            <Toolbar className="toolbar">
              <Typography variant="h6" color="black" sx={{ flexGrow: 1 }}>
                <strong>My NFT GAME</strong>
              </Typography>
              <Typography variant="h6" color="inherit">
                <Web3Menu/>
              </Typography>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" exact element={ <App/> } />
            <Route path="/home" exact element={ <App/> } />
          </Routes>
      </Router>
    </>
  );
}

// コンポーネントを外部に公開
export default Header;

// <Route path="/create" exact element={ <Create/> } />