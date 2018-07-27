---
title: Creating a simple server plugin
---

Create a new Maven module under the `ketos-java` directory, or copy the `ketos-project-template` example in the same folder. The maven module should have a name artifactId `ketos-person-age` and as the `ketos-project-template` have a dependency on `ketos-common` and `invest-test`  

We need to declare that this is a GraphQL extension to Ketos. To do this we create a new class `PersonAgeExtension` in a package `io.committed.ketos.plugins.personage` looking like:


```java
package io.committed.ketos.plugins.personage;


@Configuration
// We want to find any services we define in the same package so use ComponentScan
@ComponentScan(PersonAgeExtension.class)
public class PersonAgeExtension extends InvestGraphQlExtension {

    public String getId() {
        return "person-age";
    }

}
```

In order for Spring to find our extension we need to create a file called `spring.factories` under `src/main/resources/META-INF/`:

```ini
org.springframework.boot.autoconfigure.EnableAutoConfiguration=io.committed.ketos.plugins.personage.PersonAgeExtension,
```

We'll now add our implementation of the age guesser:

```java

package io.committed.ketos.plugins.personage;

@Service
public class AgeGuesser {

    public Optional<Integer> guess(BaleenEntity e) {

        // If its not a person we can't guess
        if(!"Person".equals(e.getType)) {
            return Optional.empty();
        }

        // Use the value
        String value =  e.getValue();
        if(Strings.isNullOrEmpty(value)) {
            return Optional.empty();
        }

        // Spilt value into names
        String[] names = value.spilt(" ");

        for(String s : names) {
            Optional<Integer> o = guessAgeForName(s);
            if(o.isPresent()) {
                // if we've got it
                return o;
            }
        }

        // If we got here we don't know the age
        return Optional.empty();
    }

    private Optional<Integer> guessAgeForName(String name) {
        // Our implementation here is just a silly...
        // Exercise for the reader
        // One easy implementation would be read in a CSV of year / names as per census info then find the most likely year for each name and save in a map

        if(name.length > 0) {
            return Optional.of(name.length * 5);
        }
        
        return Optional.empty();
    }
}
```

And we'll add a test for this class in to the `src/test/java` folder in the `io.committed.ketos.plugins.personage` file:

```java
package io.committed.ketos.plugins.personage;

public class PersonAgeGuesserTest {

    @Test
    public void testNonPerson() {
        BaleenEntity e = BaleenEntity.builder().type("Location").build();
        AgeGuesser guesser = new AgeGuesser()
        assertThat(guesser.guess(e)).isNotPresent();
    }


    @Test
    public void testEmpty() {
        BaleenEntity e = BaleenEntity.builder().type("Person").value("").build();
        AgeGuesser guesser = new AgeGuesser()
        assertThat(guesser.guess(e)).isNotPresent();
    }

    @Test
    public void testEmpty() {
        BaleenEntity e = BaleenEntity.builder().type("Person").value("Chris").build();
        AgeGuesser guesser = new AgeGuesser()
        // Our expected age is nonsense, so if you've replaced the implementation this will need to be changed
        assertThat(guesser.guess(e).get()).isEqualsTo(50);
    }

    // ... other tests
} 
```


Now we have an implementation we need to hook it into GraphQL to make it available in the UI. In GraphQL the nicest way to add this type of function is to add it to the entity, as if it were an existing property (such as a value or name).

```java
package io.committed.ketos.plugins.personage;

// Use GraphQlService to tell Invest this should be merged into GraphQL schema  
@GraphQlService
public class EntityAgeResolver {

    private final AgeGuesser guesser;

    // Spring will add out AgeGuesser here for us
    @Autowired
    public EntityAgeResolver(AgeGuesser guesser) {
        this.guesser = guesser;
    }

    @GraphQlQuery(name="age")
    public Optional<Integer> age(@GraphQLContext BaleenEntity entity) {
        return guesser.guess(entity);
    }
}

```

Add the Maven module to the to the `ketos-runner` as a dependency. Run the `ketos-runner` project, and we can now test our function inside Ketos using the GraphiQL view. (You'll need some data already in the databases to do this).
 
```graphql

query {
  corpora {
    entities(probe: {type: "Person"}) {
      id
      type
      value
    }
  }
}

```
 
which should respond with:

```json
{
  "data": {
    "corpora": [
        {
            "entities": [
            {
                "id": "df4316867da28567d970ed3d67e246ae315f0f2808bd214e9774646709397119",
                "type": "Person",
                "value": "John",
                "age": 40
            },

            ...
            ]
        }
      ]
    }
  }
}
```

We are done, so can move onto the UI.