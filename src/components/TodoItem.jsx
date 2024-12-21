import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TodoDisplay from './TodoDisplay';
import './TodoItem.css'; 

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButtons: false,
      isEditing: false,
      updatedTitle: props.todo.title,
      updatedDescription: props.todo.description,
      updatedImportance: props.todo.importance, 
      error: '', 
    };
  }

  handleMouseEnter = () => {
    this.setState({ showButtons: true });
  };

  handleMouseLeave = () => {
    this.setState({ showButtons: false });
  };

  handleEdit = () => {
    const { todo, onEdit } = this.props;
    const { updatedTitle, updatedDescription, updatedImportance } = this.state;

    if (updatedTitle.startsWith(' ') || updatedTitle.endsWith(' ') || !updatedTitle.trim()) {
      this.setState({ error: 'Title cannot start, end with spaces, or be empty.' });
      return;
    }

    const updatedTodo = {
      ...todo,
      title: updatedTitle,
      description: updatedDescription,
      importance: updatedImportance, 
    };
    onEdit(updatedTodo);
    this.setState({ isEditing: false, error: '' }); 
  };

  render() {
    const { todo, onToggle, onDelete } = this.props;
    const { showButtons, isEditing, updatedTitle, updatedDescription, updatedImportance, error } = this.state;

    return (
      <li
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className="todo-item" 
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      >
        <input type="checkbox" checked={todo.completed} onChange={onToggle} />

        {isEditing ? (
          <div>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => this.setState({ updatedTitle: e.target.value })}
            />
            <textarea
              value={updatedDescription}
              onChange={(e) => this.setState({ updatedDescription: e.target.value })}
            />
            <select
              value={updatedImportance}
              onChange={(e) => this.setState({ updatedImportance: e.target.value })}
            >
              <option value="Не важно">Не важно</option>
              <option value="Средне">Средне</option>
              <option value="Очень важно">Очень важно</option>
            </select>
            <button onClick={this.handleEdit}>Save</button>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Отображение ошибки */}
          </div>
        ) : (
          <div className="todo-content">
            <TodoDisplay todo={todo} />
            {showButtons && (
              <div className="button-container">
                <button onClick={() => this.setState({ isEditing: true })}>Edit</button>
                <button onClick={() => onDelete(todo.id)}>Delete</button>
              </div>
            )}
          </div>
        )}
      </li>
    );
  }
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    importance: PropTypes.string.isRequired, 
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TodoItem;
