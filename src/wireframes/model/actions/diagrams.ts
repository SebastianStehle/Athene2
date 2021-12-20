/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Color, MathHelper, Vec2 } from '@app/core';
import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';
import { Diagram, EditorState } from './../internal';
import { createDiagramAction, DiagramRef } from './utils';

export const addDiagram =
    createAction('diagram/add', (diagramId?: string) => {
        return { payload: createDiagramAction(diagramId || MathHelper.guid()) };
    });

export const selectDiagram =
    createAction('diagram/select', (diagram: DiagramRef) => {
        return { payload: createDiagramAction(diagram) };
    });

export const removeDiagram =
    createAction('diagram/remove', (diagram: DiagramRef) => {
        return { payload: createDiagramAction(diagram) };
    });

export const renameDiagram =
    createAction('diagram/rename', (diagram: DiagramRef, title: string) => {
        return { payload: createDiagramAction(diagram, { title }) };
    });

export const changeSize =
    createAction<{ width: number; height: number }>('editor/size');

export const changeColor =
    createAction<{ color: string }>('editor/color');

export function buildDiagrams(builder: ActionReducerMapBuilder<EditorState>) {
    return builder
        .addCase(selectDiagram, (state, action) => {
            const { diagramId } = action.payload;

            return state.selectDiagram(diagramId);
        })
        .addCase(renameDiagram, (state, action) => {
            const { diagramId, title } = action.payload;

            return state.updateDiagram(diagramId, diagram => diagram.rename(title));
        })
        .addCase(removeDiagram, (state, action) => {
            const { diagramId } = action.payload;

            return state.removeDiagram(diagramId);
        })
        .addCase(changeSize, (state, action) => {
            const { width, height } = action.payload;

            return state.changeSize(new Vec2(width, height));
        })
        .addCase(changeColor, (state, action) => {
            const { color } = action.payload;

            return state.changeColor(Color.fromString(color));
        })
        .addCase(addDiagram, (state, action) => {
            const { diagramId } = action.payload;

            let newState = state.addDiagram(Diagram.empty(diagramId));

            if (newState.diagrams.size === 1) {
                newState = newState.selectDiagram(diagramId);
            }

            return newState;
        });
}
