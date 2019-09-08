import { Icon as AntdIcon, Input, Select } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import './Icons.scss';

import { Grid } from '@app/core';

import {
    addIcon,
    filterIcons,
    getDiagramId,
    getFilteredIcons,
    getIconSet,
    getIconSets,
    getIconsFilter,
    IconInfo,
    selectIcons,
    useStore
} from '@app/wireframes/model';

import { Icon } from './Icon';

const keyBuilder = (icon: IconInfo) => {
    return icon.name;
};

export const Icons = () => {
    const dispatch = useDispatch();
    const selectedDiagramId = useStore(s => getDiagramId(s));
    const iconsFiltered = useStore(s => getFilteredIcons(s));
    const iconsFilter = useStore(s => getIconsFilter(s));
    const iconSets = useStore(s => getIconSets(s));
    const iconSet = useStore(s => getIconSet(s));

    const cellRenderer = React.useCallback((icon: IconInfo) => {
        const doAdd = () => {
            if (selectedDiagramId) {
                dispatch(addIcon(selectedDiagramId, icon.text, icon.fontFamily, 100, 100));
            }
        };

        return (
            <div className='asset-icon'>
                <div className='asset-icon-preview' onDoubleClick={doAdd}>
                    <Icon icon={icon} />
                </div>

                <div className='asset-icon-title'>{icon.displayName}</div>
            </div>
        );
    }, [dispatch, selectedDiagramId]);

    const doFilterIcons = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(filterIcons(event.target.value));
    }, [dispatch]);

    const doSelectIcons = React.useCallback((set: string) => {
        dispatch(selectIcons(set));
    }, [dispatch]);

    return (
        <>
            <div className='asset-icons-search'>
                <Input value={iconsFilter} onChange={doFilterIcons} placeholder='Find icon'
                    prefix={
                        <AntdIcon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                />

                <Select value={iconSet} onChange={doSelectIcons}>
                    {iconSets.map(x =>
                        <Select.Option key={x} value={x}>{x}</Select.Option>
                    )}
                </Select>
            </div>

            <Grid className='asset-icons-list' renderer={cellRenderer} columns={3} items={iconsFiltered} keyBuilder={keyBuilder} />
        </>
    );
};