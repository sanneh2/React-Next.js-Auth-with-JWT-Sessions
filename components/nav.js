import React from "react";
import Link from "next/link";
import { Component } from "react";
import $ from "jquery";
import Router from "next/router";

const links = [
  { href: "https://zeit.co/now", label: "ZEIT" },
  { href: "https://github.com/zeit/next.js", label: "GitHub" }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

class Nav extends Component {
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

    $("#logout").click(() => {
      console.log("logout ");
      $.get("/logout", data => {
        if (JSON.parse(data) === "Logged Out") {
          this.setState({ user: "" });
          console.log(data);
          Router.push("/login");
        }
      });
    });
  }
  render() {
    return (
      <nav>
        <ul>
          {/*  <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li> */}
          {/*   {links.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href}>{label}</a>
        </li>
      ))} */}
          <p className="float-right">Welcome, {this.state.user}!</p>
          <button type="submit" id="logout" name="logout">
            Logout
          </button>
        </ul>

        <style jsx>{`
          :global(body) {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
              Helvetica, sans-serif;
          }
          nav {
            text-align: center;
          }
          ul {
            display: flex;
            justify-content: space-between;
          }
          nav > ul {
            padding: 4px 16px;
          }
          li {
            display: flex;
            padding: 6px 8px;
          }
          a {
            color: #067df7;
            text-decoration: none;
            font-size: 13px;
          }
        `}</style>
      </nav>
    );
  }
}

export default Nav;
