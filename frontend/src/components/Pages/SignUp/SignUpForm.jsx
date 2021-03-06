import {useContext, useEffect, useState} from "react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {saveUser} from "./PostUser.js"
import {ThemeContext} from "../../Contexts/ThemeContext";
import Switch from "../../Buttons/SwitchTheme/Switch";
import {useNavigate} from "react-router"
import { storage } from "../../../firebase";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import LinearProgressWithLabel from "../../Assets/LinearProgressWithLabel";
import UploadImage from "../../Buttons/UploadImage";
import AlertPopUp from "../../Assets/AlertPopUp";
import Slide from '@mui/material/Slide';
import BinButton from "../../Buttons/BinButton";

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

    const SignUp = () => {

        const handleAlertClose = () => {
            setAlertProps({ ...alertProps, openAlert: false });
        };

        const [firstName, setFirstName] = useState("")
        const [lastName, setLastName] = useState("")
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [confirmPassword, setConfirmPassword] = useState("")
        const [imageUpload, setImageUpload] = useState(null)
        const [uploadProgress, setUploadProgress] = useState(0)
        const [alertProps, setAlertProps] = useState({
            openAlert: false,
            handleAlertClose,
            Transition: Slide,
            message: "Email already exits",
            duration: 2000,
            vertical: 'top',
            horizontal: 'left'
        });

        const [hasErrors, setHasErrors] = useState({
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false})

        const navigate = useNavigate();

        const validate = () => {
            let temp = {}

            temp.firstName = (firstName === "");
            temp.lastName = lastName === "";
            temp.email = !(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(email);
            temp.password = password === "";
            temp.confirmPassword = password !== confirmPassword

            setHasErrors(temp)
            return temp
        }

        useEffect(() => {

            if (firstName !== "") {
                validate()
            }
        }, [lastName, email, password, confirmPassword])

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
                allowExtraEmails : !!data.get("allowExtraEmails")
            })

            saveUser(user)
                .then(userToken => {
                    if (userToken.userValidated) {
                        if (imageUpload) {
                            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`)

                            const uploadTask = uploadBytesResumable(imageRef, imageUpload);
                                uploadTask.on("state_changed", (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    setUploadProgress(prevState => progress)
                                },
                                    (error) => {

                                    },
                                    async () => {

                                        await getDownloadURL(uploadTask.snapshot.ref)
                                            .then(async (url) => {

                                                navigate("../signIn-form", { replace: true })
                                                const payload = JSON.stringify({
                                                    avatarImageURL : url
                                                })

                                                const updateUser = await fetch(`http://localhost:8080/api/players/update/${userToken.id.toString()}`, {
                                                    method: "PATCH",
                                                    headers: { 'Content-Type': 'application/json'
                                                    },
                                                    body: payload
                                                })
                                        })
                                    })
                        } else {
                            navigate("../signIn-form", { replace: true })
                        }
                    } else {
                        setAlertProps({ ...alertProps, openAlert: true });
                    }
            })
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
                <div>
                    <Switch/>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                        sx={{
                            marginTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required={true}
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        onChange={(event) => {
                                            setFirstName(event.target.value)
                                            let temp = hasErrors
                                            temp.firstName = (event.target.value === "")
                                            setHasErrors(temp)
                                        }}
                                        error={hasErrors.firstName}
                                        helperText={hasErrors.firstName ? "Field is required" : ""}
                                        color = "warning"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        onChange={(event) => {
                                            setLastName(event.target.value)
                                            let temp = {...hasErrors}
                                            temp.lastName = (event.target.value === "")
                                            setHasErrors(temp)
                                        }}
                                        error={hasErrors.lastName}
                                        helperText={hasErrors.lastName ? "Field is required" : ""}
                                        color = "warning"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={(event) => {
                                            setEmail(event.target.value)
                                            let temp = hasErrors
                                            temp.email = event.target.value === "" || !email.includes("@");
                                            setHasErrors(temp)
                                        }}
                                        error={hasErrors.email}
                                        helperText={ hasErrors.email ? "Please enter valid email" : ""}
                                        color = "warning"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        onChange={(event) => {
                                            setPassword(event.target.value)
                                            let temp = hasErrors
                                            temp.password = (event.target.value === "")
                                            setHasErrors(temp)
                                        }}
                                        error={hasErrors.password}
                                        helperText={hasErrors.password ? "Field is required" : ""}
                                        color = "warning"
                                    />
                                </Grid>
                                    <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        autoComplete="new-password"
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value)
                                            let temp = hasErrors
                                            temp.confirmPassword = (confirmPassword !== password)
                                            setHasErrors(temp)
                                        }}
                                        error={confirmPassword !== password}
                                        helperText={confirmPassword !== password ? "Passwords are not the same" : ""}
                                        color = "warning"
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ display: "inline-flex", justifyContent: "center" }}>
                                    <UploadImage onChange={(event) =>
                                        setImageUpload(event.currentTarget.files[0])}/>
                                </Grid>
                                <Grid item xs={12} style={{ display: "inline-grid", justifyContent: "center" }}>
                                    <Typography
                                        component="h6"
                                        variant="h7"
                                    >
                                        {imageUpload ? "Image: " + imageUpload.name : "No image uploaded"}
                                        <BinButton display={imageUpload} onClick={() => setImageUpload(null)}/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <LinearProgressWithLabel progress_value={uploadProgress}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value={true} color="warning" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 1 }}
                                color="warning"
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Link href="/signIn-form" variant="body2" color="#ED6C02">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 3 }} />
                </Container>
                </div>
            </ThemeProvider>
        );
    }

export default SignUp;

