import { Button } from "reactstrap";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import Link from "next/link";
import { Component } from "react";
import $ from "jquery";
import Router from "next/router";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false
    };
  }

  componentDidMount() {
    if (this.state.logged) {
      Router.push("/");
    }
    $("#submit").click(() => {
      console.log("click ");
      let pass = $("#password").val();
      let email = $("#email").val();
      $.post(
        "http://localhost:3000/login",
        { password: pass, email: email },
        data => {
          if (JSON.parse(data) === "Passwords match") {
            this.setState({ logged: true });

            Router.push("/");
          }
          if (
            JSON.parse(data) === "Passwords Don't Match" ||
            JSON.parse(data) === "User Not Found"
          ) {
            $("#loginMessage")
              .addClass("d-block")
              .removeClass("d-none");
          }
        }
      );
    });
  }

  render() {
    return (
      <div>
        <div className="log-in-window mt-3">
          <InputGroup>
            <InputGroupAddon addonType="prepend"></InputGroupAddon>
            <Input placeholder="email" id="email" />
          </InputGroup>

          <InputGroup className="mt-2">
            <InputGroupAddon addonType="prepend"></InputGroupAddon>
            <Input addon type="password" placeholder="Geslo" id="password" />
          </InputGroup>
          <div id="loginMessage" className="d-none text-danger">
            Email in geslo se ne ujemata.
          </div>

          <Button color="warning" className="mt-2 btn-block" id="submit">
            Prijava
          </Button>

          <Link href="/register">
            <a className=" text-link d-block">
              Še nisi član? Registriraj se sedaj!
            </a>
          </Link>
        </div>
        <style jsx>
          {`
            .log-in-window {
              width: 350px;
              margin: 0 auto;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Login;
