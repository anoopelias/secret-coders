
import * as monaco from 'monaco-editor';

const keywords = ['Forward', 'Back', 'Left', 'Right', 'PenDown',
    'PenUp', 'Hide', 'Show', 'Repeat'];

monaco.languages.register({ id: 'secret-coders' });
monaco.languages.setMonarchTokensProvider('secret-coders', {
    ignoreCase: true,
    tokenizer: {
        root: [
            [new RegExp(keywords.join("|")), 'keyword'],
            [/\d+/, 'number'],
        ]
    }
});

monaco.languages.registerCompletionItemProvider('secret-coders', {
    provideCompletionItems: () => {
        var suggestions = keywords.map(keyword => {
            return {
                label: keyword,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: keyword,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            };
        });
        return { suggestions: suggestions };
    }
});

function setEditor() {
    window.editor = monaco.editor.create(document.getElementById('program'), {
        language: 'secret-coders',
        minimap: {
            enabled: false
        }
    });
}

export { setEditor };