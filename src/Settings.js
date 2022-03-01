import React from "react";
import { Card, Divider, Typography, Form, InputNumber, Button,message } from 'antd'

const { Title } = Typography;

class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    onFinish = (values) => {
        console.log(values)
        this.props.handleSettings(values.TH,values.TL,values.TV,values.EC)
        message.success("New Settings Saved!")
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return (
            <Card>
                <Title level={2}>Settings</Title>
                <Divider />
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    layout="vertical"
                    autoComplete="true"
                    initialValues={{
                        TH: this.props.tempH,
                        TL: this.props.tempL,
                        TV: this.props.tvocV,
                        EC: this.props.eco2V,
                        remember: true
                    }}
                >
                    <Form.Item
                        label="Temperature(High) Limit "
                        name="TH"
                        rules={[{
                                required: false,
                        },]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Temperature(Low) Limit "
                        name="TL"
                        rules={[{
                                required: false,
                        },]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="TVOC Limit "
                        name="TV"
                        rules={[{
                                required: false,
                        },]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="ECO2 Limit "
                        name="EC"
                        rules={[{
                                required: false,
                        },]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Settings
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        );
    }
};

export default Setting;