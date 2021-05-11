import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Topbar from './components/Topbar/Topbar';
import Landing from './components/Landing/Landing';
import Home from './components/Home/Home';
import Workmap from './components/Workmap/Workmap';
import TakeABreak from './components/TakeABreak/TakeABreak';
import { firebaseAuth } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import store from './redux/store';
import { Provider } from 'react-redux';

function App() {
  const [user, loading, error] = useAuthState(firebaseAuth);

  if (loading) {
    return <div className="App"></div>
  } else if (error) {
    return <div className="App">Oops, an error occurred</div>;
  } else {
    return (
      <Provider store={store}>
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
      </Provider>
    );
  }
}

export default App;
