import { Typography, Card, Divider, Collapse } from 'antd';

const { Panel } = Collapse;
const { Title, Text } = Typography;

function FAQ() {
    return (
        <Card>
            <Title level={2} style={{ textAlign: 'center' }} >Frequently Asked Questions (FAQs) </Title>
            <Divider />
            <Collapse style={{ fontSize: '12pt', width: '100%',textAlign:'justify'}}>
                <Panel header=" What does it mean by TVOC and ECO2?" key="2">
                    <p>The <Text type='success'>Total Volatile Organic Compound (TVOC)</Text> level is a measurement of the sum of all of the volatile organic compounds (VOCs) found in an air sample.
                    Inside your home, volatile organic compounds are generally harmful, carcinogenic air pollutants that evaporate at normal indoor atmospheric conditions.
                    Long-term exposure or exposure in large doses of those harmful VOCs can be detrimental to our health and have some negative impacts on the body.
                    </p>
                    <p><Text type='success'>Estimated CO2 (ECO2) </Text>is an indication of the concentration of CO2 in the room calculated from TVOC. 
                    Too much C02 means the indoor air is not circulating, and it's better to open the window to let some fresh air in.
                    </p>
                    <p>
                    It is generally recommended that for indoor the TVOC value should be <Text type='warning'> below 500 ppb (part per billion) </Text>and ECO2 should be<Text type='warning'> below 1500 ppm(part per million).</Text>
                    </p>
                </Panel>
                <Panel header=" Is there an APP for this?" key="3">
                    <p>No, it is still under development. But you can always acces the dashboard in the browser for free though the website link!</p>
                </Panel>
                <Panel header=" What to do when the website cannot connect to the walking stick?" key="1">
                    <p>1. Refresh the website and try again. </p>
                    <p>2. Check you network is working properly and the walking stick is connected to Internet. Then restart the walking stick. </p>
                    <p>If none of them works, contact the support team.</p>
                </Panel>

            </Collapse>


        </Card>
    );
};

export default FAQ;