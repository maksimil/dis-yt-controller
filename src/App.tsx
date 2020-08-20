import React from "react";
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
    this.state.socket.emit("add", url);
  };

  removeelement = (id: string) => {
    this.state.socket.emit("remove", id);
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
