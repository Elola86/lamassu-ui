import { Box, Button, Paper, Tab, TextField, Typography, useTheme } from "@material-ui/core";
import { Autocomplete, TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useRef, useState } from "react";
import { LamassuModal } from "./LamassuModal";
import { MenuSeparator } from "views/Dashboard/SidebarMenuItem";

const LamassuModalDeviceProvision = ({caList, device, open, handleSubmit, handleClose}) => {
    const dmsUrl = window.location.protocol + "//" + window.location.hostname + ":5000"

    const theme = useTheme();
    const [selectedCA, setSelectedCA] = useState("")
    const [dmsApiUrl, setDmsApiUrl] = useState(dmsUrl)
    const [activeTab, setActiveTab] = useState("viaDefinedValues")
    const [csr, setCsr] = useState("")

    const disabled = activeTab == "viaDefinedValues" ? selectedCA == "" || dmsApiUrl == "" : selectedCA == "" || csr == ""
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const inputFileRef = useRef(null);
    const onFileChange = (e) => {
        /*Selected files data can be collected here.*/
        var files = e.target.files
        if (files.length > 0) {
            var reader = new FileReader();
            reader.readAsText(files[0], "UTF-8");
            reader.onload = (evt) => {
                var content = evt.target.result;
                setCsr(content)
            }
        }else{
            console.log("Nofile");
        }
        inputFileRef.current.value = ""
    }


    return (
        <LamassuModal 
            title={"Provision Device"}
            warnIcon={false}
            msg={"You are about to issue a new certificate for the selected device. Please select the CA to issue with."}
            open={open}
            handleClose={handleClose}
            actions={
                [
                    {
                        title: "Provision",
                        disabledBtn: disabled,
                        primary: true,
                        onClick: ()=>{handleSubmit(device.id, selectedCA.name, dmsApiUrl, 
                            activeTab == "viaCsr", 
                            activeTab == "viaCsr" ? csr : {
                                country: device.country,
                                state: device.state,
                                locality: device.city,
                                organization: device.organization,
                                organization_unit: device.organization_unit,
                                key_type: device.key_metadata.type,
                                key_bits: device.key_metadata.bits,
                            } 
                        )}
                    }
                ]
            }
            formContent={
                (<>
                    <TabContext value={activeTab}>
                        <TabList style={{background: theme.palette.certInspector.tabs}} variant="fullWidth" value={activeTab} onChange={handleTabChange} aria-label="simple tabs example">
                            <Tab value="viaDefinedValues" label="Use Device Configuration" />
                            <Tab value="viaCsr" label="Via CSR"/>
                        </TabList>
                        <Box style={{padding: 20}}>
                            <TabPanel value="viaDefinedValues" style={{padding: 0}}>
                                <Autocomplete
                                    id="combo-box-dms"
                                    options={caList}
                                    fullWidth
                                    value={selectedCA}
                                    onChange={(event, newValue, reason) => {
                                        if(reason == "clear"){
                                            setSelectedCA("")
                                        }else{  
                                            setSelectedCA(newValue)
                                        }
                                    }}
                                    getOptionLabel={(option) => { return typeof option !== "object" ? "" : option.name} }
                                    renderInput={(params) => <TextField required={true} error={selectedCA==""} {...params} label="Certificate Authority" fullWidth variant="standard" />}
                                />

                                <TextField required={true} error={dmsApiUrl==""}  margin="dense" id="DMSAPIURL" label="DMS API URL" fullWidth value={dmsApiUrl} onChange={ev=>{setDmsApiUrl(ev.target.value)}}/>

                            </TabPanel>
                            <TabPanel value="viaCsr" style={{padding: 0}}>
                                <Box style={{marginTop: 10}}>
                                    <Autocomplete
                                        id="combo-box-dms"
                                        options={caList}
                                        fullWidth
                                        value={selectedCA}
                                        onChange={(event, newValue,reason) => {
                                            if(reason == "clear"){
                                                setSelectedCA("")
                                            }else{
                                                setSelectedCA(newValue)
                                            }
                                        }}
                                        getOptionLabel={(option) => { return typeof option !== "object" ? "" : option.ca_name} }
                                        renderInput={(params) => <TextField required={true} error={selectedCA==""}{...params} label="Certificate Authority" fullWidth variant="standard" />}
                                    />
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        onClick={()=>{inputFileRef.current.click() }}
                                        style={{marginTop: 20}}
                                    >
                                        Select CSR file
                                    </Button>
                                    <input
                                        type="file"
                                        ref={inputFileRef}
                                        hidden
                                        onChange={(ev)=>onFileChange(ev)}
                                    />
                                    <Box container style={{margin: 20}}>
                                        <MenuSeparator/>
                                    </Box>
                                    <TextField
                                        id="standard-multiline-flexible"
                                        label="CSR content"
                                        multiline
                                        required={true} error={csr==""}
                                        rows={16}
                                        style={{width: 500}}
                                        inputProps={{style: {fontSize: 12, fontFamily: "monospace", }}}
                                        variant="outlined"
                                        fullWidth
                                        value={csr}
                                        onChange={(ev)=>{setCsr(ev.target.value)}}
                                    />
                                </Box>
                            </TabPanel>
                            <Box>
                                <div style={{marginTop: 20}}>
                                    <Typography variant="button">Device Alias: </Typography>
                                    <Typography variant="button" style={{background: theme.palette.type == "light" ? "#efefef" : "#666", padding: 5, fontSize: 12}}>{device.alias}</Typography>
                                </div>
                                <div>
                                    <Typography variant="button">Device UUID: </Typography>
                                    <Typography variant="button" style={{background: theme.palette.type == "light" ? "#efefef" : "#666", padding: 5, fontSize: 12}}>{device.id}</Typography>
                                </div>
                            </Box>
                        </Box>
                    </TabContext>
                </>)
            }
            
        />
    )
}

export {LamassuModalDeviceProvision}
