import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Topbar from './components/Topbar';
import Home from './components/Home';
import Workmap from './components/Workmap'; 

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Topbar/>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/workmap" component={Workmap} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
