import React from "react";

class Input extends React.Component<
  {
    add: (s: string) => void;
    lastvalid: boolean;
  },
  { url: string }
> {
  state = {
    url: "",
  };

  render() {
    const { add, lastvalid } = this.props;
    return (
      <tr>
        <td className="text" colSpan={2}>
          <input
            className={lastvalid ? "" : "invalid"}
            type="text"
            value={this.state.url}
            placeholder="url"
            onChange={(e) => {
              this.setState({
                url: e.target.value,
              });
            }}
          />
        </td>
        <td>
          <button
            className="list"
            onClick={() => {
              add(this.state.url);
              this.setState({ url: "" });
            }}
          >
            add
          </button>
        </td>
      </tr>
    );
  }
}

export default Input;
