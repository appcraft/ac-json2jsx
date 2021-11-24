import React from "react";
import Editor from "../Editor";

const ComponentsExample = ({ components, renderProps }) => {
  return (
    <div style={{ maxWidth: 1200, margin: "16px auto", position: "relative" }}>
      <h2>Passing components</h2>
      <div>
        A few custom components are passed to the renderer. This makes json2jsx
        compatible with react-native or any other implementation.
      </div>
      <div>
        Components passed : <code>Row</code>, <code>View</code>,{" "}
        <code>Text</code>, <code>Icon</code>
      </div>
      <Editor
        defaultCode={`<Row style={{backgroundColor: '#fff'}}>
  <Icon name="user" style={{fontSize: 32, padding: 16}}/>
  <View style={{flex: 1}}>
    <Text bold>{firstName} {lastName.toUpperCase()}</Text>
    <Text>{\`\${enterprise} - \${role}\`}</Text>
  </View>
  <Icon name="chevron-right" />
</Row>`}
        components={components}
        renderProps={renderProps}
      />
    </div>
  );
};

export default ComponentsExample;
