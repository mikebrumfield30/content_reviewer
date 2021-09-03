import logo from './logo.svg';
import {Button} from 'react-bootstrap' 
import Plant from './components/Plant';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ReviewList from './components/ReviewList';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
            <ReviewList></ReviewList>
        </Route>
        <Route path="/plant/:plantName/:plantURI">
          <Plant></Plant>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
