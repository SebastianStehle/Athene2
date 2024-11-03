/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as svg from '@svgdotjs/svg.js';
import { EngineText } from '../interface';
import { SvgObject } from './object';
import { linkToSvg, SVGHelper } from './utils';

export class SvgText extends SvgObject implements EngineText {
    private readonly container: svg.Container;
    private readonly background: svg.Rect;
    private readonly textElement: svg.ForeignObject;
    private readonly textInner: HTMLDivElement;

    protected get root() {
        return this.container;
    }

    constructor(
        layer: svg.Container,
    ) {
        super();

        this.container = layer.group();
        this.background = this.container.rect();
        this.textElement = SVGHelper.createText(undefined, undefined, 'center', 'middle').addTo(this.container);
        this.textInner = this.textElement.node.children[0] as HTMLDivElement;

        linkToSvg(this, this.container);
    }

    public color(value: string) {
        this.textElement.attr('color', value);
    }

    public fill(value: string) {
        this.background.fill(value);
    }

    public fontSize(value: string) {
        this.textInner.style.fontSize = value;
    }

    public fontFamily(value: string) {
        this.textInner.style.fontFamily = value;
    }        

    public text(value: string) {
        this.textInner.textContent = value;
    }

    public plot(x: number, y: number, w: number, h: number, padding: number): void {
        SVGHelper.transformBy(this.container, {
            x,
            y,
        });

        SVGHelper.transformBy(this.textElement, {
            x: x + padding,
            y: y + padding,
            w: w - 2 * padding,
            h: h - 2 * padding,
        });

        SVGHelper.transformBy(this.background, {
            w: w,
            h: h,
        });
    }
}