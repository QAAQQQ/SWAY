// This is the dashboard page 
// All basic mqtt links are handled here
import React from "react";
import { Row, Col, message, Typography, Divider, Card, Alert, Space, notification } from "antd";
import mqtt from 'mqtt';

import Connect from './ConnectBoard'
import Temperature from './TemperatureBoard'
import Humidity from './HumidityBoard'
import Environment from './EnvironmentBoard'
import Direction from './DirectionBoard'
import Altitude from './AltitudeBoard'

import coming from './images/coming.png'
import on from './images/on.jpg'
import off from './images/off.jpg'

const { Text } = Typography;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null,
            connectStatus: 'Connect',
            temp: null,
            humidity: null,
            tvoc: null,
            eco2: null,
            alt: null,
            angle: null,
            direction: null,
            calibrating: false,
            active: false,
            warn_temph: false,
            warn_templ: false,
            warn_tvoc: false,
            warn_eco2: false
        }
    }

    handleConnect = (mqttOption, channel) => {
        this.setState({ connectStatus: "Connecting" })
        //"wss://8bf944ce81304d2496509d5fcb3368d8.s1.eu.hivemq.cloud:8884/mqtt",
        this.client = mqtt.connect("wss://8bf944ce81304d2496509d5fcb3368d8.s1.eu.hivemq.cloud:8884/mqtt", mqttOption)
        if (this.client) {
            this.client.on("connect", () => {
                this.handleSubscribe("IC.embedded/SWAY/" + channel + "/2sec", 0)
                this.handleSubscribe("IC.embedded/SWAY/" + channel + "/5sec", 0)
                this.handleSubscribe("IC.embedded/SWAY/" + channel + "/warning", 0)
                this.handleSubscribe("IC.embedded/SWAY/" + channel + "/calibrate", 0)
                this.handleSubscribe("IC.embedded/SWAY/" + channel + "/status", 0)
                message.loading({ content: 'Connected to Server', key: "aaa", duration: 1 })
            });
            this.client.on("error", (err) => {
                message.error("Connection error: ", err);
                this.client.end();
            });
            this.client.on("reconnect", () => {
                this.setState({ connectStatus: "Reconnecting ..." });
            });

            this.client.on("message", (topic, messages) => {
                var msg = messages.toString()
                //alert("recieve message")
                if (this.state.connectStatus === 'Connecting') {
                    // only after recieve messages we think it is successfully connected to device
                    message.success({ content: 'Connected to Device', key: "aaa" })
                    this.setState({ connectStatus: "Connected" })

                }

                if (topic === "IC.embedded/SWAY/" + channel + "/status") {
                    this.setState({
                        active: false
                    })
                } else if (this.state.active !== true) {
                    this.setState({
                        active: true
                    })
                }
                switch (topic) {
                    case ("IC.embedded/SWAY/" + channel + "/5sec"):
                        console.log("5sec")
                        //alert("topic 5sec")
                        var result = msg.split(",")
                        //ref:  s = str(humidity)+","+str(temp)+","+str(eco2)+","+str(tvoc) + ","+str(altitude)
                        this.setState({
                            humidity: Math.round(result[0] * 100) / 100,
                            temp: Math.round(result[1] * 100) / 100,
                            eco2: result[2],
                            tvoc: result[3],
                            alt: Math.round(result[4] * 100) / 100
                        })

                        var time = new Date().toLocaleString()
                        console.log('time',time)
                        //setting warnings for temperature monitoring 
                        var warnh = this.state.warn_temph
                        var warnl = this.state.warn_templ
                        if (result[1] >= 35) {
                            if (!warnh) {
                                this.setState({
                                    warn_temph: true
                                })
                                notification.warn({
                                    message: 'Extreme Whether',
                                    description:
                                        'Temperature above 35 °C at '+time,
                                    duration: 0,
                                })
                            }
                            if (warnl === true) {
                                this.setState({
                                    warn_templ: false
                                })
                            }
                        } else if (result[1] <= 0) {
                            if (!warnl) {
                                this.setState({
                                    warn_templ: true
                                })
                                notification.warn({
                                    message: 'Extreme Whether',
                                    description:
                                        'Temperature below 0 °C at '+time,
                                    duration: 0,
                                })
                            }
                            if (warnh === true) {
                                this.setState({
                                    warn_temph: false
                                })
                            }
                        } else {
                            if (warnh === true) {
                                this.setState({
                                    warn_temph: false
                                })
                            }
                            if (warnl === true) {
                                this.setState({
                                    warn_templ: false
                                })
                            }
                        }

                        //setting warning for tvoc and eco2 monitoring
                        var warn_tv = this.state.warn_tvoc
                        var warn_ec = this.state.warn_eco2
                        if (result[3] >= 500) {
                            if (!warn_tv) {
                                this.setState({
                                    warn_tvoc: true
                                })
                                notification.warn({
                                    message: 'Unwell Environment',
                                    description:
                                        'TVOC > 500 at '+time,
                                    duration: 0,
                                })
                            }
                        } else {
                            if (warn_tv === true) {
                                this.setState({
                                    warn_tvoc: false
                                })
                            }
                        }

                        if (result[2] >= 1500) {
                            if (!warn_ec) {
                                this.setState({
                                    warn_eco2: true
                                })
                                notification.warn({
                                    message: 'Unwell Environment',
                                    description:
                                        'ECO2 > 1500 at '+ time,
                                    duration: 0,
                                })
                            }
                        } else {
                            if (warn_ec === true) {
                                this.setState({
                                    warn_eco2: false
                                })
                            }
                        }


                        break
                    // keep reporting error if not aware user
                    case ("IC.embedded/SWAY/" + channel + "/2sec"):
                        console.log("2sec")
                        var result = msg.split(",");
                        //s = str(angle)+","+ direction
                        this.setState({
                            angle: Math.round(result[0] * 100) / 100,
                            direction: result[1]
                        })
                        break
                    case ("IC.embedded/SWAY/" + channel + "/calibrate"):
                        console.log("calibrate")
                        var result = msg
                        if (result === 1) {
                            message.info({
                                key: 'update2',
                                content: 'Device Under Calibration',
                            });
                            this.setState({
                                calibrating: true
                            })
                        } else if (result === 0) {
                            message.success({
                                key: 'update2',
                                content: 'Calibration Done',

                            });
                            this.setState({
                                calibrating: false
                            })
                        }
                        break
                    default:
                        console.log('topic recieved: ' + topic)
                }
            });
        }
    }

    handleSubscribe = (topic, qos) => {
        //alert("subscribe topic: "+topic+", qos:"+qos)
        this.client.subscribe(topic, { qos: qos }, (error) => {
            if (error) {
                console.log("Subscribe to topics error", error);
                return;
            }
        });
    }

    handleDisconnect = () => {
        //disconnect the frontend to server and hence disconnect to device
        message.warn('Disconnected')
        if (this.client) {
            this.client.end(() => {
                this.setState({ 
                    connectStatus: "Connect",
                    client:null,
                    active:null, 
                });
            });
        }
    };
    render() {
        return (
            <div style={{ margin: '10px' }}>
                <Row justify="space-between">
                    <Col span={7}>
                        <div style={{ marginBottom: '30px' }}>
                            <header style={{ fontSize: '32pt' }}>Hi, Admin!</header>
                            <Text type="secondary">Welcome back, nice to see you again!</Text>
                        </div>
                    </Col>
                    <Col span={7}>
                    </Col>
                    <Col span={7}></Col>
                </Row>
                <Row justify="start">
                    <Col span={9}>
                        <Connect
                            connect={this.handleConnect}
                            connectStatus={this.state.connectStatus}
                            disconnect={this.handleDisconnect}

                        />
                    </Col>
                    <Col span={7}>
                        <Card
                            title="Device Status"
                            style={{ minHeight: '280px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={this.state.active ? on : off} style={{ height: '100px' }} alt="" />
                                <header style={{ fontSize: '18pt',fontFamily:'cursive'}}>{this.state.active ? 'ACTIVE' : this.state.connectStatus === 'Connected' ? 'INACTIVE' : 'UNKNOWN'}</header>
                            </div>
                        </Card>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                        <Card style={{ height: '280px' }} title='Realtime Alert'>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Alert type="error" message="High temperature ( >35°C )" style={{ display: this.state.connectStatus==='Connected'?this.state.warn_temph ?'block':'none':'none'}} />
                                <Alert type="error" message="Low temperature ( <10°C )" style={{ display: this.state.connectStatus==='Connected'?this.state.warn_templ ? 'block' : 'none':'none' }} />
                                <Alert type="error" message="High TVOC( > 500 )" style={{ display: this.state.connectStatus==='Connected'?this.state.warn_tvoc ? 'block' : 'none':'none' }} />
                                <Alert type="error" message="High ECO2( > 1500 )" style={{ display: this.state.connectStatus==='Connected'?this.state.warn_eco2 ? 'block' : 'none':'none' }} />
                            </Space>
                        </Card>
                    </Col>

                </Row>
                <Divider />
                <Row justify="space-between">
                    <Col span={8}>
                        <Temperature
                            temp={this.state.temp}
                            active={this.state.active}
                        />
                    </Col>
                    <Col span={8}>
                        <Humidity
                            humidity={this.state.humidity}
                            active={this.state.active}
                        />
                    </Col>
                    <Col span={8}>
                        <Environment
                            tvoc={this.state.tvoc}
                            eco2={this.state.eco2}
                            active={this.state.active}
                        />
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col span={8}>
                        <Altitude
                            alt={this.state.alt}
                            active={this.state.active}
                        />
                    </Col>
                    <Col span={8}>
                        <Direction
                            angle={this.state.angle}
                            direction={this.state.direction}
                            calibrate={this.state.calibrating}
                            active={this.state.active}
                        />
                    </Col>
                    <Col span={8}>
                        <Card
                            style={{ height: '260px' }}
                            title="Other">
                            <img src={coming} style={{ height: '150px' }} alt="" />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Dashboard;