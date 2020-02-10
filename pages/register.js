import React from "react";
import { Component } from "react";
import Head from "next/head";
import BackButton from "../components/backButton";
import TestkoLogo from "../components/TestkoLogo";
import Layout from "../components/layout";
import RegisterBox from "../components/register";

const layoutStyle = {
  background: "whitesmoke"
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { page: "loading" };
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Registracija v Testko sistem</title>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
          />
        </Head>
        <div className="hero container" style={layoutStyle}>
          <div className="d-flex d-row justify-content-center align-items-center">
            <TestkoLogo />
            <h1 className="display-3 alert"> Registracija</h1>
          </div>
          <div className="text-left">
            <BackButton />{" "}
          </div>
          <div className="row pt-3">
            <div className="col-xl-6 col-12 text-left border p-5  ">
              <RegisterBox />
            </div>
            <div className="col-xl-6  col-12 text-left border p-5 h6">
              <h4>Ali ste vedeli?</h4> Testko je prva aplikacija v Sloveniji za
              generiranje izpitov. Uporablja ga več kot 5000 profesorjev po
              celotni pokrajini!
              {/*  <p>
            {" "}
            Za <span className="underline">uporabniško ime</span> si lahko
            izberete poljuben naziv.
          </p>{" "}
          <p>
            <br></br>
          </p>
          <p>
            V email polje vnesite naslov vašega e-poštnega nabiralnika. Nanj
            boste prejeli potrdilo.
          </p>{" "}
          <p>
            <br></br>
            <br></br> Izberite si varno geslo, priporočamo kombinacijo črk,
            simbolov in številk.
          </p> */}
            </div>
          </div>
        </div>
        <style jsx>{`
          .hero {
            width: 100%;
            margin: 0 auto;
            text-align: center;
            color: #333;
          }
        `}</style>
        <script src="https://kit.fontawesome.com/7b06c8d931.js"></script>
      </Layout>
    );
  }
}

export default Register;
