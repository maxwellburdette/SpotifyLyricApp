import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard'

const code = new URLSearchParams(window.location.search).get('code');
function App() {
  return (
    code ? <Dashboard code={code} ></Dashboard> : <Login />
  );
}

export default App;
