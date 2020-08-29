import React from "react";

class Playlist extends React.Component<
  {
    load: (name: string) => void;
    save: (name: string) => void;
    plnames: string[];
  },
  {
    name: string;
    focused: boolean;
  }
> {
  state = {
    name: "",
    focused: false,
  };

  inputref: React.RefObject<HTMLInputElement> = React.createRef();

  render() {
    const { load, save, plnames } = this.props;
    const { name, focused } = this.state;
    return (
      <div className="ccontainer">
        <div className="playlist">
          <input
            ref={this.inputref}
            className="playlist"
            type="text"
            value={name}
            placeholder="playlist name"
            onChange={(e) => this.setState({ name: e.target.value })}
            onFocus={(e) => {
              this.setState({ focused: true });
            }}
            onBlur={(e) => {
              this.setState({ focused: false });
            }}
          />
          {focused ? (
            <table
              className="autocomplete"
              style={{
                width: `${
                  this.inputref.current?.getBoundingClientRect().width
                }px`,
              }}
            >
              <tbody>
                {plnames
                  .filter((elname) => elname.startsWith(name))
                  .map((elname) => {
                    return (
                      <tr className="autocompleteelement" key={elname}>
                        <td
                          onMouseEnter={() => {
                            this.setState({ name: elname });
                          }}
                        >
                          {elname}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <></>
          )}
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
