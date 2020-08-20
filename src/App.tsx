import React from "react";
import axios from "axios";
import List from "./components/List";
import ControlPanel from "./components/ControlPanel";

type AppState = {
  socket: SocketIOClient.Socket;
  queue: {
    url: string;
    id: string;
  }[];
};

class App extends React.Component<AppState, AppState> {
  constructor(props: AppState) {
    super(props);

    this.state = props;

    this.state.socket.on("update", (data: qentry[]) => {
      this.setState({
        queue: data,
      });
    });
  }

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
        <tbody>
          <tr>
            <td>
              <ControlPanel />
            </td>
          </tr>
          <tr>
            <td>
              <List
                queue={this.state.queue}
                remove={this.removeelement}
                add={this.addtoqueue}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default App;
