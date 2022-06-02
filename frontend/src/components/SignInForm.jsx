import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "./Contexts/ThemeContext";
import Switch from "./Switch";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/about">
                Spoint
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function SignInSide() {

    const [hasErrors, setHasErrors] = useState({
                                        email: false,
                                        password: false})
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const validate = () => {
        let temp = {}

        temp.email = !(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(email);
        temp.password = password === "";
        setHasErrors(temp)

        return temp
    }

    useEffect(() => {

        if (email !== "") {
            validate()
        }
    }, [email, password])

    const handleSubmit = (event) => {
        event.preventDefault();

        let temp = validate()
        for (const [key, value] of Object.entries(temp)) {
            console.log(key + " " + value)
            if (value) {
                console.log("FORM INCOMPLETE")
                return
            }
        }

        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
            rememberMe: !!data.get('rememberMe'),
        });
    };

    const { theme, setTheme } = useContext(ThemeContext)

    const muiTheme = createTheme({
        palette: {
            mode: theme,
        },
    });

    return (
        <ThemeProvider theme={muiTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Switch/>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                color="warning"
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                    let temp = hasErrors
                                    temp.email = (event.target.value === "")
                                    setHasErrors(temp)
                                }}
                                error={hasErrors.email}
                                helperText={hasErrors.email ? "Field is required" : ""}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                color="warning"
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                    let temp = hasErrors
                                    temp.password = (event.target.value === "")
                                    setHasErrors(temp)
                                }}
                                error={hasErrors.password}
                                helperText={hasErrors.password ? "Field is required" : ""}
                            />
                            <FormControlLabel
                                control={<Checkbox value={true} color="warning" />}
                                label="Remember me" name="rememberMe"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                color="warning"
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/frontend/public" variant="body2" color="#ED6C02">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/signUp-form" variant="body2" color="#ED6C02">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
