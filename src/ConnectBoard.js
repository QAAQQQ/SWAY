import React from "react";
import { Card, Form, Input, Button, message} from "antd";


class Connect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "WS001"
        }
    }

    handleInputChange = (event) => {
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        })
    }

    handleConnect = () => {
        const deviceID = this.state.id
        if (deviceID !== "WS001") {
            message.error("Invalid Device");
        } else {
            const options = {
                username: 'website',
                password: 'Web12345',
                rejectUnauthorized: false,
                keepalive: 30,
                clientId: 'web1234-asdf-imperial',
                clean: true,
                reconnectPeriod: 1000,
                connectTimeout: 30 * 1000,
                will: {
                    topic: "WillMsg",
                    payload: "Connection Closed abnormally..!",
                    qos: 0,
                    retain: false,
                },

            };
            this.props.connect(options, "rasp")
        }
    };


    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return (
            <Card
                title="Device Connection"
                style={{ height: "280px"}}
                actions={[
                    <Button type="primary" onClick={this.handleConnect}>
                        {this.props.connectStatus}
                    </Button>,
                    <Button danger onClick={this.props.disconnect}>
                        Disconnect
                    </Button>,
                ]}
                >
                <Form
                    style={{ marginLeft: '10px', marginTop: '10px' }}
                    name="Connection"
                    layout="vertical"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        deviceid: this.state.id,
                        remember: true
                    }}
                    autoComplete="true">
                    <Form.Item
                        label="DeviceID"
                        name="deviceid"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the deviceID!',
                            },
                        ]}
                    >
                        <Input
                            name="id"
                            onChange={this.handleInputChange} />
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default Connect;