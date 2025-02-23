'use client'
import { useState } from 'react'

import type {
  PortableTextBlock,
  PortableTextChild,
  RenderBlockFunction,
  RenderChildFunction,
  RenderDecoratorFunction,
  RenderStyleFunction,
} from '@portabletext/editor'
import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  useEditor,
} from '@portabletext/editor'
import { EventListenerPlugin } from '@portabletext/editor/plugins'





function Toolbar() {
  // useEditor provides access to the PTE
  const editor = useEditor()

  // Iterate over the schema (defined earlier), or manually create buttons.
  const styleButtons = schemaDefinition.styles.map((style) => (
    <button
      key={style.name}
      onClick={() => {
        // Send style toggle event
        editor.send({
          type: 'style.toggle',
          style: style.name,
        })
        editor.send({
          type: 'focus',
        })
      }}
    >
      {style.name}
    </button>
  ))

  const decoratorButtons = schemaDefinition.decorators.map((decorator) => (
    <button
      key={decorator.name}
      onClick={() => {
        // Send decorator toggle event
        editor.send({
          type: 'decorator.toggle',
          decorator: decorator.name,
        })
        editor.send({
          type: 'focus',
        })
      }}
    >
      {decorator.name}
    </button>
  ))
  return (
    <>
      {styleButtons}
      {decoratorButtons}
    </>
  )
}

const schemaDefinition = defineSchema({
  // Decorators are simple marks that don't hold any data
  decorators: [{ name: 'strong' }, { name: 'em' }, { name: 'underline' }],
  // Styles apply to entire text blocks
  // There's always a 'normal' style that can be considered the paragraph style
  styles: [
    { name: 'normal' },
    { name: 'h1' },
    { name: 'h2' },
    { name: 'h3' },
    { name: 'blockquote' },
  ],

  // The types below are left empty for this example.
  // See the rendering guide to learn more about each type.

  // Annotations are more complex marks that can hold data (for example, hyperlinks).
  annotations: [
    {
      name: 'link',
      type: 'object',
      options: {
        fields: [
          {
            name: 'href',
            type: 'string',
          },
        ],
      },
    },
  ],
  // Lists apply to entire text blocks as well (for example, bullet, numbered).
  lists: [
    { name: 'bullet' },
    { name: 'numbered' },
    { name: 'check' },
  ],
  // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
  inlineObjects: [
    {
      name: 'emoji',
      type: 'string',
    },
  ],
  // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
  blockObjects: [
    {
      name: 'image',
      type: 'object',
      options: {
        fields: [
          {
            name: 'src',
            type: 'string',
          },
          {
            name: 'alt',
            type: 'string',
          },
        ],
      },
    },
  ],
})

const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === 'h1') {
    return <h1>{props.children}</h1>
  }
  if (props.schemaType.value === 'h2') {
    return <h2>{props.children}</h2>
  }
  if (props.schemaType.value === 'h3') {
    return <h3>{props.children}</h3>
  }
  if (props.schemaType.value === 'blockquote') {
    return <blockquote>{props.children}</blockquote>
  }
  return <>{props.children}</>
}




const renderDecorator: RenderDecoratorFunction = (props) => {
    if (props.value === 'strong') {
      return <strong>{props.children}</strong>
    }
    if (props.value === 'em') {
      return <em>{props.children}</em>
    }
    if (props.value === 'underline') {
      return <u>{props.children}</u>
    }
    return <>{props.children}</>
  }

  
  // Block objects
  const renderBlock: RenderBlockFunction = (props) => {
    if (props.schemaType.name === 'image' && isImage(props.value)) {
      return (
        <div
          style={{
            border: '1px dotted grey',
            padding: '0.25em',
            marginBlockEnd: '0.25em',
          }}
        >
          IMG: {props.value.src}
        </div>
      )
    }
  
    return <div style={{marginBlockEnd: '0.25em'}}>{props.children}</div>
  }
  
  // Check the shape of an image and confirm it has a src.
  function isImage(
    props: PortableTextBlock,
  ): props is PortableTextBlock & {src: string} {
    return 'src' in props
  }

  
  // Inline objects
  const renderChild: RenderChildFunction = (props) => {
    if (props.schemaType.name === 'stock-ticker' && isStockTicker(props.value)) {
      return (
        <span
          style={{
            border: '1px dotted grey',
            padding: '0.15em',
          }}
        >
          {props.value.symbol}
        </span>
      )
    }
  
    return <>{props.children}</>
  }
  
  // Check the shape of the object by confirming it has a symbol.
  function isStockTicker(
    props: PortableTextChild,
  ): props is PortableTextChild & {symbol: string} {
    return 'symbol' in props
  }

export default function TestPage() {
  const [value, setValue] = useState<Array<PortableTextBlock> | undefined>(
    undefined,
  )

  return (
    <>
      <EditorProvider
        initialConfig={{
          schemaDefinition,
          initialValue: value,
        }}
      >
        <EventListenerPlugin
          on={(event) => {
            if (event.type === 'mutation') {
              setValue(event.value)
            }
          }}
        />
        <Toolbar />
        <PortableTextEditable
          style={{ border: '1px solid black', padding: '0.5em' }}
          renderStyle={renderStyle}
          renderDecorator={renderDecorator}
          renderBlock={renderBlock}
          renderListItem={(props) => <>{props.children}</>}
        />
      </EditorProvider>
    </>
  )
}
