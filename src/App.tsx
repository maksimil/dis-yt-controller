import React from "react";
import Input from "./components/Input";
import QueueElement from "./components/QueueElement";

class App extends React.Component<{}, { queue: string[] }> {
  state = {
    queue: [],
  };

  addtoqueue = (url: string) => {
    this.setState({
      queue: [url, ...this.state.queue],
    });
  };

  removeelement = (url: string) => {
    this.setState({
      queue: this.state.queue.filter((e) => e !== url),
    });
  };

  render() {
    return (
      <table>
        <thead>
          <Input add={this.addtoqueue} />
        </thead>
        <tbody>
          {this.state.queue.map((e) => (
            <QueueElement url={e} remove={() => this.removeelement(e)} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default App;
