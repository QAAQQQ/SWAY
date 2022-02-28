import { Empty, Card,Divider,Typography } from 'antd'

const { Title } = Typography;

function Profile() {
    return (
        <Card>
            <Title level={2}>Profile</Title>
            <Divider />
            <Empty />
        </Card>
    );
};

export default Profile;