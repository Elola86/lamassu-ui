import React, { useState } from "react"
import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom"
import CaList from "./views/CaList"
import CaInspector from "./views/CaInspector"
import { Box } from "@mui/system"
import { Divider, Grid, Tab, Tabs, Typography } from "@mui/material"
import { useTheme } from "@emotion/react"
import CreateCA from "./views/CaActions/CreateCA"
import { ImportCA } from "./views/CaActions/ImportCA/ImportCA"
import casDucks from "redux/ducks/certificate-authorities"
import { useSelector } from "react-redux"

export default () => {
    return (
        <Routes>
            <Route path="/" element={<RoutedCaList />}>
                <Route path="actions" element={<CaCreationActionsWrapper />} >
                    <Route path="create" element={<CreateCA />} />
                    <Route path="import" element={<ImportCA />} />
                </Route>
                <Route path=":caName/*" element={<RoutedCaInspector />} />
            </Route>
        </Routes>
    )
}

const RoutedCaList = () => {
    const params = useParams()
    const location = useLocation()
    // console.log(params, location);
    return (
        <CaList urlCaName={params.caName} />
    )
}

const RoutedCaInspector = () => {
    const params = useParams()
    const location = useLocation()
    const ca = useSelector(state => casDucks.reducer.getCA(state, params.caName))
    // console.log(params, location);

    return (
        ca !== undefined ?(
            <CaInspector caName={params.caName} />
        ): (
            <Box sx={{ fontStyle: "italic" }}>CA not found</Box>
        )
  )
}

const CaCreationActionsWrapper = () => {
    const theme = useTheme()
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <Box sx={{ width: "100%" }}>
            <Box style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box style={{ padding: "40px 40px 0 40px" }}>
                    <Grid item container spacing={2} justifyContent="flex-start">
                        <Grid item xs={12}>
                            <Box style={{ display: "flex", alignItems: "center" }}>
                                <Typography style={{ color: theme.palette.text.primary, fontWeight: "500", fontSize: 26, lineHeight: "24px", marginRight: "10px" }}>Create a new CA</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Typography style={{ color: theme.palette.text.secondary, fontWeight: "400", fontSize: 13, marginTop: "10px" }}>To create a new CA certificate, please provide the apropiate information</Typography>
                    </Grid>
                    <Box style={{ marginTop: 15, position: "relative", left: "-15px" }}>
                        <Tabs value={selectedTab} onChange={(ev, newValue) => setSelectedTab(newValue)}>
                            <Tab component={Link} to="create" label="Standard" />
                            <Tab component={Link} to="import" label="Import" />
                        </Tabs>
                    </Box>
                </Box>
                <Divider />
                <Box style={{ padding: "20px 40px 20px 40px", flexGrow: 1, overflowY: "auto", height: "100%" }}>
                    <Grid container>
                        <Outlet />
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}
