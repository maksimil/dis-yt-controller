import React from "react";

class Playlist extends React.Component<
  {
    load: (name: string) => void;
    save: (name: string) => void;
  },
  { name: string }
> {
  state = { name: "" };

  render() {
    const { load, save } = this.props;
    const { name } = this.state;
    return (
      <div className="ccontainer">
        <div className="playlist">
          <input
            className="playlist"
            type="text"
            value={name}
            placeholder="playlist name"
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="cpanel">
          <button
            className="cpanel"
            onClick={() => {
              load(name);
            }}
          >
            load
          </button>
        </div>
        <div className="cpanel">
          <button
            className="cpanel"
            onClick={() => {
              save(name);
            }}
          >
            save
          </button>
        </div>
      </div>
    );
  }
}

export default Playlist;
