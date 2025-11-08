import React, { useState, useEffect } from 'react';
import './GoalsTracker.css';

const GoalsTracker = ({ userId }) => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        target_date: '',
        status: 'in_progress',
        progress: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGoals();
    }, [userId]);

    const fetchGoals = async () => {
        try {
            const response = await fetch(`/api/goals/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch goals');
            }
            const data = await response.json();
            setGoals(data);
        } catch (err) {
            setError('Error loading goals');
            console.error('Error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newGoal,
                    user_id: userId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create goal');
            }

            await fetchGoals();
            setNewGoal({
                title: '',
                description: '',
                target_date: '',
                status: 'in_progress',
                progress: 0
            });
        } catch (err) {
            setError('Error creating goal');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (goalId, progress) => {
        try {
            const goalToUpdate = goals.find(g => g.id === goalId);
            if (!goalToUpdate) return;

            const response = await fetch(`/api/goals/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...goalToUpdate,
                    progress: progress,
                    status: progress === 100 ? 'completed' : 'in_progress'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update goal');
            }

            await fetchGoals();
        } catch (err) {
            setError('Error updating goal');
            console.error('Error:', err);
        }
    };

    const deleteGoal = async (goalId) => {
        try {
            const response = await fetch(`/api/goals/${goalId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete goal');
            }

            await fetchGoals();
        } catch (err) {
            setError('Error deleting goal');
            console.error('Error:', err);
        }
    };

    return (
        <div className="goals-tracker">
            <h2>Recovery Goals</h2>
            
            <form onSubmit={handleSubmit} className="goal-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Goal Title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        value={newGoal.target_date}
                        onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Goal'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="goals-list">
                {goals.map((goal) => (
                    <div key={goal.id} className="goal-card">
                        <h3>{goal.title}</h3>
                        <p>{goal.description}</p>
                        <p><strong>Target Date:</strong> {new Date(goal.target_date).toLocaleDateString()}</p>
                        <div className="progress-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={goal.progress}
                                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                            />
                            <span>{goal.progress}%</span>
                        </div>
                        <button 
                            onClick={() => deleteGoal(goal.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsTracker;