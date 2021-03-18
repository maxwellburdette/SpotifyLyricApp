import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard'
import './App.css';

const code = new URLSearchParams(window.location.search).get('code');
function App() {
  return (
    <div className="app" style={{backgroundColor: '#333'}}>
      {code ? <Dashboard code={code} ></Dashboard> : <Login />}
    </div>
  );
}

export default App;