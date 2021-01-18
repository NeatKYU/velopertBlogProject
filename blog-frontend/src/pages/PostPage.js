import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
//import PostViewer from '../components/post/PostViewer';
import PostViewerContainer from '../containers/post/PostViewerContainer';

const PostPage = () => {
    return (
        <>
            <HeaderContainer></HeaderContainer>
            <PostViewerContainer></PostViewerContainer>
        </>
    )
}

export default PostPage;