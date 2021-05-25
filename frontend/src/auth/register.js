import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { register } from "../api/register_api";
import Copyright from "../Copyright";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      is_valid: true,
      error_message: "",
    };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
    };
    register(data)
      .then((res) => res.json())
      .then((result) => {
        const resultLength = Object.keys(result).length;
        if (resultLength !== 3) {
          this.setState({
            is_valid: false,
            error_message: result.email || result.username || result.password,
          });
          this.props.history.push("/register");
        } else {
          this.setState({
            is_valid: true,
          });
          this.props.history.push("/login");
        }
      });
  }

  updateInputValue(event) {
    if (event.target.id === "email") {
      this.setState({
        email: event.target.value,
      });
    } else if (event.target.id === "username") {
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
    const { is_valid, error_message } = this.state;
    let alert;
    if (is_valid) {
      alert = <div></div>;
    } else if (!is_valid) {
      alert = (
        <div className="alert alert-danger" role="alert">
          {error_message}
        </div>
      );
    }
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {alert}
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={this.updateInputValue}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={this.updateInputValue}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.updateInputValue}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
