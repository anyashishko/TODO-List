import React from 'react';
import TodoList from './components/TodoList';
import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      title: '',
      description: '',
      showIncomplete: false,
      error: '',
      importance: 'Not important',
      importanceFilter: [],
      searchTerm: '',
    };
  }

  handleAddTodo = () => {
    const { title, description, importance } = this.state;
    if (title.startsWith(' ') || title.endsWith(' ')) {
      this.setState({ error: 'Title cannot start or end with spaces!' });
      return;
    } else if (!title.trim()) {
      this.setState({ error: 'Title cannot be empty.' });
      return;
    }

    const newTodo = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toLocaleString(),
      importance,
    };

    this.setState((prevState) => ({
      todos: [newTodo, ...prevState.todos],
      title: '',
      description: '',
      importance: 'Not important',
      error: '',
    }));
  };

  handleGenerateTodos = () => {
    const importanceOptions = ['Not important', 'Medium', 'Very important'];

    const newTodos = Array.from({ length: 1000 }, (_, index) => ({
      id: Date.now() + index,
      title: `Task ${index + 1}`,
      description: `Description for task ${index + 1}`,
      completed: false,
      createdAt: new Date().toLocaleString(),
      importance: importanceOptions[Math.floor(Math.random() * importanceOptions.length)],
    }));

    this.setState((prevState) => ({
      todos: [...prevState.todos, ...newTodos],
    }));
  };

  handleToggleTodo = (id) => {
    this.setState((prevState) => {
      const updatedTodos = prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      const completedTodos = updatedTodos.filter(todo => todo.completed);
      const incompleteTodos = updatedTodos.filter(todo => !todo.completed);

      return { todos: [...incompleteTodos, ...completedTodos] };
    });
  };

  handleDeleteTodo = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== id),
    }));
  };

  handleEditTodo = (updatedTodo) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      ),
    }));
  };

  handleImportanceChange = (e) => {
    this.setState({ importance: e.target.value });
  };

  handleImportanceFilterChange = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => {
      if (checked) {
        return { importanceFilter: [...prevState.importanceFilter, value] };
      } else {
        return {
          importanceFilter: prevState.importanceFilter.filter((imp) => imp !== value),
        };
      }
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { todos, title, description, showIncomplete, error, importanceFilter, importance, searchTerm } = this.state;

    const filteredByImportance = importanceFilter.length > 0
      ? todos.filter(todo => importanceFilter.includes(todo.importance))
      : todos;

    const filteredByCompletion = showIncomplete
      ? filteredByImportance.filter(todo => !todo.completed)
      : filteredByImportance;

    const filteredBySearch = filteredByCompletion.filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="app-container">
        <h1>TODO List</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => this.setState({ title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => this.setState({ description: e.target.value })}
        />
        <select value={importance} onChange={this.handleImportanceChange}>
          <option value="Not important">Not important</option>
          <option value="Medium">Medium</option>
          <option value="Very important">Very important</option>
        </select>
        <button onClick={this.handleAddTodo}>Add</button>
        <button onClick={this.handleGenerateTodos}>Generate 1000 tasks</button>

        {error && <div className="error">{error}</div>}

        <div>
          <h3 style={{ marginBottom: '-0.05rem' }}>Filter: incomplete tasks</h3>
          <label >
            <input
              type="checkbox"
              checked={showIncomplete}
              onChange={(e) => this.setState({ showIncomplete: e.target.checked })}
            />
            Show only incomplete tasks
          </label>
        </div>

        <div>
          <h3 style={{ marginBottom: '-0.05rem' }}>Importance Filter</h3>
          <label>
            <input
              type="checkbox"
              value="Not important"
              checked={importanceFilter.includes("Not important")}
              onChange={this.handleImportanceFilterChange}
            />
            Not important
          </label>
          <label>
            <input
              type="checkbox"
              value="Medium"
              checked={importanceFilter.includes("Medium")}
              onChange={this.handleImportanceFilterChange}
            />
            Medium
          </label>
          <label>
            <input
              type="checkbox"
              value="Very important"
              checked={importanceFilter.includes("Very important")}
              onChange={this.handleImportanceFilterChange}
            />
            Very important
          </label>
        </div>

        {todos.length > 0 && (
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={this.handleSearchChange}
            style={{ marginTop: '2rem' }}
          />
        )}

        {filteredBySearch.length === 0 && todos.length > 0 && <div className="error">Nothing found for your criteria.</div>}

        <TodoList
          todos={filteredBySearch}
          onToggle={this.handleToggleTodo}
          onDelete={this.handleDeleteTodo}
          onEdit={this.handleEditTodo}
        />
      </div>
    );
  }
}

export default App;
