import './App.css';
import './styles/index.css'
import Counter from './container';
import Main from './pages/main';
function App() {
  return (
    <div className="app">
      <Counter.Provider>
      <Main/>
      </Counter.Provider>
    </div>
  );
}

export default App;
