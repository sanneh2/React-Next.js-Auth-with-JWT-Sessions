import React, { Component } from "react";
import $ from "jquery";
import {
  Form,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button
} from "reactstrap";
import Router from "next/router";

class RegisterBox extends Component {
  constructor(props) {
    super(props);
    this.state = { page: "loading", registered: false, loading: false };
  }
  componentDidMount() {
    function validateEmail() {
      let emailFieldVal = $("#email").val();
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;

      if (mailformat.test(emailFieldVal)) {
        console.log("good email");
        return true;
      } else {
        console.log("You have entered an invalid email address!");
        noticeEmptyField();
        return false;
      }
    }
    function validatePassword() {
      let passwordInput = $("#password").val();
      var lowerCaseLetters = /[a-z]/g;
      var upperCaseLetters = /[A-Z]/g;
      var numbers = /[0-9]/g;

      if (
        passwordInput.length >= 8 &&
        lowerCaseLetters.test(passwordInput) &&
        upperCaseLetters.test(passwordInput) &&
        numbers.test(passwordInput)
      ) {
        console.log("good pass");
        return true;
      } else {
        console.log("bad pass");
        noticeBadPass();
        return false;
      }
    }

    let emailInput = $("#email");

    emailInput.keyup(function() {
      let valEmail = this.value;

      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
      if (mailformat.test(valEmail)) {
        console.log("good email");
        emailInput.css("border", "3px solid green");
        $(".collapse-email")
          .removeClass("collapse.show")
          .addClass("collapse");

        $(".collapse-empty-email")
          .removeClass("collapse.show")
          .addClass("collapse");
      } else {
        console.log("You have entered an invalid email address!");
        emailInput.css("border", "1px solid grey");
      }
    });

    var letter = $("#letter");
    var capital = $("#capital");
    var number = $("#number");
    var length = $("#length");
    let myInput = $("#password");

    // When the user starts to type something inside the password field
    myInput.keyup(function() {
      // Validate lowercase letters
      let val = this.value;
      var lowerCaseLetters = /[a-z]/g;
      if (lowerCaseLetters.test(val)) {
        letter.removeClass("invalid");
        letter.addClass("valid");
      } else {
        letter.removeClass("valid");
        letter.addClass("invalid");
      }

      // Validate capital letters
      var upperCaseLetters = /[A-Z]/g;
      if (upperCaseLetters.test(val)) {
        console.log(upperCaseLetters.test(val));
        capital.removeClass("invalid");
        capital.addClass("valid");
      } else {
        capital.removeClass("valid");
        capital.addClass("invalid");
      }

      // Validate numbers
      var numbers = /[0-9]/g;
      if (numbers.test(val)) {
        console.log(numbers.test(val));

        number.removeClass("invalid");
        number.addClass("valid");
      } else {
        number.removeClass("valid");
        number.addClass("invalid");
      }

      // Validate length
      if (myInput.val().length >= 8) {
        console.log(myInput.val().length >= 8);

        length.removeClass("invalid");
        length.addClass("valid");
      } else {
        length.removeClass("valid");
        length.addClass("invalid");
      }
      if (
        letter.hasClass("valid") &&
        capital.hasClass("valid") &&
        number.hasClass("valid") &&
        length.hasClass("valid")
      ) {
        myInput.css("border", "3px solid green");

        $(".collapse-check")
          .removeClass("collapse.show")
          .addClass("collapse");

        $(".collapse-bad-pass")
          .removeClass("collapse.show")
          .addClass("collapse");
        console.log("xmas");
      } else {
        myInput.css("border", "1px solid #ced4da");
        console.log("Not xmas");
      }
    });
    myInput.focusin(function() {
      $("#message")
        .addClass("d-block")
        .removeClass("d-none");
    });

    function noticeEmailInUse() {
      $(".collapse-email")
        .addClass("collapse.show")
        .removeClass("collapse");
    }
    function noticeEmptyField() {
      $(".collapse-empty-email")
        .addClass("collapse.show")
        .removeClass("collapse");
    }
    function noticeBadPass() {
      $(".collapse-bad-pass")
        .addClass("collapse.show")
        .removeClass("collapse");
    }

    function noticeNotChecked() {
      $(".collapse-check")
        .addClass("collapse.show")
        .removeClass("collapse");
    }
    function collapseReset() {
      $(".collapse-email")
        .removeClass("collapse.show")
        .addClass("collapse");
      $(".collapse-check")
        .removeClass("collapse.show")
        .addClass("collapse");

      $(".collapse-empty-email")
        .removeClass("collapse.show")
        .addClass("collapse");
      $(".collapse-bad-pass")
        .removeClass("collapse.show")
        .addClass("collapse");
    }

    $("#show_hide_password a").on("click", function(event) {
      event.preventDefault();
      if ($("#show_hide_password input").attr("type") == "text") {
        $("#show_hide_password input").attr("type", "password");
  $("#show_hide_password i").addClass("fa-eye");
        $("#show_hide_password i").removeClass("fa-eye-slash");
      } else if ($("#show_hide_password input").attr("type") == "password") {
        $("#show_hide_password input").attr("type", "text");
        $("#show_hide_password i").removeClass("fa-eye");
        $("#show_hide_password i").addClass("fa-eye-slash");
      }
    });

    $("#submit").click(function() {
      console.log("click ");
      let pass = $("#password").val();
      let email = $("#email").val();
      let checkbox = $("#checkbox").is(":checked");
      collapseReset();
      //validate a bit
      if (email.length === 0) {
        noticeEmptyField();
      }
      let passOK = validatePassword();
      let emailOK = validateEmail();
      console.log(passOK, emailOK, checkbox);

      if (passOK && emailOK && checkbox) {
        console.log("All checked");
        $.post(
          "http://localhost:3000/register",
          { password: pass, email: email, check: checkbox },
          function(data) {
            /*  alert("login succes" + data); */
            if (data !== "EmailInUse") {
              let $this = $("#submit");
              $this.html("<i class='fas fa-spinner fa-pulse'></i> Ustvarjam");
              setTimeout(function() {
                $this.html(" <i class='fas fa-check'></i> Uspešno ustvarjen ");
                setTimeout(function() {
                  console.log("logic works, router doesnt");
                  Router.push("/login");
                }, 1000);
              }, 2000);
            }
            if (data === "EmailInUse") {
              $("#submit").addClass("shake");
              setTimeout(function() {
                $("#submit").removeClass("shake");
              }, 2000);
              noticeEmailInUse(data);
            }
          }
        );
      }
      if (!checkbox) {
        console.log("not checked");
        noticeNotChecked();
      }

      if (!passOK || !emailOK || !checkbox) {
        console.log("error");
        $("#submit").addClass("shake");
        setTimeout(function() {
          $("#submit").removeClass("shake");
        }, 2000);
      }
    });
  }
  render() {
    if (this.state.registered === false) {
      return (
        <div>
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input
              type="email"
              name="Email"
              id="email"
              placeholder=""
              required
            />
            <div className="collapse-email text-danger collapse ">
              Email je že uporabljen.
            </div>
            <div className="collapse-empty-email  text-danger collapse ">
              Prosimo, vnesite vaš email.
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Geslo</Label>
            <InputGroup id="show_hide_password">
              <Input
                type="password"
                name="password"
                id="password"
                placeholder=""
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              />

              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <a>
                    {" "}
                    <i className="fas fa-eye"></i>
                  </a>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <div className="collapse-bad-pass  text-danger collapse ">
              Prosimo, vnesite primerno geslo.
            </div>
            <div id="message" className="d-none">
              <p id="letter" className="invalid">
                Vsaj ena <b>mala</b> črka
              </p>
              <p id="capital" className="invalid">
                Vsaj ena <b>velika</b> črka
              </p>
              <p id="number" className="invalid">
                Vsaj ena <b>številka</b>
              </p>
              <p id="length" className="invalid">
                Vsaj <b>8 znakov</b>
              </p>
            </div>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" id="checkbox" /> Strinjam se s pogoji
              varovanja podatkov v skladu z GDPR
            </Label>
            <div className="collapse-check  text-danger collapse ">
              Prosimo potrdite vaše soglasje.
            </div>
          </FormGroup>
          <button
            type="submit"
            className="btn btn-primary mt-3 btn-lg btn-block "
            id="submit"
          >
            Ustvari Račun
          </button>
          {/* <Button color="warning" id="submit" className="btn-block">
            Pošlji
          </Button> */}
          <style jsx>
            {`
              .invalid {
                color: red;
              }
              #message p {
                padding: 0px;
                margin: 0px;
                font-size: 14px;
              }
              .valid {
                color: green;
              }
              .valid-field {
                border: 3px solid green;
              }
              .valid:before {
                position: relative;
                left: -5px;
                content: "✔";
              }
              .shake {
                animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
                transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
                perspective: 1000px;
              }

              @keyframes shake {
                10%,
                90% {
                  transform: translate3d(-1px, 0, 0);
                }

                20%,
                80% {
                  transform: translate3d(2px, 0, 0);
                }

                30%,
                50%,
                70% {
                  transform: translate3d(-4px, 0, 0);
                }

                40%,
                60% {
                  transform: translate3d(4px, 0, 0);
                }
              }
            `}
          </style>
        </div>
      );
    }
  }
}

export default RegisterBox;
