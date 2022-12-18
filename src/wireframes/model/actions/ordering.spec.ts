/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { buildOrdering, Diagram, DiagramItem, EditorState, moveItems, orderItems, OrderMode } from '@app/wireframes/model';
import { createClassReducer } from './utils';

describe('OrderingReducer', () => {
    const shape1 = DiagramItem.createShape('1', 'btn', 100, 100);
    const shape2 = DiagramItem.createShape('2', 'btn', 100, 100);
    const shape3 = DiagramItem.createShape('3', 'btn', 100, 100);

    const diagram =
        Diagram.empty('1')
            .addVisual(shape1)
            .addVisual(shape2)
            .addVisual(shape3);

    const state =
        EditorState.empty()
            .addDiagram(diagram);

    const reducer = createClassReducer(state, builder => buildOrdering(builder));

    it('should return same state if action is unknown', () => {
        const action = { type: 'UNKNOWN' };
        const state_1 = EditorState.empty();
        const state_2 = reducer(state_1, action);

        expect(state_2).toBe(state_1);
    });

    it('should return same state if action has unknown ordering type', () => {
        const action = orderItems('UNKNOWN' as any, diagram, []);
        const state_1 = EditorState.empty();
        const state_2 = reducer(state_1, action);

        expect(state_2).toBe(state_1);
    });

    it('should move items', () => {
        const action = moveItems( diagram, [shape1], 1);

        const state_1 = EditorState.empty().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get(diagram.id)?.itemIds.values).toEqual([shape2.id, shape1.id, shape3.id]);
    });

    it('should bring item forwards', () => {
        testOrdering(OrderMode.BringForwards, shape1, [shape2.id, shape1.id, shape3.id]);
    });

    it('should bring item to front', () => {
        testOrdering(OrderMode.BringToFront, shape1, [shape2.id, shape3.id, shape1.id]);
    });

    it('should send item backwards', () => {
        testOrdering(OrderMode.SendBackwards, shape3, [shape1.id, shape3.id, shape2.id]);
    });

    it('should send item to back', () => {
        testOrdering(OrderMode.SendToBack, shape3, [shape3.id, shape1.id, shape2.id]);
    });

    function testOrdering(mode: OrderMode, shape: DiagramItem, expectedIds: string[]) {
        const action = orderItems(mode, diagram, [shape]);

        const state_1 = EditorState.empty().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get(diagram.id)?.itemIds.values).toEqual(expectedIds);
    }
});
