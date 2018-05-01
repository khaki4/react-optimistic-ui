import React, {Component} from 'react';

// Fake request. Fail for id 3

function deleteItemRequest(id) {
  return new Promise((resolve, reject) => {
    setTimeout(id === 3 ? reject : resolve, 750);
  })
}

class App extends Component {
  state = {
    items: Array.from(Array(5), (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
    })),
    loading: false,
    error: null,
  };

  deleteItem = id => {
    this.setState({loading: true});
    deleteItemRequest(id)
      .then(() => {
        this.setState(state => ({
          items: state.items.filter(item => item.id !== id),
          loading: false,
        }));
      })
      .catch(() => this.setState({
        error: `Request failed for item ${id}`,
        loading: false,
      }))
  };

  render() {
    const {items, loading, error} = this.state;
    return (
      <div>
        <h4>Async UI updates in React using setState()</h4>
        <ul style={{opacity: loading ? 0.6 : 1}}>
          {items.map(item => (
            <li key={item.id}>
              {item.title}
              <button onClick={() => this.deleteItem(item.id)}>
                Delete item
              </button>
            </li>
          ))}
        </ul>
        {error && <p>{error}</p>}
      </div>
    );
  }
}

export default App;
