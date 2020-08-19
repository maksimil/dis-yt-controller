import React from "react";
import Input from "./components/Input";
import QueueElement from "./components/QueueElement";
import axios from "axios";

type AppState = {
  queue: {
    url: string;
    id: string;
  }[];
};

class App extends React.Component<{ state: AppState }, AppState> {
  state = this.props.state;

  addtoqueue = (url: string) => {
    axios.put("http://localhost:5000/add", `url=${url}`).then((res) => {
      this.setState({ queue: res.data });
    });
  };

  removeelement = (id: string) => {
    axios.put(`http://localhost:5000/remove`, `id=${id}`).then((res) => {
      this.setState({ queue: res.data });
    });
  };

  render() {
    return (
      <table>
        <thead>
          <Input add={this.addtoqueue} />
        </thead>
        <tbody>
          {this.state.queue.reverse().map((e) => (
            <QueueElement
              key={e.id}
              url={e.url}
              remove={() => this.removeelement(e.id)}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

export default App;
