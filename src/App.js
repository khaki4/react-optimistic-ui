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
    // 1) Immediately indicate lodaing
    this.setState({loading: true});
    deleteItemRequest(id)
      .then(() => {
        this.setState(state => ({
          // 2) Update state
          items: state.items.filter(item => item.id !== id),
          // stop loading
          loading: false,
        }));
      })
      .catch(() => this.setState({
        error: `Request failed for item ${id}`,
        loading: false,
      }))
  };

  deleteItemOpticistic = (id) => {
    // 1) Snapshot target item so we can restore it in the case of failure
    const deletingItem = this.state.items.find(item => item.id === id);

    // 1) Assume scuess. Immediately update state
    this.setState(state => ({
      items: state.items.filter(item => item.id !== id),
    }));

    // 2b) If the request failed revert state and display error.
    deleteItemRequest(id)
      .catch(() => this.setState((state => ({
        // Restore the single, deleted item.
        // Use sort to ensure it is inserted where expected.
        items: [...state.items, deletingItem].sort((a, b) => a.id - b.id),
        error: `Reqeust failed for item ${id}`,
      }))));
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
              <button onClick={() => this.deleteItemOpticistic(item.id)}>
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
