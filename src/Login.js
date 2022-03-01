import { Form, Input, Button, Card,Row,Col } from 'antd';
import walk from './images/walking.png';

const { Meta } = Card;

function Login(props) {
  const onFinish = (values) => {
    props.handleLogin(values.username, values.password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row>
    <Col span={10} offset={7}>
    <Card
    cover={<img src={walk} alt=""/>}>
    <Meta title="USER LOGIN" style={{textAlign: 'center'}}/>
      <Form
        name="basic"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{padding:'30px '}}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </Card>
    </Col>
    </Row>
  );
};

export default Login;