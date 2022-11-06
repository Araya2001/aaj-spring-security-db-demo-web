import * as React from "react";
import {useEffect, useState} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@emotion/react";
import {
    Alert,
    Button,
    createTheme,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {container} from "../../../styles/Home.module.css";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";


const server = process.env.DOCKER === "true" ? "http://postgres_db_security_demo:8080" : "http://localhost:8080";

const safeTheme = createTheme({
    palette: {
        mode: "dark", primary: {
            main: "#864879"
        }, secondary: {
            main: "#3F3351"
        }, error: {
            main: "#850E35"
        }, warning: {
            main: "#FF8DC7"
        }, info: {
            main: "#532973"
        }, success: {
            main: "#DFF6FF"
        }, text: {
            primary: "#E9A6A6", secondary: "#FFF5E4", disabled: "#EE6983"
        }, background: {
            paper: "#1F1D36", default: "#1F1D36"
        }, action: {
            disabled: "#e6e6e6"
        },
    }, typography: {
        fontFamily: "Atkinson Hyperlegible"
    }
});

const unsafeTheme = createTheme({
    palette: {
        mode: "dark", primary: {
            main: "#EC7272"
        }, secondary: {
            main: "#F7A76C"
        }, error: {
            main: "#EEEEEE"
        }, warning: {
            main: "#B2B2B2"
        }, info: {
            main: "#00ABB3"
        }, success: {
            main: "#DFF6FF"
        }, text: {
            primary: "#FFFDE3", secondary: "#FFFDE3", disabled: "#5d5d5d"
        }, background: {
            paper: "#C21010", default: "#C21010"
        }, action: {
            disabled: "#e6e6e6"
        },
    }, typography: {
        fontFamily: "Atkinson Hyperlegible"
    }
});

function AppContainer() {

    const [unsafe, setUnsafe] = useState(false);
    const [data, setData] = useState(null);
    const [notification, setNotification] = useState(false);

    const theme = unsafe === false ? safeTheme : unsafeTheme;
    const input = React.createRef();

    useEffect(() => {
        if (data === null) {
            getAllData().then();
        }
    });

    const RenderErrorNotification = () => (
        <Snackbar
            open={notification}
            autoHideDuration={9000}
            onClose={() => {
                setNotification(false)
            }}
        >
            <Alert severity="error" sx={{width: '100%'}}>
                Error al obtener información. Contactar el administrador del sistema
            </Alert>
        </Snackbar>);


    const getAllData = async () => {
        let requestOptions = {
            method: 'GET', redirect: 'follow'
        };

        fetch(server + "/security-db-demo/api/v1/safe-entity/product", requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    setNotification(true);
                }
                return response.json()
            })
            .then(result => setData(result))
            .catch(error => setNotification(true));
    }

    const getDataByWarehouse = async (id) => {
        let requestOptions = {
            method: 'GET', redirect: 'follow'
        };

        fetch(server + "/security-db-demo/api/v1/safe-entity/product/by-warehouse?id=" + id, requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    setNotification(true);
                }
                return response.json()
            })
            .then(result => setData(result))
            .catch(error => setNotification(true));
    }

    const getDataByWarehouseUnsafe = async (id) => {
        let requestOptions = {
            method: 'GET', redirect: 'follow'
        };

        fetch(server + "/security-db-demo/api/v1/unsafe-entity/product/by-warehouse?id=" + id, requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    setNotification(true);
                }
                return response.json()
            })
            .then(result => setData(result))
            .catch(error => {

                console.log("Error")
            });
    }

    let DrawProducts = () => (<div></div>);
    if (data !== null) {
        if (data.product !== undefined) {
            DrawProducts = () => (<>
                <List dense={true}>
                    {data.product.map((element, index) => (<ListItem key={index}>
                        <ListItemText
                            primary={element.name}
                            secondary={element.description + " - W: " + element.warehouse.id + " - WR: " + element.warehouse.region}
                        />
                    </ListItem>))}
                </List>
            </>);
        }

    }


    const ThemeSetter = ({children}) => (<ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>);

    const SetBox = ({children}) => (<Box sx={{p: 2}}>
        {children}
    </Box>);

    const SetBox2 = ({children}) => (<Box sx={{pt: 2}}>
        {children}
    </Box>);
    const DrawBox2 = ({children}) => (<Box sx={{pt: 2, pb: 2, px: 2}}>
        {children}
    </Box>);

    const InputBox = ({disabled, inputRef, value, label}) => (
        <TextField inputRef={inputRef} disabled={disabled} size={"small"} fullWidth
                   id="outlined-basic"
                   label={label}
                   defaultValue={value}
                   variant="outlined"
        />);


    return (<ThemeSetter>
        <>
            <CssBaseline/>
            <Container className={container} maxWidth={"xl"}>
                <RenderErrorNotification/>
                <Grid container alignItems={"center"} justifyContent={"right"}>
                    <Grid item>
                        <Typography style={{whiteSpace: "pre-line"}}
                                    align={"right"} variant={"h1"}
                                    sx={{
                                        mr: 0,
                                        fontWeight: 300,
                                        letterSpacing: ".0rem",
                                        color: "secondary",
                                        textDecoration: "none",
                                        fontSize: "14px"
                                    }}>
                            {"MODO INSEGURO"}
                        </Typography>

                    </Grid>
                    <Grid item>
                        <Switch checked={unsafe} onAnimationEnd={event => {
                            setUnsafe(!unsafe)
                        }}/>
                    </Grid>

                </Grid>
                <Grid container alignItems={"center"} justifyContent={"center"}>
                    <Grid item xs={12}>
                        <DrawBox2> <Typography style={{whiteSpace: "pre-line"}}
                                               align={"center"} variant={"h1"}
                                               sx={{
                                                   mr: 0,
                                                   fontWeight: 700,
                                                   letterSpacing: ".0rem",
                                                   color: "primary",
                                                   textDecoration: "none",
                                                   fontSize: "32px"
                                               }}>
                            {unsafe === false ? "Buscar producto por almacén" : "Inseguro - Buscar producto por almacén"}
                        </Typography>
                        </DrawBox2>
                    </Grid>
                    <Grid item xs={10}>
                        <DrawBox2>
                            <Paper elevation={5}>
                                <DrawBox2>
                                    <Grid container alignItems={"center"} justifyContent={"center"} columnGap={2}>

                                        <Grid item xs={10}>
                                            <SetBox2>
                                                <InputBox label={"ID - Warehouse"} inputRef={input}></InputBox>
                                            </SetBox2>
                                        </Grid>
                                        <Grid item>
                                            <SetBox2>
                                                <Button variant="contained" color={"success"}
                                                        style={{justifyContent: "center", alignContent: "center"}}
                                                        onClick={() => {
                                                            let inputValue = input.current.value;
                                                            if (inputValue === "") {
                                                                getAllData().then();
                                                            } else {
                                                                if (unsafe !== true) {
                                                                    getDataByWarehouse(inputValue).then()
                                                                } else {
                                                                    getDataByWarehouseUnsafe(inputValue).then()
                                                                }
                                                            }

                                                        }}>buscar</Button>
                                            </SetBox2>

                                        </Grid>
                                        <Grid item xs={11}>
                                            <DrawProducts></DrawProducts>
                                        </Grid>
                                    </Grid>


                                </DrawBox2>
                            </Paper>
                        </DrawBox2>
                    </Grid>

                </Grid>
            </Container>
        </>
    </ThemeSetter>);
}

export default AppContainer;