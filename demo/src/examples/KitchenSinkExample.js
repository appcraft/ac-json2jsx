import React, { useState } from "react";
import Editor from "../Editor";

const KitchenSinkExample = ({ components, renderProps }) => {
  const [showCompany, setShowCompany] = useState(true);
  return (
    <div style={{ maxWidth: 1200, margin: "16px auto", position: "relative" }}>
      <h2>Kitchen sink</h2>
      <div>Random features... Click on the right icon to show an alert.</div>

      <fieldset style={{ maxWidth: 200 }}>
        <div>
          <input
            id="showCompany"
            type="checkbox"
            checked={showCompany}
            onChange={(e) => setShowCompany(e.target.checked)}
          />
          <label className="label-inline" htmlFor="showCompany">
            showCompany
          </label>
        </div>
      </fieldset>
      <Editor
        defaultCode={`<Row style={{backgroundColor: '#fff'}}>
  <Icon name="user" style={{fontSize: 32, padding: 16}}/>
  <View style={{flex: 1}}>
    <Text bold>{firstName} {lastName.toUpperCase()}</Text>
    {showCompany && <Text>{\`\${enterprise} - \${role}\`}</Text>}
    <Row>
      {["red", "green", "blue"].map((v, index) => (
        <Text key={index} color={v} style={{marginRight: 8}}>{v}</Text>
      ))}
    </Row>
  </View>
  <Icon name="chevron-right" onPress={() => alert("ok")} />
</Row>`}
        components={components}
        renderProps={{ ...renderProps, showCompany }}
      />
    </div>
  );
};

export default KitchenSinkExample;
