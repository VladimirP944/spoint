import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
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
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {ThemeContext} from "../../Contexts/ThemeContext";
import Switch from "../../Buttons/SwitchTheme/Switch";
import {getCookie, getCookieObject, setCookie} from "../../Contexts/Cookies";
import {useNavigate} from "react-router"
import AlertPopUp from "../../Assets/AlertPopUp";
import Slide from "@mui/material/Slide";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/src/components/Pages/About">
                Spoint
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function SignInSide() {

    const handleAlertClose = () => {
        setAlertProps({ ...alertProps, openAlert: false });
    };

    const [hasErrors, setHasErrors] = useState({
                                        email: false,
                                        password: false})
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alertProps, setAlertProps] = useState({
        openAlert: false,
        handleAlertClose,
        Transition: Slide,
        message: "Email or password incorrect",
        duration: 2000,
        vertical: 'bottom',
        horizontal: 'right'
    });

    const navigate = useNavigate()

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

    function handleSubmit(event) {
        event.preventDefault();

        let temp = validate()
        for (const [key, value] of Object.entries(temp)) {
            if (value) {
                console.log("FORM INCOMPLETE")
                return
            }
        }

        const data = new FormData(event.currentTarget);

        const user = JSON.stringify({
            firstName : data.get("firstName"),
            lastName : data.get("lastName"),
            email : data.get("email"),
            password : data.get("password"),
        })

        checkLogin(user).then(token => {

            if (token) {

                token["rememberMe"] = data.get("rememberMe")
                setCookie("loginToken", JSON.stringify(token))
                navigate("../gameplay", {replace: true})

            } else {
                setAlertProps({ ...alertProps, openAlert: true });
            }
        })
    }

    const checkLogin = async (user) => {
        const req = await fetch("http://localhost:8080/api/players/check-if-player-exists", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: user
        })

        return await req.json()
    }

    const { theme, setTheme } = useContext(ThemeContext)

    const muiTheme = createTheme({
        palette: {
            mode: theme,
        },
    });

    return (
        <ThemeProvider theme={muiTheme}>
            <AlertPopUp props={alertProps}/>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random/?nature)',
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
                                    <Link href="/src/components/Pages" variant="body2" color="#ED6C02">
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
