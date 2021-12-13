/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Color, ColorPicker } from '@app/core';
import { texts } from '@app/texts';
import { DefaultAppearance } from '@app/wireframes/interface';
import { getDiagramId, getSelectedItems, getSelectionSet, selectColorTab, useStore } from '@app/wireframes/model';
import { Button, Col, Row, Select } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { UniqueValue, useAppearance } from './../actions';
import './VisualProperties.scss';

export const VisualProperties = React.memo(() => {
    const dispatch = useDispatch();
    const selectionSet = useStore(getSelectionSet);
    const selectedColorTab = useStore(s => s.ui.selectedColorTab);
    const selectedDiagramId = useStore(getDiagramId);
    const selectedItems = useStore(getSelectedItems);

    const [backgroundColor, setBackgroundColor] =
        useAppearance(selectedDiagramId, selectionSet,
            DefaultAppearance.BACKGROUND_COLOR, x => Color.fromValue(x));

    const [fontSize, setFontSize] =
        useAppearance(selectedDiagramId, selectionSet,
            DefaultAppearance.FONT_SIZE);

    const [foregroundColor, setForegroundColor] =
        useAppearance(selectedDiagramId, selectionSet,
            DefaultAppearance.FOREGROUND_COLOR, x => Color.fromValue(x));

    const [strokeColor, setStrokeColor] =
        useAppearance(selectedDiagramId, selectionSet,
            DefaultAppearance.STROKE_COLOR, x => Color.fromValue(x));

    const [strokeThickness, setStrokeThickness] =
        useAppearance(selectedDiagramId, selectionSet,
            DefaultAppearance.STROKE_THICKNESS);

    const [textAlignment, setTextAlignment] =
        useAppearance(selectedDiagramId, selectionSet,
            DefaultAppearance.STROKE_THICKNESS);

    const doSelectColorTab = React.useCallback((key: string) => {
        dispatch(selectColorTab(key));
    }, [dispatch]);

    if (!selectedDiagramId) {
        return null;
    }

    return (
        <>
            <div style={{ display: (selectedItems.length > 0 ? 'block' : 'none') }}>
                <div className='property-subsection visual-properties'>
                    <Row className='property'>
                        <Col span={12} className='property-label'>{texts.common.fontSize}</Col>
                        <Col span={12} className='property-value'>
                            <Select disabled={fontSize.empty} value={fontSize.value?.toString()} onChange={setFontSize}>
                                {DEFINED_FONT_SIZES.map(value =>
                                    <Select.Option key={value.toString()} value={value}>{value}</Select.Option>,
                                )}
                            </Select>
                        </Col>
                    </Row>
                    <Row className='property'>
                        <Col span={12} className='property-label'>{texts.common.strokeThickness}</Col>
                        <Col span={12} className='property-value'>
                            <Select disabled={strokeThickness.empty} value={strokeThickness.value?.toString()} onChange={setStrokeThickness}>
                                {DEFINED_STROKE_THICKNESSES.map(value =>
                                    <Select.Option key={value.toString()} value={value}>{value}</Select.Option>,
                                )}
                            </Select>
                        </Col>
                    </Row>
                    <Row className='property'>
                        <Col span={12} className='property-label'>{texts.common.strokeColor}</Col>
                        <Col span={12} className='property-value'>
                            <ColorPicker activeColorTab={selectedColorTab} disabled={strokeColor.empty} value={strokeColor.value}
                                onChange={setStrokeColor}
                                onActiveColorTabChanged={doSelectColorTab} />
                        </Col>
                    </Row>
                    <Row className='property'>
                        <Col span={12} className='property-label'>{texts.common.foregroundColor}</Col>
                        <Col span={12} className='property-value'>
                            <ColorPicker activeColorTab={selectedColorTab} disabled={foregroundColor.empty} value={foregroundColor.value}
                                onChange={setForegroundColor}
                                onActiveColorTabChanged={doSelectColorTab} />
                        </Col>
                    </Row>
                    <Row className='property'>
                        <Col span={12} className='property-label'>{texts.common.backgroundColor}</Col>
                        <Col span={12} className='property-value'>
                            <ColorPicker activeColorTab={selectedColorTab} disabled={backgroundColor.empty} value={backgroundColor.value}
                                onChange={setBackgroundColor}
                                onActiveColorTabChanged={doSelectColorTab} />
                        </Col>
                    </Row>
                    <Row className='property'>
                        <Col span={12} className='property-label'>{texts.common.textAlignment}</Col>
                        <Col span={12} className='property-value'>
                            <Button.Group className='text-alignment'>
                                <TextButton value={textAlignment} onClick={setTextAlignment}
                                    mode='left' icon='icon-align-left' />

                                <TextButton value={textAlignment} onClick={setTextAlignment}
                                    mode='left' icon='icon-align-center' />

                                <TextButton value={textAlignment} onClick={setTextAlignment}
                                    mode='left' icon='icon-align-right' />
                            </Button.Group>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
});

type TextButtonProps = { mode: any; value: UniqueValue<any>; icon: string; onClick: (tag: any) => void };

const TextButton = React.memo(({ value, mode, icon, onClick }: TextButtonProps) => {
    const type = mode === value.value ? 'primary' : undefined;

    return (
        <Button disabled={value.empty} type={type} onClick={() => onClick(value)}>
            <i className={icon} />
        </Button>
    );
});

const DEFINED_STROKE_THICKNESSES = [1, 2, 4, 6, 8];
const DEFINED_FONT_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60];
