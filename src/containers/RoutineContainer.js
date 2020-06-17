import React, { Component } from 'react';
import { API_ROOT } from './Constraints'
import RoutineCard from '../components/RoutineCard';
import RoutineForm from '../components/RoutineForm'
import WorkoutCard from '../components/WorkoutCard'
import { BrowserRouter as Router, Route } from 'react-router-dom';


class RoutineContainer extends Component {

  state = {
    routines:[],
    routineExercises: []
  }

  componentDidMount() {
    this.fetchRoutines()
  }

  // Hard coded user.id
  fetchRoutines = () => {
    fetch(API_ROOT + '/users/2/routines')
    .then(resp => resp.json())
    .then(data => this.setState({routines:data}))
  }

  renderRoutines = () => {
    const { routines } = this.state
    return routines.map(routine => {
      return <RoutineCard 
        routine={routine} 
        key={routine.id} 
        workouts={routine.workouts} 
        onDeleteRoutine={this.deleteRoutine} 
        onShowRoutine={this.showRoutine}
      />
    })
  }

  showRoutine = (routineId) => {
    const { routines } = this.state
    return routines.map(routine => {
      if (routine.id === routineId) {
        this.setState({routineExercises: routine.workouts}, this.renderWorkouts)
      }
    })
  }

  renderWorkouts = () => {
    const { routineExercises } = this.state
    return routineExercises.map(workout => {
      return <WorkoutCard 
        workout={workout}
        key={workout.id}
        onEditWorkout={this.editWorkout}
      />
    })
  }

  // PATCH Workout
  editWorkout = (workout) => {
    // Patch Workout
    fetch(API_ROOT + `users/2/workouts/${workout.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        reps: workout.reps,
        sets: workout.sets,
        weight: workout.weight
      })
    })
    .then(resp => resp.json())
    .then(() => {
        this.setState(prevState => {
          return { 
            routineExercises: [...prevState.routineExercises],
            routines: [...prevState.routines]
          }
        })
      })
    }

  // POST Routine
  addRoutine = (routine) => {
    fetch(API_ROOT + '/routines', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify(routine)
    })
    .then(resp => resp.json())
    .then(data => {
      this.setState(prev => {
      return {routines: [...prev.routines, data]}
      })
    })
  }

  // DELETE Routine
  deleteRoutine = (routineId) => {
    fetch(API_ROOT + `/users/2/routines/${routineId}`, {method: 'DELETE'})
    .then(() => {
      this.setState(prevState => {
        return {routines: prevState.routines.filter(routine => routine.id !== routineId)}
      })
    })
  }


  render() {
    return (
      <div className='routine-collection'>
        <Router>
          <div>
            {this.renderWorkouts()}
          </div>
          <div>
            <RoutineForm onAddRoutine={this.addRoutine} />
          </div>
          <div>
            <h3>Routines: </h3>
            {this.renderRoutines()}
          </div>
        </Router>
      </div>
    )
  }
};

export default RoutineContainer;