import React, { useState } from "react";
import "./Sessions.css";
import Filter from "../../components/Filter/Filter";
import Logout from "../../components/Logout/Logout";

function Head(){

  return (
    <div className="head">
      <div className="head__logo">
        <h1 className="head-title">СЕАНСИ</h1>
      </div>
      <div className="head__authentication">
        <Logout/>
      </div>
    </div>
  );
}

const Sessions = () => {
  return (
    <section className="sessions">
      <Head/>
      <Filter />
    </section>
  );
};
export default Sessions;
