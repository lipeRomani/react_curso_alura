import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Home';
import AutorBox from './Autor';
import LivroBox from './Livro';
import NotFound from './error/NotFound';
import './index.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

ReactDOM.render(
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/autor" component={AutorBox}/>
        <Route path="/livro" component={LivroBox} />
        <Route path="*" component={NotFound} />
      </Switch>
    </App>
  </Router>,
  document.getElementById('root')
);
