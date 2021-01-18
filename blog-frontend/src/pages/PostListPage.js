import React from 'react';
import Button from '../components/common/Button.js';
import HeaderContainer from '../containers/common/HeaderContainer';
//import PostList from '../components/post/PostList';
import PostListContainer from '../containers/post/PostListContainer';
import PaginationContainer from '../containers/post/PaginationContainer';

const PostListPage = () => {
    return (
    <div>
        <HeaderContainer></HeaderContainer>
        <PostListContainer></PostListContainer>
        <PaginationContainer></PaginationContainer>
    </div>
    )
}

export default PostListPage;