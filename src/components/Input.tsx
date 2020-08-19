import React from "react";

class Input extends React.Component<
  { add: (s: string) => void },
  { url: string }
> {
  state = {
    url: "",
  };

  render() {
    return (
      <tr>
        <td className="text">
          <input
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
            onClick={() => {
              this.props.add(this.state.url);
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
