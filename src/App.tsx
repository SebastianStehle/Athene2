import { Button, Collapse, Layout, Tabs } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
    ArrangeMenu,
    ClipboardMenu,
    CustomPropertiesContainer,
    EditorViewContainer,
    HistoryMenu,
    Icons,
    LayoutProperties,
    LoadingMenu,
    LockMenu,
    Shapes,
    UIMenu,
    VisualProperties
} from '@app/wireframes/components';

import {
    loadDiagramAsync,
    newDiagram,
    selectTab,
    toggleLeftSidebar,
    toggleRightSidebar,
    UIStateInStore
} from '@app/wireframes/model';

interface AppOwnProps {
    // The read token of the diagram.
    token: string;
}

interface AppProps {
    // Show left sidebar.
    showLeftSidebar: boolean;

    // Show right sidebar.
    showRightSidebar: boolean;

    // The selected tabs
    selectedTab: string;

    // Select a tab.
    selectTab: (key: string) => any;

    // Show or hide the left sidebar.
    toggleLeftSidebar: () =>  any;

    // Show or hide the right sidebar.
    toggleRightSidebar: () =>  any;

    // Creates a new diagram.
    newDiagram: (navigate: boolean) =>  any;

    // Load a diagram.
    loadDiagramAsync: (token: string, navigate: boolean) => any;
}

const mapStateToProps = (state: UIStateInStore, props: AppOwnProps) => {
    return {
        selectedTab: state.ui.selectedTab,
        showLeftSidebar: state.ui.showLeftSidebar,
        showRightSidebar: state.ui.showRightSidebar
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    loadDiagramAsync,
    newDiagram,
    toggleLeftSidebar,
    toggleRightSidebar,
    selectTab
}, dispatch);

const logo = require('./images/logo-square-64.png');

class App extends React.PureComponent<AppProps & AppOwnProps> {
    constructor(props: AppProps & AppOwnProps) {
        super(props);

        props.newDiagram(false);

        if (props.token && props.token.length > 0) {
            props.loadDiagramAsync(props.token, false);
        }
    }

    public componentWillReceiveProps(props: AppProps & AppOwnProps) {
        if (this.props.token !== props.token) {
            if (props.token && props.token.length > 0) {
                props.loadDiagramAsync(props.token, false);
            } else {
                props.newDiagram(false);
            }
        }
    }

    private doSelectTab = (key: string) => {
        this.props.selectTab(key);
    }

    private doToggleLeftSidebar = () => {
        this.props.toggleLeftSidebar();
    }

    private doToggleRightSidebar = () => {
        this.props.toggleRightSidebar();
    }

    public render() {
        const { selectedTab, showLeftSidebar, showRightSidebar } = this.props;

        return (
            <Layout>
                <Layout.Header>
                    <img className='logo' src={logo} alt='mydraft.cc' />

                    <HistoryMenu />
                    <span className='menu-separator' />

                    <LockMenu />
                    <span className='menu-separator' />

                    <ArrangeMenu />
                    <span className='menu-separator' />

                    <ClipboardMenu />
                    <span className='menu-separator' />

                    <UIMenu />

                    <span style={{ float: 'right' }}>
                        <LoadingMenu />
                    </span>
                </Layout.Header>
                <Layout className='content'>
                    <Layout.Sider width={320} className='sidebar-left'
                        collapsed={!showLeftSidebar}
                        collapsedWidth={0}>

                        <Tabs type='card' onTabClick={this.doSelectTab} activeKey={selectedTab}>
                            <Tabs.TabPane key='shapes' tab='Shapes'>
                                <Shapes />
                            </Tabs.TabPane>
                            <Tabs.TabPane key='icons' tab='Icons'>
                                <Icons />
                            </Tabs.TabPane>
                        </Tabs>
                    </Layout.Sider>
                    <Layout.Content className='editor-content'>
                        <EditorViewContainer spacing={40} />
                    </Layout.Content>
                    <Layout.Sider width={330} className='sidebar-right'
                        collapsed={!showRightSidebar}
                        collapsedWidth={0}>

                        <Collapse bordered={false} defaultActiveKey={['layout', 'visual', 'custom']}>
                            <Collapse.Panel key='layout' header='Layout'>
                                <LayoutProperties />
                            </Collapse.Panel>
                            <Collapse.Panel key='visual' header='Visual'>
                                <VisualProperties />
                            </Collapse.Panel>
                            <Collapse.Panel key='custom' header='Custom'>
                                <CustomPropertiesContainer />
                            </Collapse.Panel>
                        </Collapse>
                    </Layout.Sider>

                    <Button icon={toggleIcon(showLeftSidebar)}
                        className={toggleClass(showLeftSidebar, 'left')}
                        size='small'
                        shape='circle'
                        onClick={this.doToggleLeftSidebar} />

                    <Button icon={toggleIcon(!showRightSidebar)}
                        className={toggleClass(showRightSidebar, 'right')}
                        size='small'
                        shape='circle'
                        onClick={this.doToggleRightSidebar} />
                </Layout>
            </Layout>
        );
    }
}

const toggleIcon = (left: boolean) => {
    return left ? 'left' : 'right';
};

const toggleClass = (visible: boolean, side: string) => {
    return `toggle-button-${side}` + (visible ? ' visible' : '');
};

export const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);