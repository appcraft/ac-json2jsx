import React, { Component } from 'react';
import './App.css';

import FontAwesome from 'react-fontawesome'
import Editor from './Editor'

const Row = ({children, style={}, ...props}) => (
  <div {...props} style={{...style, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    {children}
  </div>
)
const Col = ({children, style={}, ...props}) => <div {...props} style={{...style, display: 'flex', flexDirection: 'column'}}>{children}</div>

const View = ({children, ...props}) => <div {...props}>{children}</div>
const Text = ({children, style={}, color, bold, ...props}) => (
  <div {...props} style={{...style, color, fontWeight: bold ? "bold" : undefined}}>{children}</div>
)

const Icon = ({onPress, ...props}) => <FontAwesome {...props} onClick={onPress} />

const components = {
  View, Text, Icon,
  Row, Col
}



class App extends Component {

  render() {

    const Colors = {
      title: "#f00",
      id: "#f00",
    }
    const Config = {
      showId: true
    }

    const renderProps = {
      Colors, 
      Config,
      firstName:"John" ,
      lastName:"Doe",
      enterprise:"AppCraft",
      role:"Tester",
      user:{id: 123}, 
      alert:alert
    }

    return (
      <div className="App">
        <h1>JSON 2 JSX demo</h1>
        <div style={{maxWidth: 1200, margin: '0 auto', position: 'relative'}}>
          <h2>Basic example</h2>
          <Editor defaultCode={`
<div>Hello world</div>
`} components={components} renderProps={renderProps} />
        </div>

        <div style={{maxWidth: 1200, margin: '0 auto', position: 'relative'}}>
          <h2>Passing props</h2>
          <Editor defaultCode={`<Row>
  {Config.showId ? <Text color={Colors.id}>{user.id}</Text> : <Text>NO ID</Text>}
  <Icon name="user" style={{fontSize: 32, padding: 16}}/>
  <View style={{flex: 1}}>
    <Text bold>Hello {firstName} {lastName.toUpperCase() + " !"}</Text>
    <Text>{` + "`from ${enterprise} - ${role}`" + `}</Text>
    {["foo", "bar"].map((el, index) => <Text key={index}>{el}</Text>)}
  </View>
  <Icon name="chevron-right" style={{fontSize: 32, padding: 16}}
        onPress={() => alert("ok")}/>
</Row>`} components={components} renderProps={renderProps} />
        </div>
      </div>
    );
  }
}

export default App;
