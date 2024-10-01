
// import './App.css'

// function App() {

//   return (
//     <>
//       <h1>hello welcome to my chat bot</h1>
    
//     </>
//   )
// }

// export default App



import React, { Component } from "react";

class App extends Component {
  // Constructor to initialize state
  constructor(props) {
    super(props);
    this.state = {
      message: "Hello from a Class Component!",
    
    };
   
  }

 
  
  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
