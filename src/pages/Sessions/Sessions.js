import React, { useState } from "react";
import "./Sessions.css";
import Filter from "../../components/Filter/Filter";

function Head(){

  return (
    <div className="head">
      <div className="head__logo">
        <h1 className="head-title">СЕАНСИ</h1>
      </div>
      <div className="head__authentication">
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
