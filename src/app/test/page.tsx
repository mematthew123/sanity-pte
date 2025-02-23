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
import {EventListenerPlugin} from '@portabletext/editor/plugins'
import { renderAnnotation, renderBlock, renderDecorator, renderListItem, renderStyle, schemaDefinition } from '../utils'
import { Toolbar } from '@/components/toolBar'






export default function TestPage() {
  
const [value, setValue] = useState<PortableTextBlock[]>([]);
  // Helper function to render decorators (strong, em, code)


  // Helper function to render decorators (strong, em, code)
const renderChildDecorators = (child: PortableTextChild): React.ReactNode => {
  if (child._type !== 'span' || !Array.isArray(child.marks)) {
    return child.text as string;
  }

  let content: React.ReactNode = child.text as string;
  child.marks.forEach((mark: string) => {
    switch (mark) {
      case 'strong':
        content = <strong key={`${child._key}-strong`}>{content}</strong>;
        break;
      case 'em':
        content = <em key={`${child._key}-em`}>{content}</em>;
        break;
      case 'code':
        content = <code key={`${child._key}-code`} className="bg-slate-100 rounded px-1">{content}</code>;
        break;
    }
  });
  return content;
};


  

  // Helper function to render blocks with proper styling
  const renderPreviewBlock = (block: PortableTextBlock) => {
    if (block._type !== 'block') return null;
  
    const children = (block.children as PortableTextChild[]).map((child, i) => (
      <span key={child._key || i}>{renderChildDecorators(child)}</span>
    ));

    switch (block.style) {
      case 'h1':
        return (
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
          </h1>
        );
      case 'h2':
        return (
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
          </h2>
        );
      case 'h3':
        return (
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
          </h3>
        );
      case 'blockquote':
        return (
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
          </blockquote>
        );
      default:
        if (block.listItem === 'bullet') {
          return <li className="leading-7">{children}</li>;
        }
        if (block.listItem === 'number') {
          return <li className="leading-7">{children}</li>;
        }
        return <p className="leading-7">{children}</p>;
    }
  };

return (
  <div className="flex bg-slate-100 p-8 justify-center min-h-screen w-screen">
    <div className="grid grid-col-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <EditorProvider
          initialConfig={{
            schemaDefinition,
            initialValue: value,
          }}
        >
          <EventListenerPlugin
            on={(event) => {
              if (event.type === "mutation" && event.value) {
                setValue(event.value);
              }
            }}
          />
          <Toolbar />
          {/* <ToolbarFloating /> */}

          <PortableTextEditable
            // className="focus:outline-none flex flex-col gap-y-4"
            className="w-full rounded-md border border-input bg-transparent p-4 text-lg shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white flex flex-col gap-y-4"
            renderAnnotation={renderAnnotation}
            renderStyle={renderStyle}
            renderDecorator={renderDecorator}
            renderBlock={renderBlock}
            renderListItem={renderListItem}
          />
        </EditorProvider>
        </div>
        <div className="prose prose-sm">
          <h2>Preview</h2>
          <div className="prose prose-slate max-w-none">
            {value.map((block, blockIndex) => {
              if (block._type === 'block') {
                // Group list items
                if (block.listItem) {
                  const listItems = [];
                  let i = blockIndex;
                  while (i < value.length && value[i].listItem === block.listItem) {
                    listItems.push(renderPreviewBlock(value[i]));
                    i++;
                  }
                  
                  if (block.listItem === 'bullet') {
                    return (
                      <ul key={block._key} className="my-6 ml-6 list-disc">
                        {listItems}
                      </ul>
                    );
                  } else {
                    return (
                      <ol key={block._key} className="my-6 ml-6 list-decimal">
                        {listItems}
                      </ol>
                    );
                  }
                }
                return (
                  <div key={block._key}>
                    {renderPreviewBlock(block)}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* <h2>Raw JSON</h2>
          <pre className="overflow-x-auto rounded-md border bg-white p-4 text-sm">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre> */}
        </div>
      </div>
    </div>
  );
}