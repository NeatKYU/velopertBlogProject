import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage.js';
import PostPage from './pages/PostPage.js';
import LoginPage from './pages/LoginPage.js';
import WritePage from './pages/WritePage.js';
import RegisterPage from './pages/RegisterPage.js';
import { Helmet } from 'react-helmet-async';

function App() {
  return (
    <div>
      <Helmet>
        <title>REACTERS</title>
      </Helmet>
      <Route component={PostListPage} path={['/@:username', '/']} exact />
      <Route component={PostPage} path='/@:username/:postId' />
      <Route component={LoginPage} path='/login' />
      <Route component={WritePage} path='/write' />
      <Route component={RegisterPage} path='/register' />
    </div>
  );
}

export default App;
