import { Button, Chip, Typography, useTheme } from "@material-ui/core"
import { blue, green, orange, red } from "@material-ui/core/colors"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DenseTable from 'components/DenseTable';
import { LamassuChip } from "components/LamassuChip";

export const DMSCard = ({ dmsData, title, status, isAdmin, onApproval, onDecline, styles={} }) => {
    const theme = useTheme()
    
    const keys = Object.keys(dmsData)
    const denseTableData = []
    keys.forEach(key => {
        denseTableData.push({
        label: key,
        content: dmsData[key]
        })
    });

    var statusColor;
    if (status == "APPROVED") {
      statusColor = "green"
    }else if(status == "REVOKED" || status == "DENIED"){
      statusColor = "red"
    }else if(status == "NEW"){
      statusColor = "orange"
      status = "PENDING"
    }

    return (
        <Card style={{width: 500, borderTop: "3px solid " + theme.palette.primary.main, ...styles}}>
        <div style={{padding:10 , height: 40, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
            <Typography variant="h5" component="h2" color="textPrimary">
                {title}
            </Typography>
            </div>
            <div>
                <LamassuChip status={statusColor} label={status} />
            </div>
        </div>
        <CardContent>
            <DenseTable dense={true} data={denseTableData}/>
        </CardContent>
        {
            isAdmin && status == "PENDING" && (
                <CardActions disableSpacing>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                        <Button variant="contained" color="primary" fullWidth style={{marginRight:10}} onClick={onApproval}>Approve</Button>
                        <Button variant="contained" fullWidth style={{marginLeft:10}} onClick={onDecline}>Decline</Button>
                    </div>
                </CardActions> 
            )
        }
    </Card>    
    )
}