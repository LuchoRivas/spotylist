// eslint-disable-next-line @typescript-eslint/no-unused-vars

export function App() {
  const onLoginClicked = async () => {
    fetch(`${process.env.API_BASE_URL}/login`)
      .then()
      .catch((reject) => {
        console.log('rejected', reject);
      });
  };

  return (
    <div className="App">
    </div>
  );
}

export default App;
