/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as svg from '@svgdotjs/svg.js';
import * as React from 'react';
import { sizeInPx, SVGHelper, Vec2 } from '@app/core';
import { ShapePlugin } from '@app/wireframes/interface';
import { DiagramItem } from '@app/wireframes/model';
import { AbstractControl } from './utils/abstract-control';

interface ShapeRendererProps {
    plugin: ShapePlugin;

    // The optional appearance.
    appearance?: { [key: string]: any };

    // The optional height.
    h?: number;

    // The optional width.
    w?: number;

    // The optional padding.
    padding?: number;
}

export const ShapeRenderer = (props: ShapeRendererProps) => {
    const { appearance, padding, plugin } = props;

    const [document, setDocument] = React.useState<svg.Svg>();

    const size = React.useMemo(() => {
        const size = plugin.defaultSize();

        const w = props.w || size.x;
        const h = props.h || size.y;

        return {
            w,
            h,
            wp: sizeInPx(w),
            hp: sizeInPx(h),
        };
    }, [plugin, props.h, props.w]);

    const doInit = React.useCallback((ref: HTMLDivElement) => {
        const doc = svg.SVG().addTo(ref).css({ overflow: 'visible' });

        setDocument(doc);
    }, []);

    React.useEffect(() => {
        document?.size(size.w, size.h).viewbox(0, 0, size.w, size.h);
    }, [document, size]);

    React.useEffect(() => {
        if (document) {
            const svgControl = new AbstractControl(plugin);

            const group = document.group();

            SVGHelper.setPosition(group, 0.5, 0.5);

            const item =
                DiagramItem.createShape('1', plugin.identifier(),
                    size.w,
                    size.h,
                    { ...plugin.defaultAppearance(), ...appearance || {} })
                    .transformWith(x => x.moveTo(new Vec2(size.w * 0.5, size.h * 0.5)));

            svgControl.setContext(group);
            svgControl.render(item, undefined);
        }
    }, [appearance, document, plugin, size]);

    return (
        <div style={{ padding: padding || 10 }}>
            <div style={{ width: size.w, height: size.h }} ref={doInit} />
        </div>
    );
};
