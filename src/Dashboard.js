// This is the dashboard page 
// All basic mqtt links are handled here
import React from "react";
import { Row, Col, message, Typography, Divider, Card, Alert, Space, notification } from "antd";
import mqtt from 'mqtt';
import axios from 'axios'

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
            warn_eco2: false,
            t1:null, //warn start time for temp hot
            t2:null, //warn start time for temp cold
            t3:null, //warn start time for tvoc
            t4:null, //warn start time for eco2
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
                        var result = msg.split(",")
                        var data = {
                            temp:result[1],
                            humidity:result[0],
                            eco2:result[2],
                            tvoc:result[3]
                        }
                        axios
                            .post('http://localhost:8082/api/sticks',data)
                            .catch(err => {
                                console.log("Error in post record!");
                              })
                        //ref:  s = str(humidity)+","+str(temp)+","+str(eco2)+","+str(tvoc) + ","+str(altitude)
                        this.setState({
                            humidity: Math.round(result[0] * 100) / 100,
                            temp: Math.round(result[1] * 100) / 100,
                            eco2: result[2],
                            tvoc: result[3],
                            alt: Math.round(result[4] * 100) / 100
                        })

                        var t = new Date()
                        var time = t.toLocaleString()

                        //console.log('time',time)
                        //setting warnings for temperature monitoring 
                        var warnh = this.state.warn_temph
                        var warnl = this.state.warn_templ
                        if (result[1] >= this.props.tempH) {
                            //too hots
                            if (!warnh) {
                                this.setState({
                                    warn_temph: true,
                                    t1:t,
                                })
                                notification.warn({
                                    message: 'Extreme Weather',
                                    description:
                                        'Temperature above '+this.props.tempH+' °C at '+time,
                                    duration: 0,
                                })
                            }
                            if (warnl === true) {
                                this.setState({
                                    warn_templ: false,
                                    t2:null,
                                })
                            }

                            //judge if time exceed the limit 
                            var dif = Math.round((t-this.state.t1)/1000)
                            console.log(dif)
                            if(dif>=this.props.limit){
                                notification.error({
                                    placement:"bottomLeft",
                                    key:"temphot",
                                    message: 'Extreme Weather for Long',
                                    description:
                                        'Temperature above '+this.props.tempH+' °C for over '+ dif +'s',
                                    duration: 0,
                                })
                            }

                        } else if (result[1] <= this.props.tempL) {
                            // too cold 
                            if (!warnl) {
                                this.setState({
                                    warn_templ: true,
                                    t2:t,
                                })
                                notification.warn({
                                    message: 'Extreme Weather',
                                    description:
                                        'Temperature below'+ this.props.tempL+'°C at '+time,
                                    duration: 0,
                                })
                            }
                            if (warnh === true) {
                                this.setState({
                                    warn_temph: false,
                                    t1:null,
                                })
                            }
                            
                            //judge if time exceed the limit 
                            var dif = Math.round((t-this.state.t2)/1000)
                            console.log(dif)
                            if(dif>=this.props.limit){
                                notification.error({
                                    placement:"bottomLeft",
                                    key:"tempcold",
                                    message: 'Extreme Weather for Long',
                                    description:
                                        'Temperature below '+this.props.tempL+' °C for over '+ dif +'s',
                                    duration: 0,
                                })
                            }

                        } else {
                            if (warnh === true) {
                                this.setState({
                                    warn_temph: false,
                                    t1:null,
                                })
                            }
                            if (warnl === true) {
                                this.setState({
                                    warn_templ: false,
                                    t2:null,
                                })
                            }
                        }

                        //setting warning for tvoc and eco2 monitoring
                        var warn_tv = this.state.warn_tvoc
                        var warn_ec = this.state.warn_eco2
                        if (result[3] >= this.props.tvocV) {
                            // exceed tvoc limit
                            if (!warn_tv) {
                                this.setState({
                                    warn_tvoc: true,
                                    t3:t
                                })
                                notification.warn({
                                    message: 'Unwell Environment',
                                    description:
                                        'TVOC > 500 at '+time,
                                    duration: 0,
                                })
                            }
                            //judge if time exceed the limit 
                            var dif = Math.round((t-this.state.t3)/1000)
                            console.log(dif)
                            if(dif>=this.props.limit){
                                notification.error({
                                    placement:"bottomLeft",
                                    key:"tvocV",
                                    message: 'Excessive TVOC for Long',
                                    description:
                                        'TVOC above '+this.props.tvocV+' PPB for over '+ dif +'s',
                                    duration: 0,
                                })
                            }
                        } else {
                            if (warn_tv === true) {
                                this.setState({
                                    warn_tvoc: false,
                                    t3:null
                                })
                            }
                        }

                        if (result[2] >= this.props.eco2V) {
                            //exceed eco2 limit
                            if (!warn_ec) {
                                this.setState({
                                    warn_eco2: true,
                                    t4:t
                                })
                                notification.warn({
                                    message: 'Unwell Environment',
                                    description:
                                        'ECO2 > 1500 at '+ time,
                                    duration: 0,
                                })
                            }
                            //judge if time exceed the limit 
                            var dif = Math.round((t-this.state.t4)/1000)
                            console.log(dif)
                            if(dif>=this.props.limit){
                                notification.error({
                                    placement:"bottomLeft",
                                    key:"temphot",
                                    message: 'Excessive ECO2 for Long',
                                    description:
                                        'ECO2 above '+this.props.eco2V+' PPM for over '+ dif +'s',
                                    duration: 0,
                                })
                            }
                        } else {
                            if (warn_ec === true) {
                                this.setState({
                                    warn_eco2: false,
                                    t4:null
                                })
                            }
                        }


                        break
                    // keep reporting error if not aware user
                    case ("IC.embedded/SWAY/" + channel + "/2sec"):
                        var result = msg.split(",");
                        var data2 = {
                            dir:result[1],
                            angle:result[0]
                        }
                        axios
                            .post('http://localhost:8082/api/sticks',data2)
                            .catch(err => {
                                console.log("Error in post record!")
                              })
                       
                    
                        this.setState({
                            angle: Math.round(result[0] * 100) / 100,
                            direction: result[1]
                        })
                        break
                    case ("IC.embedded/SWAY/" + channel + "/calibrate"):
                        //console.log("calibrate"+','+msg)
                        if (msg == 1) {
                            //console.log('calibrate here')
                            message.info({
                                key: 'update2',
                                content: 'Device Under Calibration',
                            });
                            this.setState({
                                calibrating: true
                            })
                        } else if (msg == 0) {
                            //console.log('calibrate done')
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
                        //console.log('topic recieved: ' + topic + ":" + msg)
                }
            });
        }
    }

    handleSubscribe = (topic, qos) => {
        //alert("subscribe topic: "+topic+", qos:"+qos)
        this.client.subscribe(topic, { qos: qos }, (error) => {
            if (error) {
                //console.log("Subscribe to topics error", error);
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
                    <Col span={11}>
                        <Connect
                            connect={this.handleConnect}
                            connectStatus={this.state.connectStatus}
                            disconnect={this.handleDisconnect}

                        />
                    </Col>
                    <Col span={5}>
                        <Card
                            title="Device Status"
                            style={{ minHeight: '290px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={this.state.active ? on : off} style={{ height: '100px' }} alt="" />
                                <header style={{ fontSize: '18pt',fontFamily:'cursive'}}>{this.state.active ? 'ACTIVE' : this.state.connectStatus === 'Connected' ? 'INACTIVE' : 'UNKNOWN'}</header>
                            </div>
                        </Card>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                        <Card style={{ height: '290px' }} title='Realtime Alert'>
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
