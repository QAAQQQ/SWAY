import React from "react";
import { Card } from "antd";
import air from './images/air.png'

class Environment extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            warned1: false,
            warned2: false
        })
    }

    render() {
        var display1 = "- -"
        var display2 = "- -"
        if (this.props.tvoc != null && this.props.active) {
            display1 = this.props.tvoc
        }
        if (this.props.eco2 != null && this.props.active) {
            display2 = this.props.eco2
        }

        return (
            <div>
                <Card
                    title="Environment"
                    style={{ height: "260px" }}
                >
                    <div style={{ fontSize: '18pt',fontFamily:'cursive'}}>
                        {'TVOC:  '}{display1}<br />
                        {'ECO2:  '}{display2}<br />
                        <img src={air} alt="" style={{ height: '60px',float:'right'}} />
                    </div>
                </Card>

            </div>
        );
    }
}
export default Environment