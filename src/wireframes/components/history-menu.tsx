import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import { Button } from 'antd';
import * as React from 'react';

import './history-menu.css';

import {
    EditorState,
    redo,
    undo,
    UndoableState
} from '@app/wireframes/model';

interface HistoryMenuProps {
    // Indicated if the state can be undo.
    canUndo: boolean;
    // Indicated if the state can be redo.
    canRedo: boolean;

    // Undo the latest action.
    undo: () => void;
    // Redo the latest undone action.
    redo: () => void;
}

const mapStateToProps = (state: { editor: UndoableState<EditorState> }) => {
    return {
        canUndo: state.editor.canUndo,
        canRedo: state.editor.canRedo
    };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
    undo, redo
}, dispatch);

export class HistoryMenu extends React.Component<HistoryMenuProps, {}> {
    public render() {
        return (
            <>
                <Button className='menu-item' size='large'
                    disabled={!this.props.canUndo}
                    onClick={() => this.props.undo()}>
                    <i className='icon-undo' />
                </Button>

                <Button className='menu-item' size='large'
                    disabled={!this.props.canRedo}
                    onClick={() => this.props.redo()}>
                    <i className='icon-redo' />
                </Button>
            </>
        );
    }
}

export const HistoryMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HistoryMenu);