import * as React from "react";
import { Box, ListItem, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import { CAView } from "views/CAs";
import { CertificatesView } from "views/Certificates";
import { DMSView } from "views/DMS";
import { DevicesView } from "views/Devices";
import { Home } from "views/Home";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { TbCertificate } from "react-icons/tb";

import { useAuth } from "react-oidc-context";
import { useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import Grid from "@mui/material/Unstable_Grid2";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { InfoView } from "views/Info/info";

type SidebarSection = {
    sectionTitle: string, sectionItems: Array<SidebarItem>
}

type SidebarItem =
    | SidebarItemButton
    | SidebarItemNavigation

type SidebarItemNavigation = { kind: "navigation", title: string, basePath: string, goTo: string, icon: React.JSX.Element, content: React.JSX.Element }
type SidebarItemButton = { kind: "button", title: string, onClick: () => void, icon: React.JSX.Element }

function sidebarBasePathPattern (basePath: string) {
    let prefix = basePath;
    if (basePath.endsWith("/*")) {
        prefix = basePath.replaceAll("/*", "*");
    }
    // Escape special characters in the prefix
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Replace '*' with '.*' to match any characters
    const pattern = new RegExp("^" + escapedPrefix.replace(/\*/g, ".*") + "$");

    return pattern;
}

export default function Dashboard () {
    const navigate = useNavigate();
    const auth = useAuth();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [collapsed, setCollapsed] = useState(false);

    React.useEffect(() => {
        setCollapsed(!isMdUp);
    }, [isMdUp]);

    const handleCollapseClick = () => {
        if (isMdUp) {
            setCollapsed(!collapsed);
        }
    };

    const sidebarContent: Array<SidebarSection> = [
        {
            sectionTitle: "",
            sectionItems: [
                {
                    kind: "button",
                    title: "Collapse",
                    onClick: handleCollapseClick,
                    icon: <KeyboardArrowLeftOutlinedIcon />
                }
            ]
        },
        {
            sectionTitle: "",
            sectionItems: [
                {
                    kind: "navigation",
                    title: "Home",
                    goTo: "/",
                    basePath: "/",
                    icon: <DashboardOutlinedIcon />,
                    content: <Home />
                }
            ]
        },
        {
            sectionTitle: "Certification Authorities",
            sectionItems: [
                {
                    kind: "navigation",
                    title: "CAs",
                    basePath: "/cas/*",
                    goTo: "/cas",
                    icon: <AccountBalanceOutlinedIcon />,
                    content: <CAView />
                },
                {
                    kind: "navigation",
                    title: "Certificates",
                    basePath: "/certs/*",
                    goTo: "/certs",
                    icon: <TbCertificate />,
                    content: <CertificatesView />
                }
            ]
        },
        {
            sectionTitle: "Registration Authorities",
            sectionItems: [
                {
                    kind: "navigation",
                    title: "DMS",
                    basePath: "/dms/*",
                    goTo: "/dms",
                    icon: <FactoryOutlinedIcon />,
                    content: <DMSView />
                },
                {
                    kind: "navigation",
                    title: "Devices",
                    basePath: "/devices/*",
                    goTo: "/devices",
                    icon: <RouterOutlinedIcon />,
                    content: <DevicesView />
                }
            ]
        },
        {
            sectionTitle: "",
            sectionItems: [
                {
                    kind: "navigation",
                    title: "Info",
                    basePath: "/info/*",
                    goTo: "/info",
                    icon: <InfoOutlinedIcon />,
                    content: <InfoView />
                }
            ]
        }
    ];

    const sidebarItems = sidebarContent.map(section => section.sectionItems).flat();
    const sidebarNavigator = sidebarItems.filter((item): item is SidebarItemNavigation => {
        return item.kind === "navigation";
    });

    const location = useLocation();
    const interval = React.useRef<number>();

    React.useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            // auto refresh every 3s
            auth.signinRedirect();
            window.clearInterval(interval.current);

            interval.current = window.setInterval(() => {
                auth.signinRedirect();
            }, 3000);
            return () => window.clearInterval(interval.current);
        }

        return () => { };
    }, [auth.isAuthenticated, auth.isLoading]);

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (!auth.isAuthenticated) {
        return <></>;
    }

    return (
        <Box component={Paper} sx={{ height: "100%" }}>
            <Grid container sx={{ height: "100%" }}>
                <Grid xs={12} container sx={{ background: theme.palette.primary.main, height: "50px", paddingX: "10px" }} alignItems={"center"}>
                    <Grid xs>
                        <img src={process.env.PUBLIC_URL + "/assets/LAMASSU.svg"} height={24} style={{ marginLeft: "5px" }} />
                    </Grid>
                    <Grid xs="auto">
                        <LogoutIcon style={{ color: "#F1F2F8", cursor: "pointer" }} onClick={() => {
                            auth.signoutRedirect();
                        }} />
                    </Grid>
                </Grid>
                <Grid xs={12} container sx={{ height: "calc(100% - 50px)" }}>
                    <Grid xs="auto" container flexDirection={"column"} sx={{ width: "100%", maxWidth: collapsed ? "50px" : "250px", background: theme.sidebar.background, borderRight: `1px solid ${theme.palette.divider}` }}>
                        {
                            sidebarContent.map((section, sectionIdx) => {
                                return (
                                    <Grid key={`sidebar-${sectionIdx}`} borderBottom={`1px solid ${theme.sidebar.dividerBg}`}>
                                        {
                                            !collapsed && section.sectionTitle !== "" && (
                                                <Typography sx={{ color: theme.sidebar.textColor, fontFamily: "Roboto", fontWeight: "300", fontVariant: "all-small-caps", padding: "5px 20px", fontSize: "16px" }}>{section.sectionTitle}</Typography>
                                            )
                                        }
                                        {
                                            section.sectionItems.map((item, idx) => {
                                                let borderLeftPxls = 0;
                                                if (item.kind === "navigation") {
                                                    const navItem = item as SidebarItemNavigation;
                                                    // Check if the current location matches the base path of the navigation item
                                                    if (sidebarBasePathPattern(navItem.basePath).test(location.pathname)) {
                                                        borderLeftPxls = 5;
                                                    }
                                                }

                                                return (
                                                    <ListItem disableRipple key={idx} button sx={{ borderRadius: 0, borderLeft: `${borderLeftPxls}px solid ${theme.palette.primary.main}`, paddingLeft: `${16 - borderLeftPxls}px` }} onClick={() => {
                                                        if (item.kind === "button") {
                                                            item.onClick();
                                                        } else {
                                                            navigate(item.goTo);
                                                        }
                                                    }}>
                                                        {
                                                            React.Children.map(item.icon, (child, key) => React.cloneElement(child, {
                                                                style: {
                                                                    color: item.kind === "navigation" && sidebarBasePathPattern(item.basePath).test(location.pathname) ? theme.sidebar.menuItemBgActive : theme.sidebar.menuItemBg,
                                                                    fontSize: 22
                                                                },
                                                                key
                                                            }))
                                                        }
                                                        {
                                                            !collapsed && (
                                                                <Typography style={{
                                                                    color: item.kind === "navigation" && sidebarBasePathPattern(item.basePath).test(location.pathname) ? theme.sidebar.menuItemBgActive : theme.sidebar.textColor,
                                                                    ...(item.kind === "navigation" && sidebarBasePathPattern(item.basePath).test(location.pathname) && { fontWeight: "bold" }),
                                                                    marginLeft: 10,
                                                                    width: "100%",
                                                                    fontSize: 14
                                                                }}> {item.title} </Typography>
                                                            )
                                                        }
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                    <Grid xs sx={{ background: theme.palette.background.default, height: "100%", overflowY: "auto" }}>
                        <Routes>
                            {
                                sidebarNavigator.map((route: SidebarItemNavigation, idx) => {
                                    return (
                                        <Route path={route.basePath} element={<MainWrapper component={route.content} />} key={`main-route-${idx}`} />
                                    );
                                })
                            }
                            <Route path="*" element={<Typography>404</Typography>} />
                        </Routes>
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    );
}

interface MainWrapperProps {
    component: React.ReactNode
}

const MainWrapper = React.memo<MainWrapperProps>((props) => {
    return (
        <>{props.component}</>
    );
});
MainWrapper.displayName = "MainWrapper";
