import React from "react";
import { Card } from "antd";
import water from './images/water.png'
import water_2 from './images/water_2.png'

function Humidity(props) {
    var display = "- - -"
    if (props.humidity != null && props.active) {
        display = props.humidity
    }

    return (
        <div>
            <Card
                title="Humidity"
                style={{ height: "260px" }}
            >
                <div style={{ fontSize: '22pt', verticalAlign: 'middle', fontFamily: 'cursive' }}>
                    <img src={display === "- - -" ? water : water_2} style={{ height: '120px', verticalAlign: 'middle', marginRight: '10px' }} alt="" />
                    {display}
                </div>
            </Card>

        </div>
    );

}
export default Humidity