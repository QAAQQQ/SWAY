import './css/App.css';
import React from "react";
import { Layout, Menu, message } from 'antd';
import { UserOutlined } from '@ant-design/icons/lib/icons';

import Login from './Login'
import Dashboard from './Dashboard'
import FAQ from './FAQ'
import Other from './Other'
import Profile from './Profile'
import Settings from './Settings'
import logo from './images/stick.png'

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const mapObject = {
  admin: '1',
  user1: '2'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: "Login", //Login,Dashboard
      page: 'login', // 'login,faq,other'
      tempH: 35,
      tempL: 0,
      humidH: 80,
      humidL: 10,
      tvocV: 500,
      eco2V: 1500,
      limit: 30,
    }
  }

  onCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  handleLogin = (username, password) => {
    if (mapObject[username] === password) {
      this.setState({ loginStatus: "Dashboard" });
    } else {
      message.error("Invalid username or password!")
    }
  }

  handleLogout = () => {
    this.setState({
      loginStatus: "Login",
      page: "login"
    })
    window.location.reload()
  }

  handleSettings = (th, tl, tv, tc,limit) => {
    this.setState({
      tempH: th,
      tempL: tl,
      tvocV: tv,
      eco2V: tc,
      limit:limit
    })
  }

  render() {
    var hide = "none"
    if (this.state.loginStatus === "Dashboard") {
      hide = "block"
    }

    return (
      <Layout hasSider>
        <Sider
          theme="light"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}>
          <img className="logo" alt="" src={logo} style={{ height: '70px', margin: '16px', paddingLeft: '15px' }} />
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" onClick={() => { this.setState({ page: 'login' }) }}>{this.state.loginStatus}</Menu.Item>
            <SubMenu key="3" title="User" icon={<UserOutlined />} style={{ display: hide }}>
              <Menu.Item key="4" onClick={() => { this.setState({ page: 'profile' }) }}>Profile</Menu.Item>
              <Menu.Item key="10" onClick={() => { this.setState({ page: 'setting' }) }}>Settings</Menu.Item>
              <Menu.Item key="5" onClick={this.handleLogout}>Logout</Menu.Item>
            </SubMenu>

            <SubMenu key="7" title="Need Help?" >
              <Menu.Item key="8" onClick={() => { this.setState({ page: 'faq' }) }}>FAQ</Menu.Item>
              <Menu.Item key="9" onClick={() => { this.setState({ page: 'other' }) }}>Contact Us</Menu.Item>
            </SubMenu>
            <Menu.Item key="2">
              <a href="https://yujunhan1920.wixsite.com/my-site-2" target="_blank" rel="noopener noreferrer" />
              Find Out More
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout-content" style={{ marginLeft: 200, background: '#EEF7F1' }}>
          <Content style={{ margin: '24px 16px 24px', overflow: 'initial', minHeight: '90vh' }}>
            <SetDisplay
              login={this.state.loginStatus}
              page={this.state.page}
              handleLogin={this.handleLogin.bind(this)}
              handleSettings={this.handleSettings.bind(this)}
              tempH={this.state.tempH}
              tempL={this.state.tempL}
              humidH={this.state.humidH}
              humidL={this.state.humidL}
              tvocV={this.state.tvocV}
              eco2V={this.state.eco2V}
              limit={this.state.limit}
            />
          </Content>
          <Footer style={{ textAlign: 'center', height: "10px" }}>created by SWAY(2020 Feb)</Footer>
        </Layout>
      </Layout>
    );
  }
}

function SetDisplay(props) {
  const login = props.login
  const page = props.page
  let handleLogin = props.handleLogin
  let handleSettings = props.handleSettings
  console.log("login" + login)
  console.log("page" + page)
  if (page === "login") {
    if (login === "Login") {
      return <Login handleLogin={handleLogin} />   
    } else {
      return <Dashboard 
        tempH={props.tempH}
        tempL={props.tempL}
        tvocV={props.tvocV}
        eco2V={props.eco2V}
        limit={props.limit}
      />
    }
  } else if (page === "faq") {
    return <FAQ />
  } else if (page === "other") {
    return <Other />
  } else if (page === "profile") {
    return <Profile />
  } else if (page === "setting") {
    return <Settings 
      handleSettings={handleSettings}
      tempH={props.tempH}
      tempL={props.tempL}
      tvocV={props.tvocV}
      eco2V={props.eco2V}
      limit={props.limit}
    />
  }
}

export default App;
