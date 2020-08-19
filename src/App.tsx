import React from "react";
import axios from "axios";
import List from "./components/List";

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
      <List
        queue={this.state.queue}
        remove={this.removeelement}
        add={this.addtoqueue}
      />
    );
  }
}

export default App;
