
import { useEffect, useState } from "react"
import {
    Plate,
    ELEMENT_PARAGRAPH,
    ELEMENT_H1,
    createParagraphPlugin,
    createBlockquotePlugin,
    createTodoListPlugin,
    createHeadingPlugin,
    createImagePlugin,
    createHorizontalRulePlugin,
    createLineHeightPlugin,
    createLinkPlugin,
    createListPlugin,
    createTablePlugin,
    createMediaEmbedPlugin,
    // createExcalidrawPlugin,
    createCodeBlockPlugin,
    createAlignPlugin,
    createBoldPlugin,
    createCodePlugin,
    createItalicPlugin,
    createHighlightPlugin,
    createUnderlinePlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createFontBackgroundColorPlugin,
    createFontFamilyPlugin,
    createFontColorPlugin,
    createFontSizePlugin,
    createFontWeightPlugin,
    createKbdPlugin,
    createNodeIdPlugin,
    createIndentPlugin,
    createAutoformatPlugin,
    createResetNodePlugin,
    createSoftBreakPlugin,
    createExitBreakPlugin,
    createNormalizeTypesPlugin,
    createTrailingBlockPlugin,
    createSelectOnBackspacePlugin,
    createComboboxPlugin,
    createMentionPlugin,
    createDeserializeMdPlugin,
    createDeserializeCsvPlugin,
    createDeserializeDocxPlugin,
    createJuicePlugin,
    createPlugins,
    createPlateUI,
    withPlaceholders,
    MentionCombobox
} from '@udecode/plate'

import { CONFIG } from './config/config';
import { v4 as uuidv4 } from 'uuid';

export const withStyledPlaceHolders = (components: any) =>
    withPlaceholders(components, [
        {
            key: ELEMENT_PARAGRAPH,
            placeholder: 'Type a paragraph',
            hideOnBlur: true,
        },
        {
            key: ELEMENT_H1,
            placeholder: 'Untitled',
            hideOnBlur: false,
        },
    ]);

interface IProps {
    id?: any;
    onChange?: any;
    value?: any;
    // children?: any;
}

export default function CustomPlate(props: IProps) {

    let components = createPlateUI();
    // components = withStyledPlaceHolders(components);

    const plugins: any = createPlugins([
        createParagraphPlugin(),
        createBlockquotePlugin(),
        createTodoListPlugin(),
        createHeadingPlugin(),
        createImagePlugin(),
        createHorizontalRulePlugin(),
        createLineHeightPlugin(CONFIG.lineHeight),
        createLinkPlugin(),
        createListPlugin(),
        createTablePlugin(),
        createMediaEmbedPlugin(),
        // createExcalidrawPlugin(),
        createCodeBlockPlugin(),
        createAlignPlugin(CONFIG.align),
        createBoldPlugin(),
        createCodePlugin(),
        createItalicPlugin(),
        createHighlightPlugin(),
        createUnderlinePlugin(),
        createStrikethroughPlugin(),
        createSubscriptPlugin(),
        createSuperscriptPlugin(),
        createFontBackgroundColorPlugin(),
        createFontFamilyPlugin(),
        createFontColorPlugin(),
        createFontSizePlugin(),
        createFontWeightPlugin(),
        createKbdPlugin(),
        createNodeIdPlugin(),
        createIndentPlugin(CONFIG.indent),
        createAutoformatPlugin(CONFIG.autoformat),
        createResetNodePlugin(CONFIG.resetBlockType),
        createSoftBreakPlugin(CONFIG.softBreak),
        createExitBreakPlugin(CONFIG.exitBreak),
        createNormalizeTypesPlugin(CONFIG.forceLayout),
        createTrailingBlockPlugin(CONFIG.trailingBlock),
        createSelectOnBackspacePlugin(CONFIG.selectOnBackspace),
        createComboboxPlugin(),
        createMentionPlugin(),
        createDeserializeMdPlugin(),
        createDeserializeCsvPlugin(),
        createDeserializeDocxPlugin(),
        createJuicePlugin(),
    ], {
        components,
    });


    return <div className="CustomPlate">
        <Plate
            editableProps={CONFIG.editableProps}
            // onChange={onChange}
            plugins={plugins}
            {...props}
        >
            {/* <BallonToolbarMarks /> */}
            <MentionCombobox items={CONFIG.mentionItems} />
        </Plate>
    </div >
}
