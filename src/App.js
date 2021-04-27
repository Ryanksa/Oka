import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './auth'; 
import Topbar from './components/Topbar/Topbar';
import Landing from './components/Landing/Landing';
import Home from './components/Home/Home';
import Workmap from './components/Workmap/Workmap';
import TakeABreak from './components/TakeABreak/TakeABreak';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Topbar/>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/home" component={Home} />
            <Route path="/workmap" component={Workmap}/>
            <Route path="/takeabreak" component={TakeABreak} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
