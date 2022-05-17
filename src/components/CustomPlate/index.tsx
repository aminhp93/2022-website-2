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
    MentionCombobox,
    usePlateEditorRef,
    MarkToolbarButton,
    getPluginType,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE
} from '@udecode/plate';
import { FormatBold } from '@styled-icons/material/FormatBold';
import { FormatItalic } from '@styled-icons/material/FormatItalic';
import { FormatUnderlined } from '@styled-icons/material/FormatUnderlined';

import { CONFIG } from './config/config';
import { BalloonToolbar } from '@udecode/plate-ui-toolbar';

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

    const BallonToolbarMarks = () => {
        const editor = usePlateEditorRef();

        const arrow = false;
        const theme = 'dark';
        const popperOptions: any = {
            placement: 'top'
        };
        const tooltip: any = {
            arrow: true,
            delay: 0,
            duration: [200, 0],
            hideOnClick: false,
            offset: [0, 17],
            placement: 'top',
        };

        return (
            <BalloonToolbar
                popperOptions={popperOptions}
                theme={theme}
                arrow={arrow}
            >
                <MarkToolbarButton
                    type={getPluginType(editor, MARK_BOLD)}
                    icon={<FormatBold />}
                    tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
                />
                <MarkToolbarButton
                    type={getPluginType(editor, MARK_ITALIC)}
                    icon={<FormatItalic />}
                    tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
                />
                <MarkToolbarButton
                    type={getPluginType(editor, MARK_UNDERLINE)}
                    icon={<FormatUnderlined />}
                    tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
                />
            </BalloonToolbar>
        );
    };

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
            <BallonToolbarMarks />
            <MentionCombobox items={CONFIG.mentionItems} />
        </Plate>
    </div >
}
