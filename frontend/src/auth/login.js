import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { login } from "../api/loginApi";
import Copyright from "../Copyright";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isValid: true,
      errorMessage: "",
    };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    login(data).then((result) => {
      if (result.message === undefined) {
        localStorage.setItem("access_token", result.access_token);
        this.setState({
          isValid: true,
        });
        if (this.props.location.updateData) {
          this.props.location.updateData(true);
        }
        this.props.history.push("/");
      } else {
        this.setState({
          isValid: false,
          errorMessage: result.message,
        });
        this.props.history.push("/login");
      }
    });
  }

  updateInputValue(event) {
    if (event.target.id === "username") {
      this.setState({
        username: event.target.value,
      });
    } else {
      this.setState({
        password: event.target.value,
      });
    }
  }

  render() {
    const { isValid, errorMessage } = this.state;
    let alert;
    if (isValid) {
      alert = <div></div>;
    } else if (!isValid) {
      alert = (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      );
    }
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {alert}
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={this.updateInputValue}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.updateInputValue}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
            >
              Sign In
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
