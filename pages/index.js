import React from "react";
import Head from "next/head";
import TestkoLogo from "../components/TestkoLogo";
import Layout from "../components/layout";
import { Component } from "react";
import $ from "jquery";
import Nav from "../components/nav";
const layoutStyle = {
  background: "whitesmoke"
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ""
    };
  }
  componentDidMount() {
    $.get("/api/userAuth", data => {
      console.log(data.receivedEmail);
      console.log(data);

      this.setState({ user: JSON.parse(data) });
    });
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
          />
        </Head>
        <Nav />
        <div className="hero container" style={layoutStyle}>
          <TestkoLogo />
          <h1 className="display-1 text-center">WELCOME </h1>
          <h1 className="display-4 text-center">{this.state.user} </h1>
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
export default Home;
