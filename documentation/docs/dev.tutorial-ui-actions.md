---
title: Responding to UI actions
---


Lets create a new UI plugin which will display the age of a specific entity.

## Initial setup

As previous, start by copying the `ketos-project-template` into the naming it `ketos-ui-personage`.

We now edit a few files to reflect the name change:

* Edit `package.json` set the name field put `ketos-ui-personage`
* In `public/manifest.json` set the name and short_name to `ketos-ui-personage`
* In `public/invest.json` set the id to `ketos-ui-personage`

Whilst editing the `invest.json` lets also set the other fields, the most important of which is to declare that we support the `entity.view` action.

```json
{
    "id": "ketos-ui-personage",
    "name": "Person's age",
    "description": "Determine age from entity information",
    "icon": "user",
    "roles": [],
    "actions": [
        {
            "title": "Age",
            "description": "Guess entity's age",
            "action": "entity.view"
        }

    ]
}

```


## Data container and view 

As before we'll create a visual component `PersonAgeView` in `PersonAgeView.tsx` and a GraphQL data manager in `DataContainer.tsx`:


```tsx
import * as React from 'react'
import { Table } from 'semantic-ui-react'


type Person = {

}

type Props = {
    data: {
        corpus: {
           entity: {
                value: string
                age?: number
            }
        }
    }
}

export default class PersonAgeView extends React.Component<Props> {

    render() {
        const { data } = this.props

        if(!data || !data.corpus || !data.corpus.entity) {
            return <p>No results</p>
        }

        const entity = data.corpus.entity

        return (
            <div>
                {entity.age == null && <p>Sorry we don't know how old {entity.value} is.</p>}
                {entity.age != null && <p>{entity.value} is estimated to be {entity.age} years old.</p>}
            </div>    
        )
    }
}
```


The DataContainer is a slightly different query this time, because we want to pass in a `datasetId` and `entityId` to find: 

```tsx
import gql from 'graphql-tag'
import { createDataContainer } from 'invest-components'

export type Variables = {}

export type Response = {
    corpora: {
        entities: {
            id: string
            type: string
            value: string
            age?: number
        }[]
    }[]
}

const QUERY = gql`
query ($datasetId: String!, $entityId: String) {
  corpora {
    entity(id: $entityId ) {
      id
      type
      value
      age
    }
  }
}
`

export default createDataContainer<Variables, Response>(QUERY)
```

## Responding to the action

Our plugin will display information only when it has an `entityId` to look up. Whilst we could allow the user to input this manual, offer them a search, etc we can let other plugins do that for us (eg entity search) and let the user navigate from those plugins to ours. This way we can focus on building our specific functionality and not worry about other aspects.   

```tsx
import * as React from 'react'
import { isEquals } from 'lodash-es'
import { PluginProps } from 'invest-plugin'
import DataContainer from './DataContainer'
import PersonAgeView from './PersonAgeView'

type OwnProps = {}

type Props = OwnProps & PluginProps

type State = {
    datasetId?: string,
    entityId? : string 
}

export default class App extends React.Component<Props> {

  state: State = {
      datasetId: undefined,
      entityId: undefined
  }

  componentWillReceiveProps(nextProps: Props) {
    // Respond to change of props!
    if (this.props.action !== nextProps.action || !isEqual(this.props.payload, nextProps.payload)) {
      this.onAction(nextProps.action, nextProps.payload)
    }
  }

  render() {
    const { datasetId, entityId } = this.state

    // Do we have enough to proceed?
    const hasRequiredInfo = datasetId && entityId

    return (
      <div>
        {!hasRequiredInfo && <p>Please use another plugin to navigate to this</p>}
        {hasRequiredInfo && 
            <DataContainer variables={{datasetId, entityId}}>
                <PersonAgeView />
            </DataContainer>
        }
      </div>
    )
  }

  private onAction = (action?: string, payload?: {}) => {
      if(action === ENTITY_VIEW)  {
          this.setState({
            datasetId: p.datasetId,
            entityId: p.entityId
         })
        }
    }
  
}

```

## Viewing in browser

As before you run a live development version of the plugin using:

```
yarn start
```

and visiting http://localhost:3001.

However because our plugin requires an action, and perhaps more importantly a payload, we only see a the "Please use another plugin..." message on screen.

There are three solutions to this:

* Temporarily hard code values in the state above i.e. `state = { datasetId: "mydataset", entityId:"123545" }` which already exist in your database, as a quick test. Remember to delete these before committing or building the production release.
* Using the Action Development Plugin to pass an action to the plugin whilst it is mounted in the Live Development Plugin view. 
* Build the application as a full plugin using `yarn build` and use the `invest.ui.hosts.roots` [configuration setting](setup.configuration.html) to load the production plugin

When starting the development of a plugin, where the plugin will change a lot quickly, we'd recommend using the first option. It is very simple and no developer effort. As the plugin matures and you wish to test wthin the application the other options become more viable.

