import React, { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { Box } from "@mui/system";
import { AppBar } from "components/DashboardComponents/AppBar";
import { SideBar } from "components/DashboardComponents/SideBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./DashboardLayout.css";
import { GlobalStyles, Grid, Paper, Typography, IconButton, Slide } from "@mui/material";
import { LamassuNotifications } from "components/DashboardComponents/LamassuNotifications";
import CloseIcon from "@mui/icons-material/Close";
import { Home } from "./Home";
import { createDarkTheme, createLightTheme } from "theme";
import { Notification } from "ducks/features/notifications/models";
import { CAView } from "./CertificateAuthoritiesView";
import { DeviceView } from "./DeviceView";
import { DMSView } from "./DeviceManufacturingSystemView";
import { useAppSelector } from "ducks/hooks";
import * as notificationsSelector from "ducks/features/notifications/reducer";
import { InfoView } from "./Info";
import SelectAllOutlinedIcon from "@mui/icons-material/SelectAllOutlined";
import { AlertsView } from "./AlertsView";
import { useAuth } from "react-oidc-context";
import { LoggedOutView } from "./LoggedOutView";
import { CertificateListView } from "./CertificatesView/CertificatesList";
import { AppFolderRegular, ArrowSyncCheckmarkRegular, BoxArrowUpRegular, BugRegular, BuildingBankRegular, CertificateRegular, ChannelAlertRegular, CheckRegular, CommunicationShieldRegular, ContactCardGroupRegular, DeveloperBoardRegular, KeyRegular, PipelineRegular, ShieldTaskRegular } from "@fluentui/react-icons";
export const DashboardLayout = () => {
    const auth = useAuth();
    const cookies = new Cookies();
    if (cookies.get("paletteMode") === undefined) {
        cookies.set("paletteMode", "light", { path: "/" });
    }

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            auth.signinRedirect();
        }
    }, [auth.isAuthenticated, auth.isLoading]);

    const notificationsList: Array<Notification> = useAppSelector((state) => notificationsSelector.getNotificationList(state));

    const containerRef = useRef(null);

    const [darkTheme, setDarkTheme] = useState(cookies.get("paletteMode") === "dark");
    const [collapsed, setCollapsed] = useState(false);
    const [displayNotifications, setDisplayNotifications] = useState(false);

    const theme = darkTheme ? createDarkTheme() : createLightTheme();

    useEffect(() => {
        cookies.set("paletteMode", darkTheme === true ? "dark" : "light", { path: "/" });
    }, [darkTheme]);

    if (!auth.isAuthenticated) {
        return <></>;
    }

    const routes = [
        {
            menuTitle: "",
            menuItems: [
                {
                    title: "Home",
                    path: "/",
                    link: "/",
                    icon: <AppFolderRegular key="/" />,
                    content: <Home />
                }
            ]
        },
        {
            menuTitle: "PKI",
            menuItems: [
                {
                    title: "KMS",
                    path: "/kms/*",
                    link: "/kms",
                    icon: <KeyRegular key="/1b" />,
                    content: <CAView />
                },
                {
                    title: "CAs",
                    path: "/cas/*",
                    link: "/cas",
                    icon: <BuildingBankRegular key="/1b" />,
                    content: <CAView />
                },
                {
                    title: "Certificates",
                    path: "/certificates/*",
                    link: "/certificates",
                    icon: <CertificateRegular key="/1c" />,
                    content: <CertificateListView />
                },
                {
                    title: "Registration Authorities",
                    path: "/ras/*",
                    link: "/ras",
                    icon: <CommunicationShieldRegular key="/1c" />,
                    content: <CertificateListView />
                },
                {
                    title: "Validation Authority",
                    path: "/vas/*",
                    link: "/vas",
                    icon: <CheckRegular key="/1c" />,
                    content: <CertificateListView />
                }
            ]
        },
        {
            menuTitle: "Updates",
            menuItems: [
                {
                    title: "Artifacts",
                    path: "/cas/*",
                    link: "/cas",
                    icon: <BoxArrowUpRegular key="/1b" />,
                    content: <CAView />
                },
                {
                    title: "Update Manager",
                    path: "/cas/*",
                    link: "/cas",
                    icon: <ArrowSyncCheckmarkRegular key="/1b" />,
                    content: <CAView />
                },
                {
                    title: "Vulnerabilities",
                    path: "/certificates/*",
                    link: "/certificates",
                    icon: <BugRegular key="/1c" />,
                    content: <CertificateListView />
                }

            ]
        },
        {
            menuTitle: "Device Management",
            menuItems: [
                {
                    title: "Device Automation",
                    path: "/dms/*",
                    link: "/dms",
                    icon: <PipelineRegular key="/2" />,
                    content: <DMSView />

                },
                {
                    title: "Device Groups",
                    path: "/devmanager/*",
                    link: "/devmanager",
                    icon: <ContactCardGroupRegular key="/3" />,
                    content: <DeviceView />
                },
                {
                    title: "Devices",
                    path: "/devmanager/*",
                    link: "/devmanager",
                    icon: <DeveloperBoardRegular key="/3" />,
                    content: <DeviceView />
                }
            ]
        },
        {
            menuTitle: "Events",
            menuItems: [
                {
                    title: "Alerts",
                    path: "/alerts/*",
                    link: "/alerts",
                    icon: <ChannelAlertRegular />,
                    content: <AlertsView />

                }
            ]
        },
        {
            menuTitle: "Security",
            menuItems: [
                {
                    title: "Permissions",
                    path: "/alerts/*",
                    link: "/alerts",
                    icon: <ShieldTaskRegular />,
                    content: <AlertsView />

                }
            ]
        }
    ];

    const simulationToolsItems = [];
    if (window._env_.LAMASSU_VDMS !== "") {
        simulationToolsItems.push(
            {
                title: "Virtual Device",
                path: window._env_.LAMASSU_VDEVICE,
                link: window._env_.LAMASSU_VDEVICE,
                icon: <SelectAllOutlinedIcon />,
                content: <DeviceView />
            }
        );
    }
    if (window._env_.LAMASSU_VDMS !== "") {
        simulationToolsItems.push(
            {
                title: "Virtual DMS",
                path: window._env_.LAMASSU_VDMS,
                link: window._env_.LAMASSU_VDMS,
                icon: <SelectAllOutlinedIcon />,
                content: <DMSView />
            }
        );
    }

    if (simulationToolsItems.length > 0) {
        routes.push({
            menuTitle: "Simulation Tools",
            menuItems: simulationToolsItems
        });
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles
                styles={{
                    "*::-webkit-scrollbar": {
                        width: "8px",
                        height: "8px"
                    },
                    "*::-webkit-scrollbar-track": {
                        background: theme.palette.scrollbar.track
                    },
                    "*::-webkit-scrollbar-thumb": {
                        backgroundColor: theme.palette.scrollbar.thumb,
                        borderRadius: 50,
                        border: 0,
                        outline: "none"
                    }
                }}
            />
            <Router>
                <Box className={collapsed ? "dashboard-layout-collapsed" : "dashboard-layout"} component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Box className="header">
                        <AppBar
                            background={"#468AEB"}
                            logo={
                                <img src={process.env.PUBLIC_URL + "/assets/LAMASSU.svg"} height={24} style={{ marginLeft: "5px" }} />
                            }
                            notificationsCount={notificationsList.length}
                            onNotificationsClick={() => setDisplayNotifications(true)}
                        />
                    </Box>
                    <Box className="sidebar" sx={{ borderRight: `1px solid ${theme.palette.background.lightContrast}` }}>
                        <SideBar
                            onToggleDark={() => { setDarkTheme(!darkTheme); }}
                            collapsed={collapsed}
                            onCollapse={() => { setCollapsed(!collapsed); }}
                            menuConfig={routes}
                        />
                    </Box>
                    <Box className="content" sx={{ background: theme.palette.background.lightContrast, display: "flex", flexDirection: "column" }}>
                        <Grid container sx={{ height: "100px", flexGrow: 1, overflow: "hidden" }} ref={containerRef}>
                            <Grid item xs={displayNotifications ? 9 : 12} sx={{ height: "100%" }} >
                                <Routes>
                                    {
                                        routes.map(routeGr => {
                                            return (
                                                routeGr.menuItems.map((route, idx) => {
                                                    return (
                                                        <Route path={route.path} element={route.content} key={idx} />
                                                    );
                                                })
                                            );
                                        })
                                    }
                                    <Route path="info" element={<InfoView />} />
                                    <Route path="loggedout" element={<LoggedOutView />} />
                                    <Route path="*" element={<Typography>404</Typography>} />
                                </Routes>
                            </Grid>
                            <Slide direction="left" in={displayNotifications} container={containerRef.current}>
                                <Grid item xs={3} container component={Paper} elevation={6} direction="column" sx={{ zIndex: 1, borderRadius: 0 }}>
                                    <Grid item container style={{ padding: "10px 20px 10px 20px", borderBottom: `1px solid ${theme.palette.divider}` }} justifyContent="space-between" alignItems={"center"}>
                                        <Grid item>
                                            <Typography style={{ fontWeight: "500", color: theme.palette.text.primary }}>Notifications</Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton onClick={() => setDisplayNotifications(false)}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <Box style={{ overflowY: "auto", height: "10px", paddingLeft: 10 }} flexGrow={1}>
                                        <LamassuNotifications notificationsList={notificationsList} />
                                    </Box>
                                </Grid>
                            </Slide>
                        </Grid>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
};
