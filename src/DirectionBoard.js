import React from "react";
import { Card } from "antd";

function Direction(props) {
    var display1 = "- - -"
    var display2 = ""
    if (props.calibrate !== true) {
        if (props.angle != null && props.active) {
            display1 = props.angle + '°'
        }
        if (props.direction != null && props.active) {
            display2 = props.direction
        }
    }

    return (
        <div>
            <Card
                title="Direction"
                style={{ height: "260px" }}
            >
                <br />
                <div style={{ fontSize: '22pt', textAlign: 'center', fontFamily: 'cursive' }}>
                    <div>{display2}</div>
                    <div>{display1}</div>
                </div>
            </Card>

        </div>
    );

}
export default Direction