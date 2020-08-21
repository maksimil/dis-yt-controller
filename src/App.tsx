import React from "react";
import List from "./components/List";
import ControlPanel from "./components/ControlPanel";
import StatusBar from "./components/StatusBar";
import VolumeController from "./components/VolumeController";

class App extends React.Component<AppState, AppState> {
  constructor(props: AppState) {
    super(props);

    this.state = props;

    this.state.socket.on("update", (state: State) => {
      this.setState({
        state,
      });
    });
  }

  addtoqueue = (url: string) => {
    this.state.socket.emit("add", url);
  };

  removeelement = (id: string) => {
    this.state.socket.emit("remove", id);
  };

  pause = () => {
    this.state.socket.emit("p");
  };

  skip = () => {
    this.state.socket.emit("skip");
  };

  setvolume = (v: number) => {
    this.state.socket.emit("volume", v);
  };

  render() {
    const { pstatus, queue, channel, volume } = this.state.state;
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <StatusBar channel={channel} volume={volume} />
            </td>
          </tr>
          {volume ? (
            <tr>
              <td>
                <VolumeController volume={volume} setvolume={this.setvolume} />
              </td>
            </tr>
          ) : null}
          <tr>
            <td>
              <ControlPanel
                pstatus={pstatus}
                skip={this.skip}
                pause={this.pause}
              />
            </td>
          </tr>
          <tr>
            <td>
              <List
                queue={queue}
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
