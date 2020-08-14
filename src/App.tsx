import React from "react";
import Input from "./components/Input";

class App extends React.Component<{}, { queue: string[] }> {
  state = {
    queue: [],
  };

  addtoqueue = (url: string) => {
    this.setState({
      queue: [...this.state.queue, url],
    });
  };

  render() {
    return (
      <table>
        <thead>
          <Input add={this.addtoqueue} />
        </thead>
        <tbody></tbody>
      </table>
    );
  }
}

export default App;
