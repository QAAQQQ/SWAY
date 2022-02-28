import React from "react";
import { Card } from "antd";

import norm from './images/temp_norm.jpg'
import hot from './images/temp_hot.jpg'
import cold from './images/temp_cold.jpg'
import noinfo from './images/temp.jpg'

function Temperature(props) {
    var info = "- - -"
    var info_val = null
    if (props.temp != null && props.active) {
        info = props.temp + '°C'
        info_val = props.temp
    }

    return (
        <Card
            title="Surrounding Temperature"
            style={{ minHeight: '260px' }}
        >
            <div style={{ fontSize: '22pt', fontFamily: 'cursive' }}>
                <img src={info === "- - -" ? noinfo : info_val >= 35 ? hot : info_val <= 10 ? cold : norm} style={{ height: '120px', verticalAlign: 'middle', marginRight: '10px' }} alt="" />
                {info}
            </div>
        </Card>
    );
}
export default Temperature

