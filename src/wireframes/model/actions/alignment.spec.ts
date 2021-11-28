/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Vec2 } from '@app/core';
import { alignItems, AlignmentMode, buildAlignment, Diagram, DiagramItem, EditorState } from '@app/wireframes/model';
import { createClassReducer } from './utils';

/* eslint-disable @typescript-eslint/naming-convention */

describe('AlignmentReducer', () => {
    const shape1 = DiagramItem.createShape('1', 'btn', 20, 20).transformWith(t => t.moveTo(new Vec2(100, 100)));
    const shape2 = DiagramItem.createShape('2', 'btn', 40, 40).transformWith(t => t.moveTo(new Vec2(200, 200)));
    const shape3 = DiagramItem.createShape('3', 'btn', 80, 80).transformWith(t => t.moveTo(new Vec2(300, 300)));

    const diagram =
        Diagram.empty('1')
            .addVisual(shape1)
            .addVisual(shape2)
            .addVisual(shape3);

    const state =
        EditorState.empty()
            .addDiagram(diagram);

    const reducer = createClassReducer(state, builder => buildAlignment(builder));

    it('should return same state if action is unknown', () => {
        const action = { type: 'UNKNOWN' };

        const state_1 = EditorState.empty();
        const state_2 = reducer(state_1, action);

        expect(state_2).toBe(state_1);
    });

    it('should return same state if action has unknown alignment type', () => {
        const action = alignItems('UNKNOWN' as any, diagram, []);

        const state_1 = EditorState.empty();
        const state_2 = reducer(state_1, action);

        expect(state_2).toBe(state_1);
    });

    it('should align to horizontally left', () => {
        expectPositionsAfterAlignment(AlignmentMode.HorizontalLeft, [new Vec2(100, 100), new Vec2(110, 200), new Vec2(130, 300)]);
    });

    it('should align to horizontally center', () => {
        expectPositionsAfterAlignment(AlignmentMode.HorizontalCenter, [new Vec2(215, 100), new Vec2(215, 200), new Vec2(215, 300)]);
    });

    it('should align to horizontally right', () => {
        expectPositionsAfterAlignment(AlignmentMode.HorizontalRight, [new Vec2(330, 100), new Vec2(320, 200), new Vec2(300, 300)]);
    });

    it('should align to vertically top', () => {
        expectPositionsAfterAlignment(AlignmentMode.VerticalTop, [new Vec2(100, 100), new Vec2(200, 110), new Vec2(300, 130)]);
    });

    it('should align to vertically center', () => {
        expectPositionsAfterAlignment(AlignmentMode.VerticalCenter, [new Vec2(100, 215), new Vec2(200, 215), new Vec2(300, 215)]);
    });

    it('should align to vertically bottom', () => {
        expectPositionsAfterAlignment(AlignmentMode.VerticalBottom, [new Vec2(100, 330), new Vec2(200, 320), new Vec2(300, 300)]);
    });

    it('should distribute vertically', () => {
        expectPositionsAfterAlignment(AlignmentMode.DistributeVertical, [new Vec2(100, 100), new Vec2(200, 185), new Vec2(300, 300)]);
    });

    it('should distribute horizontally', () => {
        expectPositionsAfterAlignment(AlignmentMode.DistributeHorizontal, [new Vec2(100, 100), new Vec2(185, 200), new Vec2(300, 300)]);
    });

    function expectPositionsAfterAlignment(type: AlignmentMode, positions: Vec2[]) {
        const action = alignItems(type, diagram, diagram.items.values);

        const state_1 = EditorState.empty().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        const shapes = state_2.diagrams.get(diagram.id).items.values;

        let i = 0;

        for (const shape of shapes) {
            expect(shape.transform.position).toEqual(positions[i]);
            i++;
        }
    }
});
