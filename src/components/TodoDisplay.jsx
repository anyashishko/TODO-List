
import React from 'react';
import PropTypes from 'prop-types';

const TodoDisplay = ({ todo }) => {
    return (
        <div>
            <h3 className="note-text">{todo.title}</h3>
            <p className="note-text">{todo.description}</p>
            <p>Importance: {todo.importance}</p>
            <p>Created at: {todo.createdAt}</p>
        </div>
    );
};

TodoDisplay.propTypes = {
    todo: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        importance: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default TodoDisplay;
