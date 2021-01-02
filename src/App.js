import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './components/Auth'; 
import Topbar from './components/Topbar';
import Landing from './components/Landing';
import Home from './components/Home';
import Workmap from './components/Workmap';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Topbar/>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/home" component={Home} />
            <Route path="/workmap" component={Workmap} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
