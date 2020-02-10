import { Component } from "react";

class TestkoLogo extends Component {
  constructor(props) {
    super(props);
    this.state = { page: "loading" };
  }
  componentDidMount() {
    let getCurrentPage = window.location.href.split("/");
    if (getCurrentPage[3] === "") {
      this.setState({
        page: "login"
      });
    } else if (getCurrentPage[3] === "register") {
      this.setState({
        page: "register"
      });
    } else {
      this.setState({
        page: "login"
      });
    }
  }

  getLogoStyle = () => {
    if (this.state.page === "loading") {
      return {
        opacity: 0
      };
    }
    if (this.state.page === "login") {
      return {
        width: 430
      };
    }

    if (this.state.page === "register") {
      return {
        width: 170,
        transition: "2s",
        opacity: 1,
        display: "block",
        margin: "0 auto"
      };
    }
  };

  render() {
    return (
      <div>
        <img
          src="/testko.png"
          alt="testko logo"
          className="testko-logo"
          style={this.getLogoStyle()}
        />

        <style jsx>{`
          .testko-logo {
            transition: 2s;
          }
        `}</style>
      </div>
    );
  }
}

export default TestkoLogo;
