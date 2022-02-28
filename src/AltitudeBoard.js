import React from "react";
import { Card } from "antd";

function Altitude(props) {
    var display = "- - -"
    if (props.alt != null && props.active) {
        display = props.alt + " meters"
    }

    return (
        <div>
            <Card
                title="Altitude"
                style={{ height: "260px" }}
            >
                <br />
                <p style={{ fontSize: '22pt', textAlign: 'center', fontFamily: 'cursive' }}>{display}</p>
            </Card>

        </div>
    );

}
export default Altitude