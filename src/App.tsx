import styles from "./App.module.scss";
import ChartPanel from "./components/ChartPanel";

const App = () => {
  return (
    <div className={styles.app}>
      <header>
        <h1>DeTrade Chart Panel</h1>
        <p>Interactive Bitcoin Price Chart with Live Data</p>
      </header>
      <main>
        <ChartPanel />
      </main>
    </div>
  );
};

export default App;
