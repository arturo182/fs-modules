declare module '@noodl/noodl-sdk' {
    export type Node<TDef = {}> = {
        /**
         * Sets the name.
         */
        name: string

        displayName?: string
        useInputAsLabel?: string

        /**
         * Sets the color.
         */
        color?: Color

        /**
         * Sets the category.
         */
        category?: string

        allowChildren?: boolean

        getInspectInfo?: any

        /**
         * URL to the docs page.
         */
        docs?: string

        shortDesc?: string

        initialize?: (this: NodeInstance & TDef) => void

        inputs?: {
            [key: string]:
                | Type
                | {
                    type: Type
                    displayName?: string
                    group?: string
                    default?: any
                    tooltip?: string
                    set?: (this: NodeInstance & TDef, value: unknown) => void
                }
        }

        outputs?: {
            [key: string]:
                | Type
                | {
                    type: Type
                    displayName?: string
                    group?: string
                    getter?: (this: NodeInstance & TDef) => any
                }
        }

        changed?: {
            [key: string]: (
                this: NodeInstance & TDef,
                newValue: unknown,
                oldValue: unknown
            ) => void
        }
        signals?: {
            [key: string]:
                | ((this: NodeInstance & TDef) => void)
                | {
                    displayName?: string
                    group?: string
                    signal: ((this: NodeInstance & TDef) => void)
                }
        }

        // Previously 'prototypeExtensions'
        methods?: {
            [key: string]: (this: NodeInstance & TDef, ...args: any[]) => void
        }

        /**
         * This is called once on startup
         */
        setup?: (this: NodeDefinitionInstance, context: TSFixme, graphMode: TSFixme) => void
    }
}
