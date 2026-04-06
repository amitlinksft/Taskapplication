import './TaskList.css';

export default function TaskList({ tasks, loading, onEdit, onDelete, onToggleStatus }) {
  if (loading) {
    return <div className="task-list-loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className={`task-card ${task.status === 'Completed' ? 'completed' : ''} ${task.is_overdue ? 'overdue' : ''}`}>
          <div className="task-left">
            <button
              className={`status-toggle ${task.status === 'Completed' ? 'done' : ''}`}
              onClick={() => onToggleStatus(task)}
              title={task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
            >
              {task.status === 'Completed' ? '\u2713' : ''}
            </button>
            <div className="task-info">
              <h3 className="task-title">{task.title}</h3>
              {task.description && <p className="task-desc">{task.description}</p>}
              <div className="task-meta">
                {task.category_detail && (
                  <span className="task-category" style={{ background: task.category_detail.color + '20', color: task.category_detail.color }}>
                    {task.category_detail.symbol} {task.category_detail.name}
                  </span>
                )}
                {task.due_date && (
                  <span className={`task-due ${task.is_overdue ? 'overdue-text' : ''}`}>
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
                <span className={`task-status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
            </div>
          </div>
          <div className="task-actions">
            <button className="btn-edit" onClick={() => onEdit(task)} title="Edit">Edit</button>
            <button className="btn-delete" onClick={() => onDelete(task.id)} title="Delete">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
