type ColorTypes = {
    purple: 'component'
    green: 'data'
    blue: 'visual'
    red: 'javascript'
    default: 'default'
    grey: 'default'
}

declare module '@noodl/noodl-sdk' {
    export type Color = keyof ColorTypes | ColorTypes[keyof ColorTypes]

    export type TypeEditor = 'javascript' | 'graphql' | 'html' | 'css'

    export type ParseSchema = {
        properties: {
            [key: string]: {
                type:
                    | 'Boolean'
                    | 'String'
                    | 'Number'
                    | 'Date'
                    | 'Object'
                    | 'Array'
                    | 'GeoPoint'
                    | 'Polygon'
                    | 'File'
                    | 'Pointer'
                    | 'Relation';
            };
        };
    };

    export type Type =
        | '*'
        | 'object'
        | 'array'
        | 'string'
        | 'stringlist'
        | 'number'
        | 'boolean'
        | 'signal'
        | 'enum'
        | 'color'
        | 'image'
        | 'icon'
        | 'font'
        | 'textStyle'
        | 'component'
        | 'dimension'
        | 'source'
        | 'resizing'
        | 'variable'
        | 'curve'
        | 'query-filter'
        | 'query-sorting'
        | 'pages'
        | 'proplist'
        | {
            name: Type;
            enums?: { label: string; value: string }[];
            codeeditor?: TypeEditor;
            allowEditOnly?: boolean;
            allowConnectionsOnly?: boolean;
            identifierOf?: string;
            identifierDisplayName?: string;
            schema?: ParseSchema;
        }
}
