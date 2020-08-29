import React from "react";
import List from "./components/List";
import ControlPanel from "./components/ControlPanel";
import StatusBar from "./components/StatusBar";
import VolumeController from "./components/VolumeController";
import Playlist from "./components/Playlist";
class App extends React.Component<AppProps, AppState> {
  constructor(props: Readonly<AppProps>) {
    super(props);

    this.state = {
      ...props,
      innerstate: {
        lastvalid: true,
      },
    };

    this.state.socket.on("update", (state: State) => {
      this.setState({
        state,
      });
    });

    this.state.socket.on("urlstat", (valid: boolean) => {
      this.setState({
        innerstate: {
          ...this.state.innerstate,
          lastvalid: valid,
        },
      });
    });

    this.state.socket.on("fetch", (data: fetchdata) => {
      this.setState({
        state: {
          ...this.state.state,
          queue: data.queue,
        },
      });
    });
  }

  addtoqueue = (url: string) => {
    this.state.socket.emit("add", url);
  };

  removeelement = (id: string) => {
    this.state.socket.emit("remove", id);
  };

  p = () => {
    this.state.socket.emit("p");
  };

  skip = () => {
    this.state.socket.emit("skip");
  };

  setvolume = (v: number) => {
    this.state.socket.emit("volume", v);
  };

  load = (name: string) => {
    this.state.socket.emit("load", name);
  };

  save = (name: string) => {
    this.state.socket.emit("save", name);
  };

  render() {
    const {
      pstatus,
      queue,
      channel,
      volume,
      turlcache,
      plnames,
    } = this.state.state;
    const { lastvalid } = this.state.innerstate;

    return (
      <>
        <table>
          <tbody>
            <tr>
              <td>
                <StatusBar channel={channel} volume={volume} />
              </td>
            </tr>
            <tr>
              <td>
                <Playlist load={this.load} save={this.save} plnames={plnames} />
              </td>
            </tr>
            {volume !== undefined ? (
              <tr>
                <td>
                  <VolumeController
                    volume={volume}
                    setvolume={this.setvolume}
                  />
                </td>
              </tr>
            ) : null}
            <tr>
              <td>
                <ControlPanel pstatus={pstatus} skip={this.skip} p={this.p} />
              </td>
            </tr>
            <tr>
              <td>
                <List
                  turlcache={turlcache}
                  lastvalid={lastvalid}
                  queue={queue}
                  remove={this.removeelement}
                  add={this.addtoqueue}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}

export default App;
