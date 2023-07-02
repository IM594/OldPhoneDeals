import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';

import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Sheet, Chip, LinearProgress } from '@mui/joy';

import Done from '@mui/icons-material/Done';
import logo from '../pics/logo.png';
import { IconButton } from '@mui/joy';

export default function Retrieve(props) {
    let pages = [Page1(props), Page3(props), Page2(props)];
    let counter = props.stat;
    let [pageIndex, setPageIndex] = React.useState(0);
    let [email, setEmail] = React.useState(' ');
    return (
        pages[pageIndex]
    );

    function Page1(props) {
        let counter = props.stat;
        return (<>
            <Sheet>
                <Box sx={{ display: 'flex', my: 2.1, px: 3, mx: 20 }}>
                    <IconButton sx={{ px: 2, mx: 3 }} color='neutral' onClick={counter.exitForget}><ArrowBackIcon /></IconButton>

                    <Chip color='neutral' sx={{ my: 1 }}> <Typography textColor='#ffffff'> 1. </Typography> </Chip>

                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>
                        <LinearProgress sx={{
                            "--LinearProgress-thickness": "3px",
                            "--LinearProgress-progressRadius": "50px",
                            "--LinearProgress-progressThickness": "3px"
                        }} color='none' determinate value={100}></LinearProgress></Box>

                    <Chip variant="outlined" color='neutral' sx={{ my: 1 }}> <Typography> 2</Typography>  </Chip>

                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>
                        <LinearProgress sx={{
                            "--LinearProgress-thickness": "3px",
                            "--LinearProgress-progressRadius": "50px",
                            "--LinearProgress-progressThickness": "3px"
                        }} color='none' determinate value={100}></LinearProgress></Box>
                    <Chip variant="outlined" color='neutral' sx={{ my: 1 }}> <Typography > 3</Typography>  </Chip>
                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>


                    </Box>
                </Box>
            </Sheet>
            <CssVarsProvider
                disableTransitionOnChange
            >
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        ':root': {
                            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
                            '--Cover-width': '40vw', // must be `vw` only
                            '--Form-maxWidth': '700px',
                            '--Transition-duration': '0.4s', // set to `none` to disable transition
                        },
                    }}
                />
                <Box
                    sx={(theme) => ({
                        width:
                            'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        py: 0,
                        px: 20,
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255 255 255 / 0.6)',
                        [theme.getColorSchemeSelector('dark')]: {
                            backgroundColor: 'rgba(19 19 24 / 0.4)',
                        },
                    })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100dvh',
                            width:
                                'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
                            maxWidth: '100%',
                            px: 0,
                        }}
                    >
                        <Box
                            component="header"
                            sx={{
                                py: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                        </Box>
                        <Box
                            component="main"
                            sx={{
                                my: 'auto',
                                py: 2,
                                pb: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: 400,
                                maxWidth: '100%',
                                mx: 'auto',
                                borderRadius: 'sm',
                                '& form': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                },
                                [`& .${formLabelClasses.asterisk}`]: {
                                    visibility: 'hidden',
                                },
                            }}
                        >
                            <div>

                                <Typography component="h2" fontSize="xl2" fontWeight="lg">
                                    Verify your Email
                                </Typography>
                            </div>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    const formElements = event.currentTarget.elements;
                                    const data = {
                                        email: formElements.email.value,
                                    };

                                    var myHeaders = new Headers();

                                    myHeaders.append("Content-Type", "application/json");

                                    var raw = JSON.stringify(data);

                                    var requestOptions = {
                                        method: 'POST',
                                        headers: myHeaders,
                                        body: raw,
                                        redirect: 'follow'
                                    };

                                    fetch("http://localhost:5001/api/users/forgotpassword", requestOptions)
                                        .then(response => response.text())
                                        .then(result => {

                                            if (JSON.parse(result).message == 'User not found')
                                                alert(JSON.parse(result).message);
                                            else {
                                                alert(JSON.parse(result).message);
                                                setPageIndex(1);
                                                setEmail(formElements.email.value);
                                            }
                                        })
                                        .catch(error => alert(error));

                                }}
                            >
                                <FormControl required>
                                    <FormLabel>Email</FormLabel>
                                    <Input placeholder="Enter your email" type="email" name="email" />
                                </FormControl>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >

                                </Box>
                                <Button type="submit" color='neutral' fullWidth>
                                    Send
                                </Button>
                            </form>
                        </Box>
                        <Box component="footer" sx={{ py: 3 }}>
                            <Typography level="body3" textAlign="center">
                                Copyright © 2023 Group 07. All Rights Reserved
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box

                    align='center'
                    sx={(theme) => ({
                        height: '100%',

                        position: 'fixed',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        paddingTop: 40,
                        left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
                        transition:
                            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                        backgroundColor: 'background.level1',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                    })}
                ><img src={logo} width="300" height="50" alt="OldPhoneDealslogo" /></Box>
            </CssVarsProvider>
        </>);

    }

    function Page2(props) {

        let counter = props.stat;
        return (<>
            <Sheet>
                <Box sx={{ display: 'flex', my: 2.1, px: 3, mx: 20 }}>
                    <IconButton sx={{ px: 2, mx: 3 }} color='neutral' onClick={() => { setPageIndex(1) }}><ArrowBackIcon /></IconButton>

                    <Chip variant="outlined" color='neutral' sx={{ my: 1 }}> <Typography> 1. </Typography> </Chip>

                    <Box variant="outlined" sx={{ minWidth: 120, px: 1, my: 3 }}>
                        <LinearProgress sx={{
                            "--LinearProgress-thickness": "3px",
                            "--LinearProgress-progressRadius": "50px",
                            "--LinearProgress-progressThickness": "3px"
                        }} color='none' determinate value={100}></LinearProgress></Box>

                    <Chip color='neutral' sx={{ my: 1 }} > <Typography textColor='#ffffff' > 2</Typography>  </Chip>

                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>
                        <LinearProgress sx={{
                            "--LinearProgress-thickness": "3px",
                            "--LinearProgress-progressRadius": "50px",
                            "--LinearProgress-progressThickness": "3px"
                        }} color='none' determinate value={100}></LinearProgress></Box>
                    <Chip color='neutral' variant="outlined" sx={{ my: 1 }}> <Typography  > 3</Typography>  </Chip>
                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>


                    </Box>
                </Box>
            </Sheet>
            <CssVarsProvider
                disableTransitionOnChange
            >
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        ':root': {
                            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
                            '--Cover-width': '40vw', // must be `vw` only
                            '--Form-maxWidth': '700px',
                            '--Transition-duration': '0.4s', // set to `none` to disable transition
                        },
                    }}
                />
                <Box
                    sx={(theme) => ({
                        width:
                            'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        py: 0,
                        px: 20,
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255 255 255 / 0.6)',
                        [theme.getColorSchemeSelector('dark')]: {
                            backgroundColor: 'rgba(19 19 24 / 0.4)',
                        },
                    })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100dvh',
                            width:
                                'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
                            maxWidth: '100%',
                            px: 0,
                        }}
                    >
                        <Box
                            component="header"
                            sx={{
                                py: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                        </Box>
                        <Box
                            component="main"
                            sx={{
                                my: 'auto',
                                py: 2,
                                pb: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: 400,
                                maxWidth: '100%',
                                mx: 'auto',
                                borderRadius: 'sm',
                                '& form': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                },
                                [`& .${formLabelClasses.asterisk}`]: {
                                    visibility: 'hidden',
                                },
                            }}
                        >
                            <div>

                                <Typography component="h2" fontSize="xl2" fontWeight="lg">
                                    Done!
                                </Typography>
                            </div>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();

                                    counter.exitForget();

                                }}
                            >

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >

                                </Box>
                                <Button type="submit" color='neutral' fullWidth>
                                    <Done></Done>
                                </Button>
                            </form>
                        </Box>
                        <Box component="footer" sx={{ py: 3 }}>
                            <Typography level="body3" textAlign="center">
                                Copyright © 2023 Group 07. All Rights Reserved
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box

                    align='center'
                    sx={(theme) => ({
                        height: '100%',

                        position: 'fixed',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        paddingTop: 40,
                        left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
                        transition:
                            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                        backgroundColor: 'background.level1',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                    })}
                ><img src={logo} width="300" height="50" alt="OldPhoneDealslogo" /></Box>
            </CssVarsProvider>
        </>);



    }


    function Page3(props) {

        let counter = props.stat;
        return (<>
            <Sheet>
                <Box sx={{ display: 'flex', my: 2.1, px: 3, mx: 20 }}>
                    <IconButton sx={{ px: 2, mx: 3 }} color='neutral' onClick={() => { setPageIndex(0) }}><ArrowBackIcon /></IconButton>

                    <Chip variant="outlined" color='neutral' sx={{ my: 1 }}> <Typography> 1. </Typography> </Chip>

                    <Box variant="outlined" sx={{ minWidth: 120, px: 1, my: 3 }}>
                        <LinearProgress sx={{
                            "--LinearProgress-thickness": "3px",
                            "--LinearProgress-progressRadius": "50px",
                            "--LinearProgress-progressThickness": "3px"
                        }} color='none' determinate value={100}></LinearProgress></Box>

                    <Chip color='neutral' sx={{ my: 1 }}> <Typography textColor='#ffffff'> 2</Typography>  </Chip>

                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>
                        <LinearProgress sx={{
                            "--LinearProgress-thickness": "3px",
                            "--LinearProgress-progressRadius": "50px",
                            "--LinearProgress-progressThickness": "3px"
                        }} color='none' determinate value={100}></LinearProgress></Box>
                    <Chip variant="outlined" color='neutral' sx={{ my: 1 }}  > <Typography > 3</Typography>  </Chip>
                    <Box sx={{ minWidth: 120, px: 1, my: 3 }}>


                    </Box>
                </Box>
            </Sheet>
            <CssVarsProvider
                disableTransitionOnChange
            >
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        ':root': {
                            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
                            '--Cover-width': '40vw', // must be `vw` only
                            '--Form-maxWidth': '700px',
                            '--Transition-duration': '0.4s', // set to `none` to disable transition
                        },
                    }}
                />
                <Box
                    sx={(theme) => ({
                        width:
                            'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        py: 0,
                        px: 20,
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255 255 255 / 0.6)',
                        [theme.getColorSchemeSelector('dark')]: {
                            backgroundColor: 'rgba(19 19 24 / 0.4)',
                        },
                    })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100dvh',
                            width:
                                'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
                            maxWidth: '100%',
                            px: 0,
                        }}
                    >
                        <Box
                            component="header"
                            sx={{
                                py: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                        </Box>
                        <Box
                            component="main"
                            sx={{
                                my: 'auto',
                                py: 2,
                                pb: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: 400,
                                maxWidth: '100%',
                                mx: 'auto',
                                borderRadius: 'sm',
                                '& form': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                },
                                [`& .${formLabelClasses.asterisk}`]: {
                                    visibility: 'hidden',
                                },
                            }}
                        >
                            <div>

                                <Typography component="h2" fontSize="xl2" fontWeight="lg">
                                    Reset your password
                                </Typography>
                            </div>
                            <form
                                async onSubmit={(event) => {
                                    event.preventDefault();
                                    const formElements = event.currentTarget.elements;
                                    if (formElements.password.value == formElements.password2.value) {

                                        var myHeaders = new Headers();
                                        myHeaders.append("Content-Type", "application/json");
                                        var raw = JSON.stringify({
                                            "email": email,
                                            "newPassword": formElements.password.value,
                                            "confirmPassword": formElements.password2.value
                                        });
                                        console.log(raw);

                                        var requestOptions = {
                                            method: 'PUT',
                                            headers: myHeaders,
                                            body: raw,
                                            redirect: 'follow'
                                        };

                                        fetch("http://localhost:5001/api/users/resetpassword", requestOptions)
                                            .then(response => {
                                                if (response.status == 200) {
                                                    setPageIndex(2);
                                                } else if (response.status == 400) {
                                                    alert('Please click the link in the email to reset your password');
                                                } else if (response.status == 401) {
                                                    alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.');
                                                } else {
                                                    alert('Something went wrong')
                                                }
                                            }
                                            )

                                            .catch(error => alert(error));
                                    }
                                    else { alert("Password should be same") }

                                }}
                            >
                                <FormControl required>
                                    <FormLabel>Password</FormLabel>
                                    <Input placeholder="Enter your password" type="password" name="password" />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Again</FormLabel>
                                    <Input placeholder="Enter your password again" type="password" name="password2" />

                                </FormControl>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >

                                </Box>
                                <Button type="submit" color='neutral' fullWidth>
                                    Send
                                </Button>
                            </form>
                        </Box>
                        <Box component="footer" sx={{ py: 3 }}>
                            <Typography level="body3" textAlign="center">
                                Copyright © 2023 Group 07. All Rights Reserved
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box

                    align='center'
                    sx={(theme) => ({
                        height: '100%',

                        position: 'fixed',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        paddingTop: 40,
                        left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
                        transition:
                            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                        backgroundColor: 'background.level1',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                    })}
                ><img src={logo} width="300" height="50" alt="OldPhoneDealslogo" /></Box>
            </CssVarsProvider>
        </>);


    }
}