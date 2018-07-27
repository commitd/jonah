---
title: Actions
---

Actions are the way in which UI views exchange information. 

The notion of actions will be familiar with developers who have experience of [Android Intents](https://developer.android.com/reference/android/content/Intent.html) or in the Javascript world [Flux/Redux actions](https://redux.js.org/basics/actions).

UI views declare that they support actions, which are simple (but freeform) strings. Each action has a corresponding payload. The action tells the plugin what the payload is, and the payload provides the details needed to execute the action. For example:

1. Plugin A has a document it wants to display to the user (when the view clicks). From the framework it requests all the plugins which have the `document.view`.   
2. Plugin A receives a list which includes Plugin B (and perhaps others as well). 
3. Plugin A constructs a payload which includes the information required for the `document.view` action. 
4. Plugin A sends the action and payload to the framework
5. The framework will find and display Plugin B passing it the action and payload
6. Plugin B will proceed to execute the action. 

## Ketos actions types

Within Ketos the following actions are standardised, see `ketos-components/src/Actions.ts`. In ketos actions take a standard pattern of `[type].[activity]` where:

* `type` is one of  `document`, `corpus`, `relation`, `entity`, `mention` 
* `activity` is one of `search`, `view`, `edit`, `delete`

Many plugins can be defined as supporting a single action, eg `document.view`. So the meaning of the different actions will vary from plugin to plugin as the example shows:

Action | Payload Type | Description | Example of plugins
--- | --- | --- | ---
`document.view` | DatasetAndDocumentPayload | View a document | Read document, view document metadata, find similar document
`document.search` | DatasetAndDocumentPayload | View a document | Perform Google like search, Perform structured search 
`document.edit` | DatasetAndDocumentPayload | Allow user to edit a document | Edit document form, Word processor view to amend document content
`document.delete` | DatasetAndDocumentPayload | Request document is deleted | Review and Confirm deletion of document from the corpus

The payload above are defined in `ketos-components/src/Payloads.ts`:

```ts
DocumentViewPayload = DocumentEditPayload = DocumentDeletePayload = {
    datasetId: string
    documentId: string
}

DocumentSearchPayload = {
    datasetId: string,
    documentFilter?: DocumentFilter
}

// where:

DocumentFilter = {
    id?: string
    properties?: PropertiesMap
    metadata?: PropertiesMap
    content?: string

    info?: {
        type?: string
        source?: string
        language?: string
        classification?: string
        caveats?: string
        releasability: string
        publishedId: string

        startTimestamp?: number
        endTimestamp?: number
    }
}

```

As can be seen from the search example, the payload can pass considerable amounts of information between plugins. 

Developers are free to create other actions, but should document them so other plugin developers know they can call upon them. 

## Declaring support for an action in your UI plugin

If you use the `invest.json` approach for plugins, create an `invest.json` file alongside your plugins `index.html` page, then you can declare actions within that. Here is a complete `invest.json` for the document reader plugin, delcaring support for the `document.view` action.

```json
{
    "id": "ketos-ui-documentreader",
    "name": "Document reader",
    "description": "View documents and metadata",
    "icon": "file text outline",
    "roles": [],
    "actions": [
        {
            "title": "Read document",
            "description": "View document and metadata",
            "action": "document.view"
        }
    ]
}
```  

Notice that that `actions` block contains not just the supported `action`, but also the friendly `title` and `description` which helps the user understand what the plugin will display in response to receiving this action. If another plugin supported the `document.view` action, and displayed a [word cloud](https://en.wikipedia.org/wiki/Tag_cloud) for that document, it's `invest.json` may look like:


```json
{
    "id": "ketos-ui-wordcloud",
    "name": "Word cloud",
    "description": "Tag or word cloud",
    "icon": "file",
    "roles": [],
    "actions": [
        {
            "title": "Word cloud",
            "description": "View important words in the document sized by frequency",
            "action": "document.view"
        }
    ]
}

```

## Building a UI plugin that responds to actions

Thanks to some common components in the Invest framework, responding to actions in your plugin as declared is quite simple. Most plugins will follow a simple pattern.

The `index.tsx` file will wrap the plugin's main App React component with an `InvestPlugin`. The `InvestPlugin` interfaces with the outer application, and specifically in this case, processes incoming actions and passes them to the App as React props.

```ts
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

import './index.css'
import 'semantic-ui-offline/semantic.min.css'

import { InvestUiPlugin } from 'invest-plugin'


ReactDOM.render(
  <InvestUiPlugin>
    <App />
  </InvestUiPlugin>,
  document.getElementById('root') as HTMLElement
)

```


Our App.tsx becomes:

```tsx
import * as React from 'react'
import { isEqual } from 'lodash-es'
import { PluginProps } from 'invest-plugin'

// Import the payload and action we support
import { ENTITY_VIEW, EntityViewPayload } from 'ketos-components'


// Top level Apps typcially don't have any other props, just those provided by InvestPlugin
type Props =  PluginProps

// When an action arrives, store it's value in the React state
// You might not need this in your own plugins (you could just use this.props.action / this.props.payload)
// but this allows us some control (eg we can allow the user to override the datasetId if we wanted)
type State = {
  datasetId?: string
  entityId?: string
}

export default class App extends React.Component<Props, State> {

  state: State = {
    entityId: undefined,
    datasetId: undefined
  }

  componentWillReceiveProps(nextProps: Props) {
    // If you have a new action, or a different payload then we need to process it
    if (this.props.action !== nextProps.action || !isEqual(this.props.payload, nextProps.payload)) {
      this.onAction(nextProps.action, nextProps.payload)
    }
  }

  render() {
    const { datasetId, entityId } = this.state
    
    return (
        <div>
            <p>Dataset is {datasetId || "None"}</p>
            <p>Entity is {entityId || "None"}</p>
        </div>

    )
  }

  private onAction = (action?: string, payload?: {}) => {

    // Update the state from the action/payload causing a rerender

    if (action == null || payload == null) {
       // If something is missing, clear the old values
      this.setState({
        entityId: undefined
      })
    } else if (action === ENTITY_VIEW) {
      // Otherwise we'll take the payload and save it to our state
      
      const p = ((payload || {}) as EntityViewPayload)
      this.setState({
        datasetId: p.datasetId,
        entityId: p.entityId
      })
    }
  }
}

```

## Building a UI plugin that sends actions

Invest also has support to help plugins find, display and navigate to other plugins. The simplest way to do this is through the `ActionDropdown`.

The `ActionDropdown` is a React component which queries the framework for required actions and displays them as a button. A simple use might be:


```ts

import * as React from 'react'
import { ActionDropdown } from 'invest-components'
import { DOCUMENT_VIEW,  } from '../../Actions'

export type Props = {
    datasetId: string
    documentId: string
}

export default class DocumentInfo extends React.Component<Props> {

    render() {

        const { documentId, datasetId } = this.props

        return (
            <div>
                <p>You might have the ActionDropdown in a table cell, next to a heading, etc</p>
                <ActionDropdown
                    text="View"
                    actions={[DOCUMENT_VIEW]}
                    onSelect={this.handleAction}
                />
            </div>
        )
    }

    private handleAction = (act: (payload?: {}) => void, action: string) => {
        act({
            documentId: this.props.documentId,
            datasetId: this.props.datasetId
        })
    }
}
``` 

As illustrated above the ActionDropdown is provided with `text` (which is displayed in the button), an `action` or `actions` which it should find and display, and a callback `onSelect` when an action is clicked. The `handleAction` is our callback implementation. It is responsible for creating a payload and then calling `act`. The `act` function is managed by the `ActionDropdown` and it passes the action and the callback to the plugin that the user has selected.
