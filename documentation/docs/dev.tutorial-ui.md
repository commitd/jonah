---
title: Creating a simple UI
---

We'll create a simple UI view which uses our GraphQL extension. It'll display a list of people and their age estimates.   

## Initial setup

As previous, start by copying the `ketos-project-template`, naming it `ketos-ui-agelist`.

We now edit a few files to reflect the name change:

* Edit `package.json` set the name field put `ketos-ui-agelist`
* In `public/manifest.json` set the name and short_name to `ketos-ui-agelist`
* In `public/invest.json` set the if to `ketos-ui-agelist`

Whilst editing the `invest.json` lets also set the other fields:

```json
{
    "id": "ketos-ui-agelist",
    "name": "People's aages",
    "description": "List of ages",
    "icon": "user",
    "roles": [],
    "actions": []
}
```

After making these changes you should run `yarn install` from the plugin directory.

## Displaying data to the user

As a simple application we can create a simple UI, which will just be a table, in a new file under `src` called `PersonAgeTable.tsx`:



```tsx
import * as React from 'react'
import { Table } from 'semantic-ui-react'

type Person = {
    id: string
    value: string
    age?: number
}

type Props = {
    data?: {
        corpora: {
           entities: Person[]
        }[]
    }
}

export default class PersonAgeTable extends React.Component<Props> {

    render() {
        const { data } = this.props

        if(!data) {
            return <p>No results</p>
        }

        const corpora = data.corpora


        // Have a table per corpora:
        return (
            <div>
            {
                corpora.map(corpus => 
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.Cell>Name</Table.Cell>
                                <Table.Cell>Age</Table.Cell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                entities.map(e => <Table.Row key={e.id}>
                                    <Table.Cell>{e.value}</Table.Cell>
                                    <Table.Cell>{e.age ? e.age : 'Unknown'}</Table.Cell>
                                </Table.Row>)
                            }
                        </Table.Body>
                    </Table>
                    )
            }
            </div>
        )
    }
}

```

## Getting data from the server

How will we get data from the server?

Invest provides us with a helper to call the GraphQL endpoint and retrieve results, called `createDataContainer`.

```tsx
import gql from 'graphql-tag'
import { createDataContainer } from 'invest-components'

export type Variables = {}

// NOTE that the Response (return from the graphql call) will very closely align with the graphql query itself below
// This also mirrors exactly what the above component requires.
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
query {
  corpora {
    entities(probe: {type: "Person"}) {
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

## Hook everything together

We have a component that will display the results, and the data container which will get the data from the server. We need to hook these together which we do in the `App.tsx`

```tsx
import * as React from 'react'
import { isEqual } from 'lodash-es')

import { PluginProps } from 'invest-plugin'
import DataContainer from './DataContainer'
import DataContainer from './DataContainer'

type Props =  PluginProps

export default class App extends React.Component<Props> {

  render() {
    return (
      <DataContainer>
        <PersonAgeTable />
      </DataContainer>
    )
  }

}
```

### Running the plugin

With the server running, data ingested we can run the plugin. In many cases we can actually develop plugins outide the larger applications. You only need the application when trying to develop actions or if you have specific requirements on say authentication. 

From inside the plugin directory run:

```
yarn start
```

The code should be compiled and it will prompt (or even automatically open a browser) at http://localhost:3001.

You can live edit the code of the UI application live. It will be recompiled automatically and the browser refreshed. This is a convenient way of developing particularly for tweaking visual aspects.

If you want to view the application you can do this using the Live Development Plugin. It will automatically redirect activity to the in-development plugin. The plugin will not appear in the side bar.

## Building

Once complete you will want to build you application into a compiled plugin. You can so this with: 

```bash
yarn build
```

Likely you want to deploy your plugin with a release of the application. Therefore you should edit the `build-ui.sh` and, as with other plugins, copy over the `build/` directory to the `ui/` folder.