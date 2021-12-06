/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Color, SVGHelper } from '@app/core';
import { SnapMode, SnapResult, Transform } from '@app/wireframes/model';
import * as svg from 'svg.js';
import { SVGRenderer2 } from '../shapes/utils/svg-renderer2';

export class InteractionOverlays {
    private readonly infoRect: svg.Rect;
    private readonly infoText: svg.Element;
    private readonly lineX: svg.Rect;
    private readonly lineY: svg.Rect;
    private readonly elements: svg.Element[] = [];

    constructor(layer: svg.Container) {
        this.lineX = layer.rect();
        this.lineY = layer.rect();

        this.elements.push(this.lineX);
        this.elements.push(this.lineY);

        this.infoRect = layer.rect().fill('#000');
        this.infoText = SVGHelper.createText(layer, '', 16, 'center', 'middle').attr('color', '#fff');

        this.elements.push(this.infoRect);
        this.elements.push(this.infoText);

        this.reset();
    }

    public showSnapAdorners(snapResult: SnapResult) {
        if (snapResult.snapModeX === SnapMode.LeftTop) {
            this.showXLine(snapResult.snapValueX! - 1, Color.RED);
        } else if (snapResult.snapValueX && snapResult.snapModeX === SnapMode.RightBottom) {
            this.showXLine(snapResult.snapValueX, Color.RED);
        } else if (snapResult.snapValueX && snapResult.snapModeX === SnapMode.Center) {
            this.showXLine(snapResult.snapValueX, Color.BLUE);
        }

        if (snapResult.snapModeY === SnapMode.LeftTop) {
            this.showYLine(snapResult.snapValueY! - 1, Color.RED);
        } else if (snapResult.snapValueY && snapResult.snapModeY === SnapMode.RightBottom) {
            this.showYLine(snapResult.snapValueY, Color.RED);
        } else if (snapResult.snapValueY && snapResult.snapModeY === SnapMode.Center) {
            this.showYLine(snapResult.snapValueY, Color.BLUE);
        }
    }

    public showXLine(value: number, color: Color) {
        this.lineX.fill(color.toString()).show();

        SVGHelper.transform(this.lineX, { x: value, y: -4000, w: 1, h: 10000 });
    }

    public showYLine(value: number, color: Color) {
        this.lineX.fill(color.toString()).show();

        SVGHelper.transform(this.lineY, { x: -4000, y: value, w: 10000, h: 1 });
    }

    public showInfo(transform: Transform, text: string) {
        const aabb = transform.aabb;

        this.infoRect.show();
        this.infoText.node.children[0].textContent = text;
        this.infoText.show();

        SVGHelper.transform(this.infoText, { x: aabb.right + 4, y: aabb.bottom + 24, w: 160, h: 24 });

        const bounds = SVGRenderer2.INSTANCE.getBounds(this.infoText);

        SVGHelper.transform(this.infoRect, { rect: bounds.inflate(4) });
    }

    public reset() {
        for (const element of this.elements) {
            element.hide();
        }
    }
}
