import { Card, Divider, Typography, Form, Input, Button, } from 'antd'

const { Title } = Typography;

function Other() {

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card>
            <Title level={2}>Contact Us</Title>
            <Divider />
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Form.Item
                    label="Contact Email"
                    name="email"
                    rules={[
                        {
                            required: false,
                            message: 'email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name='contents' label="Contents">
                    <Input.TextArea style={{ minHeight: '180px' }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

        </Card>
    );
};

export default Other;