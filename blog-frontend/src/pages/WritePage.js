import React from 'react';
//import Editor from '../components/write/Editor';
import EditorContainer from '../containers/write/EditorContainer';
import Responsive from '../components/common/Responsive';
//import TagBox from '../components/write/TagBox';
import TagBoxContainer from '../containers/write/TagBoxConatiner';
//import WriteActionButtons from '../components/write/WriteActionButtons';
import WriteActionButtonContainer from '../containers/write/WriteActionButtonsContainer';
import { Helmet } from 'react-helmet-async';

const WritePage = () => {
    return (
        <Responsive>
            <Helmet>
                <title>글 작성하기 - REACTERS</title>
            </Helmet>
            <EditorContainer></EditorContainer>
            <TagBoxContainer></TagBoxContainer>
            <WriteActionButtonContainer></WriteActionButtonContainer>
        </Responsive>
    )
}

export default WritePage;