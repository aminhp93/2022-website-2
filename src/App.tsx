import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Stock from './pages/Stock/Stock'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/stock">
              <Stock />
            </Route>
            <Route path="/">
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/stock">Stock</Link>
                  </li>
                </ul>
              </nav>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
