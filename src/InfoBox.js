import React from 'react'
import { CardContent, Typography,Card } from '@material-ui/core'
import "./InfoBox.css"
import {prettyPrintStat1} from "./util";
function InfoBox({title,cases,isRed,total,...props}) {
    return (
        <Card 
        onClick={props.onClick}
         className={`infoBox ${props.active && "infoBox-selected"} ${props.active && isRed && "infoBox-Red"}`} > 
            <CardContent>
                <Typography className="omfoBox_title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox_cases ${ !isRed && "infobox-green"}`}>{cases}</h2>
                <Typography  className="infoBox_total" color="textSecondary">{prettyPrintStat1( total)} totle</Typography>
            </CardContent>
        </Card>
            
    )
}

export default InfoBox
