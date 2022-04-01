/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { ConfigurableFactory, DefaultAppearance, RenderContext, ShapePlugin } from '@app/wireframes/interface';
import { CommonTheme } from './_theme';

const BORDER_RADIUS = 'BORDER_RADIUS';
const HORIZONTAL_PADDING = 'HORIZONTAL_PADDING';
const VERTICAL_PADDING = 'VERTICAL_PADDING';

const DEFAULT_APPEARANCE = {};
DEFAULT_APPEARANCE[DefaultAppearance.FOREGROUND_COLOR] = 0;
DEFAULT_APPEARANCE[DefaultAppearance.BACKGROUND_COLOR] = 0xFFFFFF;
DEFAULT_APPEARANCE[DefaultAppearance.TEXT] = 'Rectangle';
DEFAULT_APPEARANCE[DefaultAppearance.TEXT_ALIGNMENT] = 'center';
DEFAULT_APPEARANCE[DefaultAppearance.FONT_SIZE] = CommonTheme.CONTROL_FONT_SIZE;
DEFAULT_APPEARANCE[DefaultAppearance.STROKE_COLOR] = CommonTheme.CONTROL_BORDER_COLOR;
DEFAULT_APPEARANCE[DefaultAppearance.STROKE_THICKNESS] = CommonTheme.CONTROL_BORDER_THICKNESS;
DEFAULT_APPEARANCE[BORDER_RADIUS] = 0;
DEFAULT_APPEARANCE[HORIZONTAL_PADDING] = 10;
DEFAULT_APPEARANCE[VERTICAL_PADDING] = 10;

export class Rectangle implements ShapePlugin {
    public identifier(): string {
        return 'Rectangle';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 100, y: 60 };
    }

    public configurables(factory: ConfigurableFactory) {
        return [
            factory.slider(BORDER_RADIUS, 'Border Radius', 0, 40),
            factory.number(HORIZONTAL_PADDING, 'Horizontal Padding', 0, 40),
            factory.number(VERTICAL_PADDING, 'Vertical Padding', 0, 40),
        ];
    }

    public render(ctx: RenderContext) {
        this.createShape(ctx);
        this.createText(ctx);
    }

    private createShape(ctx: RenderContext) {
        const borderRadius = ctx.shape.getAppearance(BORDER_RADIUS);

        ctx.renderer2.rectangle(ctx.shape, borderRadius, ctx.rect, p => {
            p.setStrokeColor(ctx.shape);
            p.setBackgroundColor(ctx.shape);
        });
    }

    private createText(ctx: RenderContext) {
        const verticalPadding = ctx.shape.getAppearance(VERTICAL_PADDING);
        const horizontalPadding = ctx.shape.getAppearance(HORIZONTAL_PADDING);
        ctx.renderer2.text(ctx.shape, ctx.rect.deflate(horizontalPadding, verticalPadding), p => {
            p.setForegroundColor(ctx.shape);
        });
    }
}
